import styles from './loading.module.scss';

/**
 * Squelette affiché pendant la récupération des logements.
 * Reproduit la grille pour éviter tout décalage de mise en page (CLS).
 */
export default function Loading() {
  return (
    <div className={styles.grid} aria-busy="true" aria-live="polite">
      <span className="srOnly">Chargement des logements…</span>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className={styles.skeleton} />
      ))}
    </div>
  );
}
