import React from 'react';
import { UploadCloud, CheckCircle, AlertTriangle, Image as ImageIcon } from 'lucide-react';

export default function DetectionSystem() {
  return (
    <div className="view-container" style={{ flexDirection: 'row', gap: '32px' }}>
      
      {/* Sección Izquierda*/}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', minHeight: 0 }}>
        <h2 style={{ margin: 0, color: 'var(--color-600)', fontSize: '1.5rem', fontWeight: '600', flexShrink: 0 }}>Sistema de Detección</h2>
        
        {/* Previsualización mantenida a 16:9 con Container Queries matemáticas */}
        <div style={{ flex: 1, minHeight: 0, containerType: 'size', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div 
            className="card-minimal"
            style={{
              width: 'min(100cqi, calc(100cqb * 16 / 9))',
              height: 'min(100cqb, calc(100cqi * 9 / 16))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backgroundColor: 'var(--bg-app)', position: 'relative'
            }}
          >
            <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
              <ImageIcon size={64} style={{ opacity: 0.3, marginBottom: '16px' }} />
              <p style={{ margin: 0, fontSize: '0.9rem' }}>El archivo multimedia aparecerá aquí</p>
            </div>
          </div>
        </div>

        {/* Drag & Drop Area*/}
        <div 
          className="neo-accent-inset"
          style={{
            height: '140px', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            border: '2px dashed var(--color-400)', padding: '20px',
            flexShrink: 0 /* Aseguramos que nunca se aplaste y desaparezca */
          }}
        >
          <div style={{ background: 'var(--color-50)', width: '64px', height: '64px', minHeight: '64px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', flexShrink: 0, marginBottom: '12px' }}>
            <UploadCloud size={32} color="var(--color-500)" />
          </div>
          <p style={{ margin: 0, fontWeight: '500', color: 'var(--text-muted)' }}>
            Arrastra tu imagen/video aquí o <span style={{ color: 'var(--color-500)', textDecoration: 'underline' }}>haz clic</span>
          </p>
        </div>
      </div>

      {/* Sección Derecha: */}
      <div style={{ width: '300px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Lista de placas (Card) */}
        <div className="card-minimal" style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', color: 'var(--text-main)', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            Resultados de la Lectura
          </h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', flex: 1, overflowY: 'auto' }}>
            {/* Elemento de lista (Éxito) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--bg-app)' }}>
              <div>
                <span style={{ fontSize: '1.1rem', fontWeight: 'bold', letterSpacing: '1px', color: 'var(--text-main)' }}>ABC-1234</span>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>99.8% Confianza</div>
              </div>
              <CheckCircle color="var(--color-success)" size={24} />
            </div>

            {/* Elemento de lista (Éxito) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '12px', background: 'var(--bg-app)' }}>
              <div>
                <span style={{ fontSize: '1.1rem', fontWeight: 'bold', letterSpacing: '1px', color: 'var(--text-main)' }}>XYZ-9876</span>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>95.2% Confianza</div>
              </div>
              <CheckCircle color="var(--color-success)" size={24} />
            </div>

            {/* Elemento de lista (Error) */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', border: '1px solid var(--color-error)', borderRadius: '12px', background: 'var(--bg-app)', opacity: 0.9 }}>
              <div>
                <span style={{ fontSize: '1.1rem', fontWeight: 'bold', letterSpacing: '1px', color: 'var(--text-main)' }}>TRK-???</span>
                <div style={{ fontSize: '0.8rem', color: 'var(--color-error)', marginTop: '4px' }}>Lectura Oculta / Ilegible</div>
              </div>
              <AlertTriangle color="var(--color-error)" size={24} />
            </div>
          </div>
        </div>

        {/* Resumen Counters (Acentos Neomórficos) */}
        <div style={{ display: 'flex', gap: '16px' }}>
          <div className="neo-accent" style={{ flex: 1, padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--color-success)', lineHeight: '1' }}>245</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px' }}>Correctas</div>
          </div>
          
          <div className="neo-accent" style={{ flex: 1, padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--color-error)', lineHeight: '1' }}>12</div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '8px', fontWeight: '500', textTransform: 'uppercase', letterSpacing: '1px' }}>Errores</div>
          </div>
        </div>
      </div>

    </div>
  );
}
