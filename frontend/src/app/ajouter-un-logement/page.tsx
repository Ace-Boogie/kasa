import type { Metadata } from 'next';
import Link from 'next/link';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'Ajouter une propriété',
  description:
    'Publiez votre logement sur Kasa : photos, description, équipements et catégories.',
  robots: { index: false, follow: true },
};

/**
 * Équipements proposés, tels qu'ils figurent dans la maquette.
 * Deux colonnes de douze en desktop, empilées en mobile.
 */
const EQUIPMENTS = [
  'Micro-ondes',
  'Douche italienne',
  'Frigo',
  'WiFi',
  'Parking',
  'Sèche-cheveux',
  'Machine à laver',
  'Cuisine équipée',
  'Télévision',
  'Chambre séparée',
  'Climatisation',
  'Frigo américain',
  'Clic-clac',
  'Four',
  'Rangements',
  'Lit',
  'Bouilloire',
  'Salle de bain',
  'Toilettes sèches',
  'Cintres',
  'Baie vitrée',
  'Hotte',
  'Baignoire',
  'Vue parc',
];

/** Catégories proposées, reprises de la maquette. */
const CATEGORIES = [
  'Parc',
  'Night Life',
  'Culture',
  'Nature',
  'Touristique',
  'Vue sur mer',
  'Pour les couples',
  'Famille',
  'Forêt',
];

/**
 * Page d'ajout d'une propriété.
 *
 * **Interface de présentation, non fonctionnelle.** La publication relève du
 * Sprint 2 : le formulaire n'envoie rien et le bouton « Ajouter » est
 * désactivé. Les routes existent pourtant côté API — `POST /api/properties`
 * et `POST /api/uploads/image`, toutes deux réservées au rôle `owner` — ce
 * qui rend le branchement possible sans modifier le back-end.
 *
 * Composant serveur, sans `"use client"` : la page ne porte aucun état, donc
 * aucun JavaScript n'est envoyé au navigateur pour l'afficher.
 */
export default function AjouterUnLogementPage() {
  return (
    <section className={styles.page} aria-labelledby="ajout-titre">
      <Link href="/" className={styles.back}>
        <span aria-hidden="true">←</span> Retour aux annonces
      </Link>

      <div className={styles.heading}>
        <h1 id="ajout-titre" className={styles.title}>
          Ajouter une propriété
        </h1>

        <button type="button" disabled className={styles.submit}>
          Ajouter
        </button>
      </div>

      <p className={styles.notice}>
        Cette page présente l’interface de publication. L’envoi du formulaire
        n’est pas encore actif&nbsp;: la fonctionnalité relève du Sprint&nbsp;2.
      </p>

      <div className={styles.grid}>
        <fieldset className={`${styles.card} ${styles.cardInfos}`}>
          <legend className="srOnly">Informations du logement</legend>

          <div className={styles.field}>
            <label htmlFor="titre" className={styles.label}>
              Titre de la propriété
            </label>
            <input
              id="titre"
              type="text"
              placeholder="Ex : Appartement cosy au cœur de Paris"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="description" className={styles.label}>
              Description
            </label>
            <textarea
              id="description"
              rows={5}
              placeholder="Décrivez votre propriété en détail…"
              className={styles.textarea}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="code-postal" className={styles.label}>
              Code postal
            </label>
            <input
              id="code-postal"
              type="text"
              inputMode="numeric"
              autoComplete="postal-code"
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="localisation" className={styles.label}>
              Localisation
            </label>
            <input id="localisation" type="text" className={styles.input} />
          </div>
        </fieldset>

        <div className={styles.stack}>
          <fieldset className={styles.card}>
            <legend className="srOnly">Photos du logement</legend>

            <div className={styles.field}>
              <label htmlFor="couverture" className={styles.label}>
                Image de couverture
              </label>
              <div className={styles.inputRow}>
                <input id="couverture" type="text" className={styles.input} />
                <button type="button" disabled className={styles.add}>
                  <span className="srOnly">Ajouter l’image de couverture</span>
                  <span aria-hidden="true">+</span>
                </button>
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="image-logement" className={styles.label}>
                Image du logement
              </label>
              <div className={styles.inputRow}>
                <input id="image-logement" type="text" className={styles.input} />
                <button type="button" disabled className={styles.add}>
                  <span className="srOnly">Ajouter une image du logement</span>
                  <span aria-hidden="true">+</span>
                </button>
              </div>
            </div>

            <p className={styles.addMore}>+ Ajouter une image</p>
          </fieldset>

          <fieldset className={styles.card}>
            <legend className="srOnly">Informations de l’hôte</legend>

            <div className={styles.field}>
              <label htmlFor="hote" className={styles.label}>
                Nom de l’hôte
              </label>
              <input id="hote" type="text" className={styles.input} />
            </div>

            <div className={styles.field}>
              <label htmlFor="photo-profil" className={styles.label}>
                Photo de profil
              </label>
              <div className={styles.inputRow}>
                <input id="photo-profil" type="text" className={styles.input} />
                <button type="button" disabled className={styles.add}>
                  <span className="srOnly">Ajouter la photo de profil</span>
                  <span aria-hidden="true">+</span>
                </button>
              </div>
            </div>

            <p className={styles.addMore}>+ Ajouter une image</p>
          </fieldset>
        </div>

        <fieldset className={`${styles.card} ${styles.cardEquipments}`}>
          <legend className={styles.legend}>Équipements</legend>

          <ul className={styles.checkList}>
            {EQUIPMENTS.map((equipment) => (
              <li key={equipment} className={styles.checkItem}>
                <input
                  type="checkbox"
                  id={`equipement-${equipment}`}
                  className={styles.checkbox}
                />
                <label htmlFor={`equipement-${equipment}`} className={styles.checkLabel}>
                  {equipment}
                </label>
              </li>
            ))}
          </ul>
        </fieldset>

        <fieldset className={`${styles.card} ${styles.cardCategories}`}>
          <legend className={styles.legend}>Catégories</legend>

          <ul className={styles.tagList}>
            {CATEGORIES.map((category) => (
              <li key={category} className={styles.tag}>
                {category}
              </li>
            ))}
          </ul>

          <div className={styles.field}>
            <label htmlFor="categorie" className={styles.label}>
              Ajouter une catégorie personnalisée
            </label>
            <div className={styles.inputRow}>
              <input
                id="categorie"
                type="text"
                placeholder="Nouveau tag"
                className={styles.input}
              />
              <button type="button" disabled className={styles.add}>
                <span className="srOnly">Ajouter la catégorie</span>
                <span aria-hidden="true">+</span>
              </button>
            </div>
          </div>

          <p className={styles.addMore}>+ Ajouter un tag</p>
        </fieldset>
      </div>
    </section>
  );
}
