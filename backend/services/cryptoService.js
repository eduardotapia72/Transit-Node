const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { app } = require('electron');

const ALGORITHM = 'aes-256-cbc';

// Clave secreta estática generada aleatoriamente de 32 bytes requerida por aes-256
// ATENCIÓN: Al reiniciar la aplicación, esta clave en memoria cambiará y las imágenes anteriores
// no podrán desencriptarse. En una versión de producción, esta clave debe derivarse de una
// contraseña o guardarse de forma segura usando el llavero del S.O. (ej. keytar).
const SECRET_KEY = crypto.randomBytes(32);

/**
 * Garantiza la existencia del directorio donde vivirán los archivos físicos.
 * @returns {string} Ruta absoluta del directorio de imágenes.
 */
function getImagesDirectory() {
  const userDataPath = app.getPath('userData');
  const imagesDir = path.join(userDataPath, 'images');
  
  // Asegurarse de que el directorio exista (crearlo si es necesario)
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }
  
  return imagesDir;
}

/**
 * Recibe una imagen en Base64, la encripta y la guarda en disco.
 * @param {string} imageBase64 - Imagen en formato Base64 (puede incluir el prefijo data:image...)
 * @param {string} fileName - Nombre del archivo a guardar (sin extensión)
 * @returns {string} Ruta absoluta final del archivo (.enc)
 */
function encryptAndSaveImage(imageBase64, fileName) {
  // 1. Limpiar el prefijo de Base64 si existe (ej. "data:image/jpeg;base64,")
  const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
  
  // 2. Convertirlo a un Buffer binario de Node
  const imageBuffer = Buffer.from(base64Data, 'base64');
  
  // 3. Generar un Vector de Inicialización (IV) de 16 bytes único para este archivo
  const iv = crypto.randomBytes(16);
  
  // 4. Crear el esquema de cifrado AES-256-CBC
  const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
  
  // 5. Encriptar el Buffer
  const encryptedBuffer = Buffer.concat([cipher.update(imageBuffer), cipher.final()]);
  
  // 6. Concatenar primero el IV y luego la data cifrada.
  // Es vital guardar el IV junto al archivo, de lo contrario será imposible desencriptarlo luego.
  const finalFileBuffer = Buffer.concat([iv, encryptedBuffer]);
  
  // 7. Configurar la ruta física donde vivirá el archivo opaco (extensión inventada .enc)
  const imagesDir = getImagesDirectory();
  const filePath = path.join(imagesDir, `${fileName}.enc`);
  
  // 8. Escribir el archivo protegido al disco duro
  fs.writeFileSync(filePath, finalFileBuffer);
  
  return filePath;
}

/**
 * Lee un archivo encriptado físico del disco y lo devuelve como código Base64.
 * @param {string} filePath - Ruta absoluta del archivo
 * @returns {string} Código Base64 listo para insertarse en un un src de <img> en React
 */
function decryptImage(filePath) {
  // 1. Leer los bytes crudos del archivo físico
  const encryptedFileBuffer = fs.readFileSync(filePath);
  
  // 2. Separar el IV (los primeros 16 bytes) del resto de contenido cifrado
  // Usamos subarray que es más eficiente en memoria en V8
  const iv = encryptedFileBuffer.subarray(0, 16);
  const encryptedContent = encryptedFileBuffer.subarray(16);
  
  // 3. Crear el motor de desencriptado utilizando nuestra clave maestra y el IV específico de la foto
  const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
  
  // 4. Recuperar los datos originales
  const decryptedBuffer = Buffer.concat([decipher.update(encryptedContent), decipher.final()]);
  
  // 5. Retornar solo la cadena Base64
  // NOTA: El Frontend será el responsable de agregarle "data:image/jpeg;base64," para mostrarlo en HTML.
  return decryptedBuffer.toString('base64');
}

module.exports = {
  encryptAndSaveImage,
  decryptImage
};
