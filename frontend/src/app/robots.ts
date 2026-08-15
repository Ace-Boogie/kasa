import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3001';

/**
 * Directives pour les robots d'indexation.
 *
 * Les routes techniques du BFF sont exclues : elles ne renvoient pas de page
 * et n'ont rien à faire dans un index de recherche.
 */
export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/api/'],
        },
        sitemap: `${BASE_URL}/sitemap.xml`,
    };
}