
import { AppMenuHeader } from './components/AppMenuHeader';
import { MenuContainer } from './components/MenuContainer';
import { Carrito } from './components/Carrito';
import { CarritoProvider, useCarrito } from './carrito/carrito.context';
import type { Producto } from './schemas/producto.schema';

function CatalogoConCarrito({ productos }: { productos: Producto[] }) {
  const { dispatch } = useCarrito();

  return (
    <section aria-label="Menú de productos" className="container">
      <ul className="list-group">
        {productos.map((producto) => (
          <li
            key={producto.id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <span>{producto.nombre}</span>
            <span className="badge bg-primary rounded-pill">
              ${producto.precio}
            </span>
            <button
              type="button"
              className="btn btn-primary"
              aria-label={`Agregar ${producto.nombre} al carrito`}
              onClick={() =>
                dispatch({
                  type: 'AGREGAR_PRODUCTO',
                  producto
                })
              }
            >
              Agregar
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}

function obtenerMesaId(): number | undefined {
  const valor = new URLSearchParams(window.location.search).get('mesa');

  if (!valor || !/^[1-9]\d*$/.test(valor)) {
    return undefined;
  }

  const numero = Number(valor);

  return Number.isSafeInteger(numero) ? numero : undefined;
}

export function App() {
  return (
    <CarritoProvider>
      <AppMenuHeader />
      <main>
        <MenuContainer
          renderCatalogo={(productos) => (
            <CatalogoConCarrito productos={productos} />
          )}
        />
        <Carrito mesaId={obtenerMesaId()} />
      </main>
    </CarritoProvider>
  );
}
