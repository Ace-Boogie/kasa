import Link from 'next/link';
import Image from 'next/image';
import Rating from '@/components/Rating/Rating';
import type { Host } from '@/types/property';
import styles from './HostCard.module.scss';

interface HostCardProps {
    host: Host | null;
    rating: number;
    ratingsCount: number;
}

/** Encart de l'hôte : photo, nom, note et actions de contact. */
export default function HostCard({ host, rating, ratingsCount }: HostCardProps) {
    if (!host) return null;

    return (
        <aside className={styles.card} aria-labelledby="hote-titre">
            <h2 id="hote-titre" className={styles.title}>
                Votre hôte
            </h2>

            <div className={styles.identity}>
                <Image
                    src={host.picture}
                    alt={`Portrait de ${host.name}`}
                    width={82}
                    height={82}
                    className={styles.avatar}
                />
                <p className={styles.name}>{host.name}</p>
                <Rating value={rating} count={ratingsCount} />
            </div>

            {/* Destinations distinctes : deux liens vers la même URL sont
          signalés comme redondants par les outils d'audit. */}
            <Link href="/messagerie" className={styles.button}>
                Contacter l’hôte
            </Link>
            <Link href="/messagerie#nouveau-message" className={styles.button}>
                Envoyer un message
            </Link>
        </aside>
    );
}