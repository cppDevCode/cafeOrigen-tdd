import { useState } from 'react';
import type { Producto } from '../schemas/producto.schema'; 
import { formatearMoneda } from '../utils/moneda.utils'; 
import { buscarProductoCafe } from '../utils/buscarProductoCafe'; 

type Props = {
  productos: Producto[];
  onAgregar: (producto: Producto) => void;
};

export function SelectorCafe({ productos, onAgregar }: Props) {
  const [bebida, setBebida] = useState<'CAFE_EXPRESO' | 'CAFE_FILTRADO' | ''>('');
  const [tamano, setTamano] = useState<'POCILLO' | 'MEDIANO' | 'TAZA_GRANDE' | ''>('');
  const [variedad, setVariedad] = useState<'BRASIL' | 'COLOMBIA' | 'ETIOPIA' | ''>('');


    const productoSeleccionado = (bebida && tamano && variedad) 
    ? buscarProductoCafe(productos, bebida, tamano, variedad) 
    : undefined;

  const handleAgregar = () => {
    if (productoSeleccionado) {
      onAgregar(productoSeleccionado);
    }
  };

  return (
    <div className="mb-4">
      <h3>Armá tu Café</h3>
      
      {/* PASO 1: BEBIDA */}
      <fieldset className="mb-3">
        <legend className="fs-6">1. Elegí tu bebida</legend>
        <div className="form-check form-check-inline">
          <input className="form-check-input" type="radio" id="bebida-expreso" name="bebida" 
            value="CAFE_EXPRESO" onChange={(e) => setBebida(e.target.value as 'CAFE_EXPRESO' | 'CAFE_FILTRADO')} />
          <label className="form-check-label" htmlFor="bebida-expreso">Expreso</label>
        </div>
        <div className="form-check form-check-inline">
          <input className="form-check-input" type="radio" id="bebida-filtrado" name="bebida" 
            value="CAFE_FILTRADO" onChange={(e) => setBebida(e.target.value as 'CAFE_EXPRESO' | 'CAFE_FILTRADO')} />
          <label className="form-check-label" htmlFor="bebida-filtrado">Filtrado</label>
        </div>
      </fieldset>

      {/* PASO 2: TAMAÑO */}
      <fieldset className="mb-3">
        <legend className="fs-6">2. Elegí el tamaño</legend>
        <div className="form-check form-check-inline">
            <input className="form-check-input" type="radio" id="tam-pocillo" name="tamano" 
                value="POCILLO" onChange={(e) => setTamano(e.target.value as 'POCILLO' | 'MEDIANO' | 'TAZA_GRANDE')} />
            <label className="form-check-label" htmlFor="tam-pocillo">Pocillo</label>
        </div>
        <div className="form-check form-check-inline">
          <input className="form-check-input" type="radio" id="tam-mediano" name="tamano" 
            value="MEDIANO" onChange={(e) => setTamano(e.target.value as 'POCILLO' | 'MEDIANO' | 'TAZA_GRANDE')} />
          <label className="form-check-label" htmlFor="tam-mediano">Mediano</label> 
        </div>
        <div className="form-check form-check-inline">
          <input className="form-check-input" type="radio" id="tam-grande" name="tamano" 
            value="TAZA_GRANDE" onChange={(e) => setTamano(e.target.value as 'POCILLO' | 'MEDIANO' | 'TAZA_GRANDE')} />
          <label className="form-check-label" htmlFor="tam-grande">Taza Grande</label>
        </div>
      </fieldset>

      {/* PASO 3: VARIEDAD */}
      <fieldset className="mb-3">
        <legend className="fs-6">3. Elegí el origen</legend>
        <div className="form-check form-check-inline">
          <input className="form-check-input" type="radio" id="var-colombia" name="variedad" 
            value="COLOMBIA" onChange={(e) => setVariedad(e.target.value as 'BRASIL' | 'COLOMBIA' | 'ETIOPIA')} />
          <label className="form-check-label" htmlFor="var-colombia">Colombia</label>
        </div>
        <div className="form-check form-check-inline">
          <input className="form-check-input" type="radio" id="var-etiopia" name="variedad" 
            value="ETIOPIA" onChange={(e) => setVariedad(e.target.value as 'BRASIL' | 'COLOMBIA' | 'ETIOPIA')} />
          <label className="form-check-label" htmlFor="var-etiopia">Etiopía</label>
        </div>
        <div className="form-check form-check-inline">
          <input className="form-check-input" type="radio" id="var-brasil" name="variedad" 
            value="BRASIL" onChange={(e) => setVariedad(e.target.value as 'BRASIL' | 'COLOMBIA' | 'ETIOPIA')} />
          <label className="form-check-label" htmlFor="var-brasil">Brasil</label>
        </div>
      </fieldset>

      {/* DESCRIPCIÓN Y PRECIO */}
      {productoSeleccionado && 'descripcionVariedad' in productoSeleccionado && (
        <div className="alert alert-info py-2">
          <small><strong>Notas:</strong> {productoSeleccionado.descripcionVariedad}</small>
        </div>
      )}

      <div className="d-flex align-items-center gap-3 mt-3">
        <span className="fs-4 fw-bold">
          {productoSeleccionado ? formatearMoneda(productoSeleccionado.precio) : '$ -'}
        </span>
        <button 
          className="btn btn-dark" 
          disabled={!productoSeleccionado} 
          onClick={handleAgregar}
        >
          Agregar al carrito
        </button>
      </div>
    </div>
  );
}