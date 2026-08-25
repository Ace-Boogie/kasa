import Link from 'next/link';
import Image from 'next/image';
import type { ConversationSummary } from '@/types/message';
import { formatFullDate, formatTime } from './formatDate';
import styles from './ConversationList.module.scss';

interface ConversationListProps {
  conversations: ConversationSummary[];
  /** Conversation ouverte, mise en évidence dans la liste. */
  activeId?: string;
}

/**
 * Colonne de gauche de la messagerie : les conversations de l'utilisateur,
 * la plus récente en premier.
 *
 * Composant serveur — la liste est figée au rendu, seule l'ouverture d'un fil
 * navigue. Chaque ligne est un lien vers `/messagerie/[id]`.
 */
export default function ConversationList({
  conversations,
  activeId,
}: ConversationListProps) {
  if (conversations.length === 0) {
    return (
      <p className={styles.empty}>
        Vous n’avez pas encore de conversation. Ouvrez la page d’un logement et
        contactez son hôte pour démarrer un échange.
      </p>
    );
  }

  return (
    <ul className={styles.list}>
      {conversations.map((conversation) => {
        const { id, host, lastMessage, lastMessageAt, isUnread } = conversation;
        const isActive = id === activeId;

        return (
          <li
            key={id}
            className={`${styles.item} ${isActive ? styles.itemActive : ''}`}
          >
            <Image
              src={host.picture}
              alt=""
              width={45}
              height={45}
              className={styles.avatar}
            />

            <div className={styles.text}>
              <p className={`${styles.name} ${isUnread ? styles.nameUnread : ''}`}>
                <Link
                  href={`/messagerie/${id}`}
                  className={styles.link}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {host.name}
                </Link>
              </p>
              <p className={styles.preview}>{lastMessage}</p>
            </div>

            <div className={styles.meta}>
              <time dateTime={lastMessageAt} className={styles.time}>
                {formatTime(lastMessageAt)}
              </time>
              {isUnread && (
                <span className={styles.unread}>
                  <span className="srOnly">Non lu</span>
                </span>
              )}
            </div>

            {/* Date complète réservée aux lecteurs d'écran : l'heure seule est
                ambiguë dès que l'échange date de plusieurs jours. */}
            <span className="srOnly">
              Dernier message le {formatFullDate(lastMessageAt)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}
