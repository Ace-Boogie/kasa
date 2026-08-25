'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { Conversation, Message } from '@/types/message';
import { dayKey, formatDay, formatFullDate, formatTime } from './formatDate';
import styles from './MessageThread.module.scss';

interface MessageThreadProps {
  conversation: Conversation;
}

/**
 * Fil de discussion avec un hôte, et champ de rédaction.
 *
 * Composant client : il porte l'état des messages envoyés pendant la visite
 * et le défilement automatique vers le bas.
 *
 * Les messages envoyés s'affichent immédiatement mais ne sont pas conservés :
 * le back-end fourni n'expose aucune route de messagerie, et le brief place
 * cette fonctionnalité en Sprint 2. Le jour où `POST /api/conversations/:id/
 * messages` existera, seul `handleSubmit` changera.
 */
export default function MessageThread({ conversation }: MessageThreadProps) {
  const { host, propertySlug, propertyTitle, messages: initialMessages } =
    conversation;

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [draft, setDraft] = useState('');
  const endRef = useRef<HTMLDivElement>(null);
  const composerId = useId();

  // Le fil s'ouvre sur le dernier message, comme toute messagerie.
  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [messages.length]);

  function handleSubmit() {
    const body = draft.trim();
    if (!body) return;

    setMessages((current) => [
      ...current,
      {
        id: `local-${current.length + 1}`,
        author: 'me',
        body,
        sentAt: new Date().toISOString(),
      },
    ]);
    setDraft('');
  }

  return (
    <div className={styles.thread}>
      <header className={styles.header}>
        {/* Visible en mobile seulement : en desktop, la liste reste affichée
            à gauche et ce retour n'aurait pas de sens. */}
        <Link href="/messagerie" className={styles.back}>
          <span aria-hidden="true">←</span> Retour aux messages
        </Link>

        <h1 className={styles.title}>
          Conversation avec {host.name}
          <Link href={`/properties/${propertySlug}`} className={styles.property}>
            {propertyTitle}
          </Link>
        </h1>
      </header>

      <ol className={styles.messages} aria-live="polite">
        {messages.map((message, index) => {
          const previous = messages[index - 1];
          const startsNewDay =
            !previous || dayKey(previous.sentAt) !== dayKey(message.sentAt);
          const isMine = message.author === 'me';

          return (
            <li key={message.id}>
              {startsNewDay && (
                <p className={styles.day}>
                  <span>{formatDay(message.sentAt)}</span>
                </p>
              )}

              <article
                className={`${styles.message} ${isMine ? styles.messageMine : ''}`}
              >
                <Image
                  src={host.picture}
                  alt=""
                  width={28}
                  height={28}
                  className={styles.avatar}
                />

                <div className={styles.bubbleGroup}>
                  <p className={styles.author}>
                    {isMine ? 'Vous' : host.name}
                    <span aria-hidden="true" className={styles.dot} />
                    <time dateTime={message.sentAt}>
                      <span className="srOnly">
                        {formatFullDate(message.sentAt)}
                      </span>
                      <span aria-hidden="true">{formatTime(message.sentAt)}</span>
                    </time>
                  </p>

                  <p className={styles.bubble}>{message.body}</p>
                </div>
              </article>
            </li>
          );
        })}
        <div ref={endRef} />
      </ol>

      <div className={styles.composer} id="nouveau-message">
        <label htmlFor={composerId} className="srOnly">
          Votre message à {host.name}
        </label>

        <textarea
          id={composerId}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            // Entrée envoie, Maj+Entrée passe à la ligne — la convention
            // de toutes les messageries.
            if (event.key === 'Enter' && !event.shiftKey) {
              event.preventDefault();
              handleSubmit();
            }
          }}
          placeholder="Envoyer un message"
          rows={2}
          className={styles.input}
        />

        <button
          type="button"
          onClick={handleSubmit}
          disabled={draft.trim().length === 0}
          className={styles.send}
        >
          <span className="srOnly">Envoyer le message</span>
          <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false">
            <path
              d="M3 8h10M9 4l4 4-4 4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      <p className={styles.notice}>
        Les messages envoyés ne sont pas conservés&nbsp;: la messagerie relève
        du Sprint&nbsp;2 et l’API fournie n’expose pas encore de route dédiée.
      </p>
    </div>
  );
}
