import type { Metadata } from 'next';
import { getConversations } from '@/lib/api/messages';
import MessagerieLayout from '@/components/Messagerie/MessagerieLayout';
import styles from './page.module.scss';

export const metadata: Metadata = {
  title: 'Messagerie',
  description:
    'Retrouvez vos échanges avec les hôtes des logements qui vous intéressent.',
  // Les conversations sont propres à chaque visiteur : rien à indexer.
  robots: { index: false, follow: true },
};

/**
 * Page Messagerie — liste des conversations.
 *
 * En desktop, le panneau de droite affiche une invitation à choisir un fil ;
 * en mobile, seule la liste est visible et l'ouverture d'une conversation
 * navigue vers `/messagerie/[id]`.
 */
export default async function MessageriePage() {
  const conversations = await getConversations();

  return (
    <MessagerieLayout conversations={conversations} mobileView="list">
      <p className={styles.placeholder}>
        Sélectionnez une conversation pour afficher les messages.
      </p>
    </MessagerieLayout>
  );
}
