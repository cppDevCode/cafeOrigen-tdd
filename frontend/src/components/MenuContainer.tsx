import { useEffect, useState, useCallback, type ReactNode } from 'react';
import { clienteApiPorDefecto, type ICatalogoCliente } from '../services/clienteApi';
import type { Producto } from '../schemas/producto.schema';
import { SelectorCafe } from './SelectorCafe'; 
import { Pasteleria } from './Pasteleria';  

export type EstadoMenu =
  | { status: 'cargando' }
  | { status: 'error'; error: string }
  | { status: 'listo'; productos: Producto[] };

export class FabricaEstadoMenu {
  static cargando(): EstadoMenu {
    return { status: 'cargando' };
  }
  static listo(productos: Producto[]): EstadoMenu {
    return { status: 'listo', productos };
  }
  static fallo(err: unknown): EstadoMenu {
    const mensaje = err instanceof Error ? err.message : 'Error desconocido al cargar el menú';
    return { status: 'error', error: mensaje };
  }
}

interface Props {
  servicioCatalogo?: ICatalogoCliente;
  renderCatalogo?: (productos: Producto[]) => ReactNode;
  onAgregarProducto?: (producto: Producto) => void;
}

export function MenuContainer({
  servicioCatalogo = clienteApiPorDefecto,
  renderCatalogo,
  onAgregarProducto,
}: Props) {
  const [estado, setEstado] = useState<EstadoMenu>(() => FabricaEstadoMenu.cargando());

  const cargarMenu = useCallback(async () => {
    setEstado(FabricaEstadoMenu.cargando());
    try {
      const productos = await servicioCatalogo.obtenerProductos();
      setEstado(FabricaEstadoMenu.listo(productos));
    } catch (err) {
      setEstado(FabricaEstadoMenu.fallo(err));
    }
  }, [servicioCatalogo]);

  useEffect(() => {
    void cargarMenu();
  }, [cargarMenu]);

  if (estado.status === 'cargando') {
    return (
      <div role="status" aria-live="polite" className="menu-container">
        <div className="menu-container__carga-encabezado">
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            aria-hidden="true"
            className="menu-container__icono-carga"
          >
            <circle cx="14" cy="14" r="11" fill="none" stroke="#E8DDCF" strokeWidth="4" />
            <path
              d="M14 3a11 11 0 0 1 11 11"
              fill="none"
              stroke="#3E2723"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
          <h2 className="menu-container__titulo">Cargando menú...</h2>
        </div>
        <div className="menu-container__skeleton" aria-hidden="true" />
        <div className="menu-container__skeleton" aria-hidden="true" />
        <div className="menu-container__skeleton" aria-hidden="true" />
      </div>
    );
  }

  if (estado.status === 'error') {
    return (
      <div className="menu-container">
        <div role="alert" className="menu-container__alerta-error">
          <b>No pudimos cargar el menú</b>
          <p className="menu-container__detalle-error">
            {estado.error}. Revisá tu conexión e intentá de nuevo.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary menu-container__reintentar"
          onClick={() => void cargarMenu()}
        >
          Reintentar
        </button>
      </div>
    );
  }

  if (renderCatalogo) {
    return <>{renderCatalogo(estado.productos)}</>;
  }

  return (
    <section aria-label="Menú de productos" className="menu-container">
      <SelectorCafe
        productos={estado.productos}
        onAgregar={onAgregarProducto || ((prod) => console.log('Agregar café:', prod))}
      />
      <Pasteleria
        productos={estado.productos}
        onAgregar={onAgregarProducto || ((prod) => console.log('Agregar pastelería:', prod))}
      />
    </section>
  );
}