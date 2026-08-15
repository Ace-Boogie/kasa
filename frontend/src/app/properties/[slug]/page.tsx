import type {Metadata} from 'next';
import Link from 'next/link';
import {notFound} from 'next/navigation';
import {getAllSlugs, getPropertyBySlug} from '@/lib/api/properties';
import Carousel from '@/components/Carousel/Carousel';
import Collapse from '@/components/Collapse/Collapse';
import HostCard from '@/components/HostCard/HostCard';
import Tag from '@/components/Tag/Tag';
import {ArrowLeftIcon, LocationIcon} from '@/components/icons/Icons';
import styles from './page.module.scss';

interface PageProps {
    params: Promise<{ slug: string }>;
}

/**
 * Prérend les 20 pages au build : HTML complet pour les moteurs de recherche
 * et aucun appel API à la visite.
 */
export async function generateStaticParams() {
    try {
        const slugs = await getAllSlugs();
        return slugs.map((slug) => ({slug}));
    } catch {
        // API injoignable au build : les pages seront rendues à la demande
        // plutôt que de faire échouer la compilation.
        return [];
    }
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
    const {slug} = await params;
    const property = await getPropertyBySlug(slug);

    if (!property) return {title: 'Logement introuvable'};

    const description = property.description.slice(0, 155);

    return {
        title: property.title,
        description,
        alternates: {canonical: `/properties/${slug}`},
        openGraph: {
            title: `${property.title} — ${property.location}`,
            description,
            images: [{url: property.cover, alt: property.title}],
            type: 'website',
        },
    };
}

export default async function PropertyPage({params}: PageProps) {
    const {slug} = await params;
    const property = await getPropertyBySlug(slug);

    if (!property) notFound();

    const {
        title,
        location,
        description,
        pictures,
        equipments,
        tags,
        host,
        rating,
        ratingsCount,
        pricePerNight,
        cover,
    } = property;

    // Microdonnées : le prix et la disponibilité en font une offre commerciale,
    // d'où le type Product plutôt qu'Accommodation, mieux reconnu par Google.
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: title,
        description,
        image: pictures.length > 0 ? pictures : [cover],
        offers: {
            '@type': 'Offer',
            price: pricePerNight,
            priceCurrency: 'EUR',
            availability: 'https://schema.org/InStock',
        },
        // Omis quand aucun avis n'existe : une note sans avis serait invalide.
        ...(ratingsCount > 0 && {
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: rating,
                ratingCount: ratingsCount,
                bestRating: 5,
            },
        }),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
            />

            <div className={styles.page}>
                <div className={styles.back}>
                    <Link href="/" className={styles.backLink}>
                        <ArrowLeftIcon/>
                        Retour aux annonces
                    </Link>
                </div>

                <div className={styles.gallery}>
                    <Carousel pictures={pictures.length > 0 ? pictures : [cover]} title={title}/>
                </div>

                <article className={styles.details}>
                    <header className={styles.header}>
                        <h1 className={styles.title}>{title}</h1>
                        <p className={styles.location}>
                            <LocationIcon/>
                            {location}
                        </p>
                        <p className={styles.price}>
                            <span className={styles.amount}>{pricePerNight}€</span>
                            <span className={styles.unit}>par nuit</span>
                        </p>
                    </header>

                    <div className={styles.collapses}>
                        <Collapse title="Description" defaultOpen>
                            {description}
                        </Collapse>

                        {equipments.length > 0 && (
                            <Collapse title="Équipements">
                                <ul className={styles.tags}>
                                    {equipments.map((item) => (
                                        <Tag key={item}>{item}</Tag>
                                    ))}
                                </ul>
                            </Collapse>
                        )}

                        {tags.length > 0 && (
                            <Collapse title="Catégories">
                                <ul className={styles.tags}>
                                    {tags.map((item) => (
                                        <Tag key={item}>{item}</Tag>
                                    ))}
                                </ul>
                            </Collapse>
                        )}
                    </div>
                </article>

                <div className={styles.host}>
                    <HostCard host={host} rating={rating} ratingsCount={ratingsCount}/>
                </div>
            </div>
        </>
    );
}