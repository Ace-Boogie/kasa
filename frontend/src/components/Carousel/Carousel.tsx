'use client';

import { useRef, useState, type KeyboardEvent, type TouchEvent } from 'react';
import Image from 'next/image';
import { ArrowLeftIcon, ArrowRightIcon } from '@/components/icons/Icons';
import styles from './Carousel.module.scss';

interface CarouselProps {
    /** URLs des photos, dans l'ordre d'affichage. */
    pictures: string[];
    /** Titre du logement, utilisé dans les textes alternatifs. */
    title: string;
}

/** Distance minimale d'un balayage pour changer d'image, en pixels. */
const SWIPE_THRESHOLD = 50;

/**
 * Diaporama des photos d'un logement.
 *
 * Comportements imposés par le backlog :
 * - boucle entre la dernière et la première image ;
 * - hauteur fixe, images centrées et recadrées ;
 * - flèches masquées lorsqu'il n'y a qu'une seule image ;
 * - navigation au clavier avec les flèches gauche et droite.
 */
export default function Carousel({ pictures, title }: CarouselProps) {
    const [index, setIndex] = useState(0);
    const touchStartX = useRef<number | null>(null);

    const total = pictures.length;
    const hasMultiple = total > 1;

    if (total === 0) return null;

    /** Déplace l'index en bouclant : -1 mène à la dernière, total mène à la première. */
    function goTo(next: number) {
        setIndex((next + total) % total);
    }

    function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
        if (!hasMultiple) return;
        if (event.key === 'ArrowLeft') {
            event.preventDefault();
            goTo(index - 1);
        }
        if (event.key === 'ArrowRight') {
            event.preventDefault();
            goTo(index + 1);
        }
    }

    function handleTouchStart(event: TouchEvent<HTMLDivElement>) {
        touchStartX.current = event.touches[0].clientX;
    }

    function handleTouchEnd(event: TouchEvent<HTMLDivElement>) {
        if (touchStartX.current === null || !hasMultiple) return;
        const distance = touchStartX.current - event.changedTouches[0].clientX;
        if (Math.abs(distance) >= SWIPE_THRESHOLD) {
            goTo(distance > 0 ? index + 1 : index - 1);
        }
        touchStartX.current = null;
    }

    return (
        <div className={styles.carousel}>
            <div
                className={styles.stage}
                // Le conteneur est focusable pour recevoir les flèches du clavier.
                tabIndex={0}
                role="group"
                aria-roledescription="carrousel"
                aria-label={`Photos du logement ${title}`}
                onKeyDown={handleKeyDown}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
            >
                <div
                    className={styles.track}
                    style={{ transform: `translateX(-${index * 100}%)` }}
                >
                    {pictures.map((src, i) => (
                        <div key={src} className={styles.slide} aria-hidden={i !== index}>
                            <Image
                                src={src}
                                alt={`${title} — photo ${i + 1} sur ${total}`}
                                fill
                                sizes="(max-width: 767px) 100vw, 616px"
                                className={styles.image}
                                priority={i === 0}
                            />
                        </div>
                    ))}
                </div>

                {hasMultiple && (
                    <>
                        <button
                            type="button"
                            onClick={() => goTo(index - 1)}
                            aria-label="Image précédente"
                            className={`${styles.arrow} ${styles.prev}`}
                        >
                            <ArrowLeftIcon />
                        </button>

                        <button
                            type="button"
                            onClick={() => goTo(index + 1)}
                            aria-label="Image suivante"
                            className={`${styles.arrow} ${styles.next}`}
                        >
                            <ArrowRightIcon />
                        </button>

                        <p className={styles.counter}>
                            {index + 1} / {total}
                        </p>
                    </>
                )}

                {/* Annonce le changement d'image aux lecteurs d'écran. */}
                <p aria-live="polite" className="srOnly">
                    Photo {index + 1} sur {total}
                </p>
            </div>

            {hasMultiple && (
                <ul className={styles.thumbnails}>
                    {pictures.map((src, i) => (
                        <li key={src}>
                            <button
                                type="button"
                                onClick={() => goTo(i)}
                                aria-label={`Afficher la photo ${i + 1}`}
                                aria-current={i === index}
                                className={`${styles.thumbnail} ${i === index ? styles.thumbnailActive : ''}`}
                            >
                                <Image
                                    src={src}
                                    alt=""
                                    fill
                                    sizes="120px"
                                    className={styles.image}
                                />
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}