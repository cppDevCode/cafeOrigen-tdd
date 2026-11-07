import { useState } from 'react';
import type { Producto } from '../schemas/producto.schema';
import { formatearMoneda } from '../utils/moneda.utils';
import { buscarProductoCafe } from '../utils/buscarProductoCafe';
import styles from './SelectorCafe.module.scss';

type Props = {
  productos: Producto[];
  onAgregar: (producto: Producto) => void;
};

export function SelectorCafe({ productos, onAgregar }: Props) {
  const [bebida, setBebida] = useState<string>('');
  const [tamano, setTamano] = useState<string>('');
  const [variedad, setVariedad] = useState<string>('');

  const productoSeleccionado = (bebida && tamano && variedad) 
    ? buscarProductoCafe(productos, bebida as any, tamano as any, variedad as any)
    : undefined;

  return (
    <section className={styles.contenedor}>
      <h2 className="fs-5 fw-bold m-0">Armá tu café</h2>
      
      {/* PASO 1: BEBIDA */}
      <div>
        <p className="text-secondary fw-bold mb-2" style={{ fontSize: '14px' }}>1. Bebida</p>
        <div className={styles.grupoRadios}>
          {['CAFE_EXPRESO', 'CAFE_FILTRADO'].map((opcion) => (
            <div key={opcion} className={styles.opcionRadio}>
              <input 
                type="radio" id={`bebida-${opcion}`} name="bebida" value={opcion} 
                className={styles.radioOculto} onChange={(e) => setBebida(e.target.value)} 
              />
              <label htmlFor={`bebida-${opcion}`} className={styles.labelRadio}>
                {opcion === 'CAFE_EXPRESO' ? 'Expreso' : 'Filtrado'}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* PASO 2: TAMAÑO */}
      <div>
        <p className="text-secondary fw-bold mb-2" style={{ fontSize: '14px' }}>2. Tamaño</p>
        <div className={styles.grupoRadios}>
          {['POCILLO', 'MEDIANO', 'TAZA_GRANDE'].map((opcion) => (
            <div key={opcion} className={styles.opcionRadio}>
              <input 
                type="radio" id={`tam-${opcion}`} name="tamano" value={opcion} 
                className={styles.radioOculto} onChange={(e) => setTamano(e.target.value)} 
              />
              <label htmlFor={`tam-${opcion}`} className={styles.labelRadio}>
                {opcion === 'POCILLO' ? 'Pocillo' : opcion === 'MEDIANO' ? 'Mediano' : 'Taza Grande'}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* PASO 3: VARIEDAD */}
      <div>
        <p className="text-secondary fw-bold mb-2" style={{ fontSize: '14px' }}>3. Origen</p>
        <div className="d-flex flex-column gap-2">
          {['COLOMBIA', 'ETIOPIA', 'BRASIL'].map((opcion) => {
            const cafeVar = buscarProductoCafe(productos, bebida as any, tamano as any, opcion as any);
            return (
              <div key={opcion} className={styles.opcionRadio}>
                <input 
                  type="radio" id={`var-${opcion}`} name="variedad" value={opcion} 
                  className={styles.radioOculto} onChange={(e) => setVariedad(e.target.value)} 
                />
                <label htmlFor={`var-${opcion}`} className={`${styles.labelRadio} justify-content-between px-3`}>
                  <span>{opcion}</span>
                  <span>{cafeVar ? formatearMoneda(cafeVar.precio) : '—'}</span>
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* PRECIO Y BOTÓN */}
      <div className={styles.precioContainer}>
        <span className={styles.precioTexto}>
          {productoSeleccionado ? formatearMoneda(productoSeleccionado.precio) : '$ -'}
        </span>
        <button 
          className="btn btn-dark px-4 py-2" 
          style={{ backgroundColor: '#c68b59', border: 'none', color: '#1b1210', fontWeight: 'bold' }}
          disabled={!productoSeleccionado} 
          onClick={() => productoSeleccionado && onAgregar(productoSeleccionado)}
        >
          Agregar al carrito
        </button>
      </div>
    </section>
  );
}