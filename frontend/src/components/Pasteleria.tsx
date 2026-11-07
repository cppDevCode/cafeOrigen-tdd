import type { Producto } from '../schemas/producto.schema';
import { formatearMoneda } from '../utils/moneda.utils';
import styles from './Pasteleria.module.scss';

type Props = {
  productos: Producto[];
  onAgregar: (producto: Producto) => void;
};

export function Pasteleria({ productos, onAgregar }: Props) {
  const items = productos.filter((p) => p.tipo === 'PASTELERIA');
  if (items.length === 0) return null;

  return (
    <section className={styles.contenedor}>
      <h2 className="fs-5 fw-bold m-0 mb-2">Pastelería</h2>
      
      {items.map((prod) => (
        <div key={prod.id} className={styles.tarjetaPasteleria}>
          <div className={styles.infoPasteleria}>
            <p className={styles.nombre}>{prod.nombre}</p>
            <p className={styles.precio}>{formatearMoneda(prod.precio)}</p>
          </div>
          <button 
            className="btn btn-dark"
            style={{ backgroundColor: '#c68b59', border: 'none', color: '#1b1210', fontWeight: 'bold' }}
            onClick={() => onAgregar(prod)}
          >
            Agregar
          </button>
        </div>
      ))}
    </section>
  );
}