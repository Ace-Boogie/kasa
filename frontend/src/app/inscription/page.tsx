/** Page d'attente : cette fonctionnalité relève du Sprint 2. */

import ComingSoon from '@/components/ComingSoon/ComingSoon';

export const metadata = { title: 'Inscription' };

export default function InscriptionPage() {
  return (
    <ComingSoon
      title="Créer un compte"
      description="L’inscription et la récupération de mot de passe arrivent bientôt. En attendant, connectez-vous avec un compte existant."
    />
  );
}
