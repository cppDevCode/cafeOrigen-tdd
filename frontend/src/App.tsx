
import { AppMenuHeader } from './components/AppMenuHeader';
import { MenuContainer } from './components/MenuContainer';
import { Carrito } from './components/Carrito';
import { CarritoProvider, useCarrito } from './carrito/carrito.context';
import { ParserMesaUrl } from './utils/mesa.utils';

function MenuConCarrito() {
  const { dispatch } = useCarrito();

  return (
    <MenuContainer
      onAgregarProducto={(producto) =>
        dispatch({
          type: 'AGREGAR_PRODUCTO',
          producto,
        })
      }
    />
  );
}

export function App() {
  const modalidad = ParserMesaUrl.desdeSearchParams(window.location.search);

  return (
    <CarritoProvider>
      <div className="app-shell">
        <AppMenuHeader />
        <main>
          <MenuConCarrito />
          <Carrito mesaId={modalidad.obtenerMesaId()} />
        </main>
      </div>
    </CarritoProvider>
  );
}
