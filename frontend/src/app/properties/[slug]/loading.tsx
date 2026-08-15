import styles from './loading.module.scss';

/** Squelette de la page détail, aux dimensions du contenu final. */
export default function Loading() {
  return (
    <div className={styles.wrapper} aria-busy="true" aria-live="polite">
      <span className="srOnly">Chargement du logement…</span>
      <div className={styles.gallery} />
      <div className={styles.host} />
      <div className={styles.details} />
    </div>
  );
}
