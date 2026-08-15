import type { MetadataRoute } from 'next';
import { getAllSlugs } from '@/lib/api/properties';

/** URL publique du site, ou localhost en développement. */
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001';

/**
 * Sitemap généré au build.
 *
 * Les pages statiques y figurent en dur, les 20 logements sont récupérés
 * depuis l'API — ajouter un logement suffit à le faire apparaître.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();

    const staticPages: MetadataRoute.Sitemap = [
        { url: BASE_URL, lastModified: now, changeFrequency: 'daily', priority: 1 },
        {
            url: `${BASE_URL}/a-propos`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.5,
        },
        {
            url: `${BASE_URL}/connexion`,
            lastModified: now,
            changeFrequency: 'yearly',
            priority: 0.3,
        },
    ];

    let propertyPages: MetadataRoute.Sitemap = [];

    try {
        const slugs = await getAllSlugs();
        propertyPages = slugs.map((slug) => ({
            url: `${BASE_URL}/properties/${slug}`,
            lastModified: now,
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));
    } catch {
        // API injoignable au build : on publie au moins les pages statiques
        // plutôt que de faire échouer la génération.
    }

    return [...staticPages, ...propertyPages];
}