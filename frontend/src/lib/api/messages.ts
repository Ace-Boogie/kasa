import mockConversations from './conversations.mock.json';
import type {
    Conversation,
    ConversationSummary,
    Message,
    RawConversation,
    RawMessage,
} from '@/types/message';

/**
 * Source des conversations : les données figées, en toutes circonstances.
 *
 * Contrairement aux logements, la messagerie n'a pas deux sources entre
 * lesquelles basculer. Le back-end fourni n'expose aucune route : ni table
 * `conversations`, ni table `messages`, ni entrée dans `routes/api.js`. Tester
 * `process.env.API_URL` comme le fait `properties.ts` reviendrait à interroger
 * une route inexistante dès que le back-end est lancé, et à recevoir un 404.
 *
 * Le mock reproduit néanmoins la forme qu'aurait la réponse d'Express —
 * `snake_case`, aligné sur les colonnes SQLite — et passe par la même
 * normalisation. Le jour où les routes existent, il suffira de rétablir la
 * bascule `USE_MOCK` et d'appeler `apiFetch` dans les deux fonctions
 * ci-dessous : les composants, eux, ne changeront pas.
 */
const conversations = mockConversations as RawConversation[];

/** Convertit un message brut en camelCase. */
function normalizeMessage(raw: RawMessage): Message {
    return {
        id: raw.id,
        author: raw.author,
        body: raw.body,
        sentAt: raw.sent_at,
    };
}

/** Convertit une conversation brute en camelCase, messages inclus. */
function normalize(raw: RawConversation): Conversation {
    const messages = raw.messages.map(normalizeMessage);
    const last = messages.at(-1);

    return {
        id: raw.id,
        host: raw.host,
        propertyId: raw.property_id,
        propertySlug: raw.property_slug,
        propertyTitle: raw.property_title,
        lastMessage: last?.body ?? '',
        lastMessageAt: last?.sentAt ?? '',
        isUnread: raw.is_unread,
        messages,
    };
}

/** Retire le fil de messages : la liste n'a besoin que de l'aperçu. */
function toSummary({ messages, ...summary }: Conversation): ConversationSummary {
    void messages;
    return summary;
}

/**
 * Liste les conversations de l'utilisateur, la plus récente en premier.
 *
 * @returns Un tableau vide si l'utilisateur n'a encore aucun échange.
 */
export async function getConversations(): Promise<ConversationSummary[]> {
    return conversations
        .map(normalize)
        .sort((a, b) => b.lastMessageAt.localeCompare(a.lastMessageAt))
        .map(toSummary);
}

/**
 * Fil complet d'une conversation.
 *
 * @param id Identifiant de la conversation, ex. « conv-1 ».
 * @returns `null` si la conversation n'existe pas — la page appelle alors
 *          `notFound()`.
 */
export async function getConversation(id: string): Promise<Conversation | null> {
    const found = conversations.find((c) => c.id === id);
    return found ? normalize(found) : null;
}

/**
 * Identifiant de la conversation ouverte avec un hôte donné.
 *
 * Permet à la carte de l'hôte, sur la page détail, de pointer directement
 * vers le bon fil sans connaître la messagerie.
 *
 * @param hostId Identifiant de l'hôte tel que renvoyé par `/api/properties`.
 */
export function getConversationIdForHost(hostId: number): string {
    return `conv-${hostId}`;
}