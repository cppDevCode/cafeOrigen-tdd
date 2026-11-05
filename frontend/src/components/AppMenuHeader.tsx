import { ParserMesaUrl } from '../utils/mesa.utils';

interface Props {
  searchParams?: string;
}

export function AppMenuHeader({ searchParams = window.location.search }: Props) {
  const modalidad = ParserMesaUrl.desdeSearchParams(searchParams);

  return (
    <header className="app-header">
      <b className="app-header__brand">Café Origen</b>
      <span
        data-testid="modalidad-atencion"
        className="app-header__badge"
      >
        {modalidad.etiqueta}
      </span>
    </header>
  );
}
