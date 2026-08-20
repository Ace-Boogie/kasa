/** Page d'attente : cette fonctionnalité relève du Sprint 2. */

import ComingSoon from '@/components/ComingSoon/ComingSoon';

export const metadata = { title: 'Ajouter un logement' };

export default function AjouterLogementPage() {
  return (
    <ComingSoon
      title="Ajouter un logement"
      description="Les hôtes pourront bientôt publier leur logement : photos, description, équipements et tarif."
    />
  );
}
