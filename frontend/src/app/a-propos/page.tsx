import type { Metadata } from 'next';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'À propos',
  description:
    'Kasa met en relation des voyageurs en quête d’authenticité avec des hôtes passionnés. Découvrez notre mission.',
};

/** Page institutionnelle. Entièrement statique, rendue côté serveur. */
export default function AboutPage() {
  return (
    <article className={styles.container}>
      <header className={styles.intro}>
        <h1 className={styles.title}>À propos</h1>
        <p className={styles.lead}>
          Chez Kasa, nous croyons que chaque voyage mérite un lieu unique où se
          sentir bien. Depuis notre création, nous mettons en relation des
          voyageurs en quête d’authenticité avec des hôtes passionnés qui aiment
          partager leur région et leurs bonnes adresses.
        </p>
      </header>

      <section className={styles.mission}>
        <h2 className={styles.missionTitle}>Notre mission est simple :</h2>
        <ul className={styles.missionList}>
          <li>Offrir une plateforme fiable et simple d’utilisation</li>
          <li>Proposer des hébergements variés et de qualité</li>
          <li>Favoriser des échanges humains et chaleureux entre hôtes et voyageurs</li>
        </ul>
        <p className={styles.closing}>
          Que vous cherchiez un appartement cosy en centre-ville, une maison en
          bord de mer ou un chalet à la montagne, Kasa vous accompagne pour que
          chaque séjour devienne un souvenir inoubliable.
        </p>
      </section>
    </article>
  );
}
