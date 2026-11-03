import type { Producto } from '../schemas/producto.schema';
import { formatearMoneda } from '../utils/moneda.utils';

type Props = {
  productos: Producto[];
  onAgregar: (producto: Producto) => void;
};

export function Pasteleria({ productos, onAgregar }: Props) {
  // Filtramos solo los productos de tipo PASTELERIA
  const items = productos.filter((p) => p.tipo === 'PASTELERIA');

  if (items.length === 0) return null;

  return (
    <div className="mt-4">
      <h3 className="mb-3">Pastelería</h3>
      <div className="d-flex gap-3 flex-wrap">
        {items.map((prod) => (
          <div key={prod.id} className="card shadow-sm" style={{ width: '18rem' }}>
            <div className="card-body d-flex flex-column justify-content-between">
              <h5 className="card-title">{prod.nombre}</h5>
              <p className="card-text fs-5 fw-bold">{formatearMoneda(prod.precio)}</p>
              <button 
                className="btn btn-dark w-100" 
                onClick={() => onAgregar(prod)}
                aria-label={`Agregar ${prod.nombre}`}
              >
                Agregar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}