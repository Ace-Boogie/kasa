/** Page d'attente : cette fonctionnalité relève du Sprint 2. */

import ComingSoon from '@/components/ComingSoon/ComingSoon';

export const metadata = { title: 'Messagerie' };

export default function MessageriePage() {
  return (
    <ComingSoon
      title="Messagerie"
      description="Vous pourrez bientôt échanger directement avec vos hôtes, poser vos questions et suivre l’historique de vos conversations."
    />
  );
}
