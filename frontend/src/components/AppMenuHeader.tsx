import { ParserMesaUrl } from '../utils/mesa.utils';

interface Props {
  searchParams?: string;
}

export function AppMenuHeader({ searchParams = window.location.search }: Props) {
  const modalidad = ParserMesaUrl.desdeSearchParams(searchParams);

  return (
    <header className="navbar navbar-dark bg-dark px-3 py-2 mb-4">
      <span className="navbar-brand mb-0 h1">Café de Origen</span>
      <span
        data-testid="modalidad-atencion"
        className={`badge ${modalidad.esMesa() ? 'bg-success' : 'bg-secondary'} fs-6`}
      >
        {modalidad.etiqueta}
      </span>
    </header>
  );
}
