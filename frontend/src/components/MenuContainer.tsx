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
      <div role="status" className="text-center my-5">
        <div className="spinner-border text-primary me-2" aria-hidden="true" />
        <span>Cargando menú...</span>
      </div>
    );
  }

  if (estado.status === 'error') {
    return (
      <div role="alert" className="alert alert-danger d-flex flex-column align-items-center my-4">
        <p className="mb-2">{estado.error}</p>
        <button type="button" className="btn btn-outline-danger" onClick={() => void cargarMenu()}>
          Reintentar
        </button>
      </div>
    );
  }

  if (renderCatalogo) {
    return <>{renderCatalogo(estado.productos)}</>;
  }

  // ACÁ ESTÁ TU CÓDIGO LIMPIO
  return (
    <section aria-label="Menú de productos" className="container my-4">
      <div className="mb-5">
        <SelectorCafe 
          productos={estado.productos} 
          onAgregar={onAgregarProducto || ((prod) => console.log('Agregar café:', prod))} 
        />
        
        <Pasteleria 
          productos={estado.productos} 
          onAgregar={onAgregarProducto || ((prod) => console.log('Agregar pastelería:', prod))} 
        />
      </div>
    </section>
  );
}