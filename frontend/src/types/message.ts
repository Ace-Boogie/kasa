import type { Host } from './property';

/**
 * Auteur d'un message.
 *
 * `me` désigne l'utilisateur connecté, `host` l'hôte du logement. Le point de
 * vue est toujours celui de l'utilisateur : c'est lui qui détermine de quel
 * côté la bulle s'affiche.
 */
export type MessageAuthor = 'me' | 'host';

/** Message unitaire dans un fil de discussion. */
export interface Message {
  id: string;
  author: MessageAuthor;
  body: string;
  /** Date d'envoi au format ISO 8601, fuseau inclus. */
  sentAt: string;
}

/** Conversation telle qu'affichée dans la liste de gauche. */
export interface ConversationSummary {
  id: string;
  /** Interlocuteur : l'hôte du logement concerné. */
  host: Host;
  /** Logement à l'origine de l'échange — sert de contexte et de lien retour. */
  propertyId: string;
  propertySlug: string;
  propertyTitle: string;
  /** Dernier message du fil, tronqué à l'affichage. */
  lastMessage: string;
  lastMessageAt: string;
  /** Le dernier message vient de l'hôte et n'a pas été ouvert. */
  isUnread: boolean;
}

/** Conversation complète, avec son fil de messages. */
export interface Conversation extends ConversationSummary {
  messages: Message[];
}

/**
 * Réponse brute, en snake_case.
 *
 * Reproduit la forme qu'aurait une future route Express, alignée sur les
 * conventions des tables SQLite existantes. Utilisée uniquement par la couche
 * `lib/api` — les composants ne la voient jamais.
 */
export interface RawConversation {
  id: string;
  host: Host;
  property_id: string;
  property_slug: string;
  property_title: string;
  is_unread: boolean;
  messages: RawMessage[];
}

/** Message brut, en snake_case. */
export interface RawMessage {
  id: string;
  author: MessageAuthor;
  body: string;
  sent_at: string;
}
