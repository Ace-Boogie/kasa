'use client';

import { useId, useState, type ReactNode } from 'react';
import styles from './Collapse.module.scss';

interface CollapseProps {
  title: string;
  children: ReactNode;
  /** Ouvert dès l'affichage. Fermé par défaut. */
  defaultOpen?: boolean;
  /**
   * Niveau du titre, à ajuster selon la hiérarchie de la page hôte.
   * Un niveau sauté est signalé par les outils d'audit.
   */
  headingLevel?: 2 | 3 | 4;
}

/**
 * Panneau repliable ouvert et fermé au clic.
 *
 * L'animation repose sur `grid-template-rows: 0fr → 1fr` : la hauteur
 * s'anime sans être mesurée en JavaScript, quel que soit le contenu.
 */
export default function Collapse({
                                   title,
                                   children,
                                   defaultOpen = false,
                                   headingLevel = 2,
                                 }: CollapseProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentId = useId();
  const Heading = `h${headingLevel}` as 'h2' | 'h3' | 'h4';

  return (
      <section className={styles.collapse}>
        <Heading className={styles.heading}>
          <button
              type="button"
              onClick={() => setIsOpen((open) => !open)}
              aria-expanded={isOpen}
              aria-controls={contentId}
              className={styles.trigger}
          >
            <span>{title}</span>
            <svg
                viewBox="0 0 16 16"
                width="16"
                height="16"
                aria-hidden="true"
                focusable="false"
                className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
            >
              <path
                  d="M3.5 6l4.5 4.5L12.5 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
              />
            </svg>
          </button>
        </Heading>

        <div
            id={contentId}
            className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}
        >
          <div className={styles.panelInner}>
            {/* `inert` retire le contenu replié du parcours clavier. */}
            <div inert={!isOpen ? true : undefined} className={styles.content}>
              {children}
            </div>
          </div>
        </div>
      </section>
  );
}