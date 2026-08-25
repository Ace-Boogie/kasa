import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getConversation, getConversations } from '@/lib/api/messages';
import MessagerieLayout from '@/components/Messagerie/MessagerieLayout';
import MessageThread from '@/components/Messagerie/MessageThread';

interface ConversationPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: ConversationPageProps): Promise<Metadata> {
  const { id } = await params;
  const conversation = await getConversation(id);

  return {
    title: conversation
      ? `Conversation avec ${conversation.host.name}`
      : 'Conversation introuvable',
    robots: { index: false, follow: false },
  };
}

/**
 * Page d'un fil de discussion.
 *
 * La liste reste rendue à gauche en desktop, conformément à la maquette ;
 * en mobile, seul le fil est affiché et un bouton ramène à la liste.
 */
export default async function ConversationPage({
  params,
}: ConversationPageProps) {
  const { id } = await params;

  // Les deux appels tapent la même source : la liste sert le panneau de
  // gauche, le fil le panneau de droite.
  const [conversation, conversations] = await Promise.all([
    getConversation(id),
    getConversations(),
  ]);

  if (!conversation) notFound();

  return (
    <MessagerieLayout
      conversations={conversations}
      activeId={conversation.id}
      mobileView="detail"
      listHeadingLevel={2}
    >
      <MessageThread conversation={conversation} />
    </MessagerieLayout>
  );
}
