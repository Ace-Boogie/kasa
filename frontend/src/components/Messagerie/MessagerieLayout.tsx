import type { ReactNode } from 'react';
import Link from 'next/link';
import ConversationList from './ConversationList';
import type { ConversationSummary } from '@/types/message';
import styles from './MessagerieLayout.module.scss';

interface MessagerieLayoutProps {
  conversations: ConversationSummary[];
  /** Conversation ouverte, mise en évidence dans la liste. */
  activeId?: string;
  /**
   * Panneau visible en mobile. Les deux panneaux coexistent en desktop,
   * comme dans la maquette ; en mobile, ils deviennent deux écrans.
   */
  mobileView: 'list' | 'detail';
  /**
   * Niveau du titre « Messages ». Il porte le `h1` de la page liste, mais
   * passe en `h2` sur la page d'un fil, dont le `h1` nomme l'interlocuteur.
   */
  listHeadingLevel?: 1 | 2;
  /** Panneau de droite : un fil de discussion, ou un état vide. */
  children: ReactNode;
}

/**
 * Coquille à deux panneaux de la messagerie.
 *
 * Composant serveur. Un seul balisage sert les deux routes : `/messagerie`
 * affiche la liste, `/messagerie/[id]` ajoute le fil. La bascule mobile est
 * purement visuelle — chaque écran reste une URL distincte, ce qui donne son
 * sens au bouton retour.
 */
export default function MessagerieLayout({
  conversations,
  activeId,
  mobileView,
  listHeadingLevel = 1,
  children,
}: MessagerieLayoutProps) {
  const Heading = `h${listHeadingLevel}` as 'h1' | 'h2';

  return (
    <div className={styles.shell}>
      <section
        className={`${styles.panel} ${styles.listPanel} ${
          mobileView === 'detail' ? styles.hiddenOnMobile : ''
        }`}
        aria-labelledby="messages-titre"
      >
        <div className={styles.listHeader}>
          <Link href="/" className={styles.back}>
            <span aria-hidden="true">←</span> Retour aux logements
          </Link>

          <Heading id="messages-titre" className={styles.listTitle}>
            Messages
          </Heading>
        </div>

        <div className={styles.listScroll}>
          <ConversationList conversations={conversations} activeId={activeId} />
        </div>
      </section>

      <div
        className={`${styles.panel} ${styles.detailPanel} ${
          mobileView === 'list' ? styles.hiddenOnMobile : ''
        }`}
      >
        {children}
      </div>
    </div>
  );
}
