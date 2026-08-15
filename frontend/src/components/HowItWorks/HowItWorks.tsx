import styles from './HowItWorks.module.scss';

interface Step {
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    title: 'Recherchez',
    description:
      'Entrez votre destination, vos dates et laissez Kasa faire le reste.',
  },
  {
    title: 'Réservez',
    description:
      'Profitez d’une plateforme sécurisée et de profils d’hôtes vérifiés.',
  },
  {
    title: 'Vivez l’expérience',
    description:
      'Installez-vous, profitez de votre séjour, et sentez-vous chez vous, partout.',
  },
];

/**
 * Section explicative de la page d'accueil : trois étapes du parcours.
 * Entièrement statique, rendue côté serveur.
 */
export default function HowItWorks() {
  return (
    <section aria-labelledby="fonctionnement-titre" className={styles.section}>
      <div className={styles.intro}>
        <h2 id="fonctionnement-titre" className={styles.title}>
          Comment ça marche&nbsp;?
        </h2>
        <p className={styles.text}>
          Que vous partiez pour un week-end improvisé, des vacances en famille ou
          un voyage professionnel, Kasa vous aide à trouver un lieu qui vous
          ressemble.
        </p>
      </div>

      <ol className={styles.steps}>
        {STEPS.map((step) => (
          <li key={step.title} className={styles.step}>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepText}>{step.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
