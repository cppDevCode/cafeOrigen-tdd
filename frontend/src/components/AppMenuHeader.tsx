import { ParserMesaUrl } from '../utils/mesa.utils';
import styles from './AppMenuHeader.module.scss';

interface Props {
  searchParams?: string;
}

export function AppMenuHeader({ searchParams = window.location.search }: Props) {
  const modalidad = ParserMesaUrl.desdeSearchParams(searchParams);

  return (
    <header className={styles.header}>
      <b className={styles.brand}>Café Origen</b>
      <span
        data-testid="modalidad-atencion"
        className={styles.badgeModalidad}
      >
        {modalidad.etiqueta}
      </span>
    </header>
  );
}
