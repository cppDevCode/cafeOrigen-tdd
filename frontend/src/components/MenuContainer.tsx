import { useEffect, useState, useCallback, useMemo, type ReactNode } from 'react';
import { clienteApiPorDefecto, type ICatalogoCliente } from '../services/clienteApi';
import type { Producto } from '../schemas/producto.schema';
import { CatalogoMenu, SeleccionCafe } from '../utils/buscarProductoCafe';
import { FormateadorMoneda } from '../utils/moneda.utils';
import styles from './MenuContainer.module.scss';

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

interface CatalogoInteractivoProps {
  productos: Producto[];
  onAgregarProducto?: (producto: Producto) => void;
}

function CatalogoInteractivo({ productos, onAgregarProducto }: CatalogoInteractivoProps) {
  const catalogo = useMemo(() => new CatalogoMenu(productos), [productos]);
  const [seleccion, setSeleccion] = useState<SeleccionCafe>(() =>
    catalogo.crearSeleccionInicial()
  );

  useEffect(() => {
    setSeleccion(catalogo.crearSeleccionInicial());
  }, [catalogo]);

  const cafeSeleccionado = catalogo.buscarCafe(seleccion);
  const pasteleria = catalogo.obtenerPasteleria();

  return (
    <section aria-label="Menú de productos" className={styles.contenedorMenu}>
      <h2 className={styles.tituloSeccion}>Armá tu café</h2>

      <p className={styles.etiquetaPaso}>1. Bebida</p>
      <div className={styles.filaOpciones}>
        {CatalogoMenu.OPCIONES_BEBIDA.map((opcion) => {
          const activo = seleccion.esTipo(opcion.valor);
          return (
            <button
              key={opcion.valor}
              type="button"
              aria-pressed={activo}
              className={`${styles.botonOpcion ?? ''} ${activo ? (styles.botonOpcionActivo ?? '') : ''}`.trim()}
              onClick={() => setSeleccion((prev) => prev.conTipo(opcion.valor))}
            >
              {opcion.etiqueta}
            </button>
          );
        })}
      </div>

      <p className={styles.etiquetaPaso}>2. Tamaño</p>
      <div className={styles.filaOpciones}>
        {CatalogoMenu.OPCIONES_TAMANO.map((opcion) => {
          const activo = seleccion.esTamano(opcion.valor);
          return (
            <button
              key={opcion.valor}
              type="button"
              aria-pressed={activo}
              className={`${styles.botonOpcion ?? ''} ${activo ? (styles.botonOpcionActivo ?? '') : ''}`.trim()}
              onClick={() => setSeleccion((prev) => prev.conTamano(opcion.valor))}
            >
              {opcion.etiqueta}
            </button>
          );
        })}
      </div>

      <p className={styles.etiquetaPaso}>3. Origen</p>
      {CatalogoMenu.OPCIONES_ORIGEN.map((opcion) => {
        const activo = seleccion.esVariedad(opcion.valor);
        const cafeVariedad = catalogo.buscarCafePorVariedad(seleccion, opcion.valor);
        const descripcion = catalogo.obtenerDescripcionVariedad(seleccion, opcion.valor);

        return (
          <button
            key={opcion.valor}
            type="button"
            aria-pressed={activo}
            className={`${styles.tarjeta ?? ''} ${styles.tarjetaInteractiva ?? ''} ${activo ? (styles.tarjetaActiva ?? '') : ''}`.trim()}
            onClick={() => setSeleccion((prev) => prev.conVariedad(opcion.valor))}
          >
            <div>
              <b>{opcion.etiqueta}</b>
              <p className={styles.descripcionVariedad}>{descripcion}</p>
            </div>
            <span className={styles.precio}>
              {cafeVariedad
                ? FormateadorMoneda.formatearPrecioMenu(cafeVariedad.precio)
                : '—'}
            </span>
          </button>
        );
      })}

      <button
        type="button"
        className={styles.botonAccion}
        disabled={!cafeSeleccionado}
        aria-label={
          cafeSeleccionado
            ? `Agregar ${cafeSeleccionado.nombre} al carrito`
            : 'Agregar al carrito'
        }
        onClick={() => {
          if (cafeSeleccionado) {
            onAgregarProducto?.(cafeSeleccionado);
          }
        }}
      >
        Agregar al carrito
      </button>

      <h2 className={styles.tituloPasteleria}>Pastelería</h2>
      {pasteleria.map((prod) => (
        <div key={prod.id} className={styles.tarjeta}>
          <div>
            <b>{prod.nombre}</b>
            <p className={styles.precioPasteleria}>
              {FormateadorMoneda.formatearPrecioMenu(prod.precio)}
            </p>
          </div>
          <button
            type="button"
            className={styles.botonAccion}
            aria-label={`Agregar ${prod.nombre} al carrito`}
            onClick={() => onAgregarProducto?.(prod)}
          >
            Agregar
          </button>
        </div>
      ))}
    </section>
  );
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
      <div role="status" aria-live="polite" className={styles.contenedorMenu}>
        <div className={styles.encabezadoCarga}>
          <svg
            width="28"
            height="28"
            viewBox="0 0 28 28"
            aria-hidden="true"
            className={styles.iconoCarga}
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
          <h2 className={styles.tituloSeccion}>Cargando menú...</h2>
        </div>
        <div className={styles.bloqueSkeleton} aria-hidden="true" />
        <div className={styles.bloqueSkeleton} aria-hidden="true" />
        <div className={styles.bloqueSkeleton} aria-hidden="true" />
      </div>
    );
  }

  if (estado.status === 'error') {
    return (
      <div className={styles.contenedorMenu}>
        <div role="alert" className={styles.alertaError}>
          <b>No pudimos cargar el menú</b>
          <p className={styles.detalleError}>
            {estado.error}. Revisá tu conexión e intentá de nuevo.
          </p>
        </div>
        <button
          type="button"
          className={styles.botonAccion}
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
    <CatalogoInteractivo
      productos={estado.productos}
      onAgregarProducto={onAgregarProducto}
    />
  );
}
