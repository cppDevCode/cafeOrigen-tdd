import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

export const handlersPorDefecto = [
  http.get('*/api/productos', () =>
    HttpResponse.json([
      {
        id: 1,
        nombre: 'Expreso Pocillo Brasil',
        tipo: 'CAFE_EXPRESO',
        precioBase: 2500,
        tamano: 'POCILLO',
        gramos: 18,
        variedad: 'BRASIL',
        descripcionVariedad: 'Café de origen brasileño',
        precio: 5020,
      },
      {
        id: 2,
        nombre: 'Muffin de chocolate',
        tipo: 'PASTELERIA',
        precioBase: 2500,
        precio: 2500,
      },
    ])
  ),
];

export const server = setupServer(...handlersPorDefecto);
