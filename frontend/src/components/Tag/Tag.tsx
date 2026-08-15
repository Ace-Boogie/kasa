import styles from './Tag.module.scss';

/** Pastille grise : un équipement ou une catégorie. */
export default function Tag({ children }: { children: string }) {
  return <li className={styles.tag}>{children}</li>;
}
