import type { Metadata } from 'next';
import Image from 'next/image';
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
          sentir bien.
        </p>
        <p className={styles.lead}>
          Depuis notre création, nous mettons en relation des voyageurs en quête
          d’authenticité avec des hôtes passionnés qui aiment partager leur
          région et leurs bonnes adresses.
        </p>
      </header>

      {/* Images décoratives : le texte porte déjà toute l'information. */}
      <div className={styles.wideImage}>
        <Image
          src="/about-wide.jpg"
          alt=""
          fill
          sizes="(max-width: 1023px) 100vw, 1114px"
          priority
          className={styles.image}
        />
      </div>

      <div className={styles.split}>
        <section className={styles.mission}>
          <h2 className={styles.missionTitle}>Notre mission est simple&nbsp;:</h2>
          <ol className={styles.missionList}>
            <li>Offrir une plateforme fiable et simple d’utilisation</li>
            <li>Proposer des hébergements variés et de qualité</li>
            <li>
              Favoriser des échanges humains et chaleureux entre hôtes et
              voyageurs
            </li>
          </ol>
          <p className={styles.closing}>
            Que vous cherchiez un appartement cosy en centre-ville, une maison en
            bord de mer ou un chalet à la montagne, Kasa vous accompagne pour que
            chaque séjour devienne un souvenir inoubliable.
          </p>
        </section>

        <div className={styles.tallImage}>
          <Image
            src="/about-tall.jpg"
            alt=""
            fill
            sizes="(max-width: 1023px) 100vw, 448px"
            className={styles.image}
          />
        </div>
      </div>
    </article>
  );
}
