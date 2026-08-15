import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Carousel from './Carousel';

const PICTURES = [
    'https://example.com/photo-1.jpg',
    'https://example.com/photo-2.jpg',
    'https://example.com/photo-3.jpg',
];

function renderCarousel(pictures = PICTURES) {
    return render(<Carousel pictures={pictures} title="Appartement cosy" />);
}

/** Le compteur « 2 / 3 » est la lecture la plus directe de l'index courant. */
function currentIndex() {
    return screen.getByText(/^\d+ \/ \d+$/).textContent;
}

describe('Carousel', () => {
    describe('affichage', () => {
        it('rend une diapositive par photo fournie', () => {
            renderCarousel();
            PICTURES.forEach((_, i) => {
                expect(
                    screen.getByAltText(`Appartement cosy — photo ${i + 1} sur 3`)
                ).toBeInTheDocument();
            });
        });

        it('rend une vignette par photo fournie', () => {
            renderCarousel();
            const thumbnails = within(screen.getByRole('list')).getAllByRole('button');
            expect(thumbnails).toHaveLength(PICTURES.length);
        });

        it('n\'expose que la photo courante aux lecteurs d\'écran', () => {
            renderCarousel();
            expect(screen.getAllByRole('img')).toHaveLength(1);
        });

        it('démarre sur la première photo', () => {
            renderCarousel();
            expect(currentIndex()).toBe('1 / 3');
        });

        it('donne à chaque photo un texte alternatif situant sa position', () => {
            renderCarousel();
            expect(
                screen.getByAltText('Appartement cosy — photo 1 sur 3')
            ).toBeInTheDocument();
        });

        it('ne rend rien si aucune photo n\'est fournie', () => {
            const { container } = renderCarousel([]);
            expect(container).toBeEmptyDOMElement();
        });
    });

    describe('navigation par les flèches', () => {
        it('avance à la photo suivante', async () => {
            const user = userEvent.setup();
            renderCarousel();

            await user.click(screen.getByRole('button', { name: /image suivante/i }));

            expect(currentIndex()).toBe('2 / 3');
        });

        it('recule à la photo précédente', async () => {
            const user = userEvent.setup();
            renderCarousel();

            await user.click(screen.getByRole('button', { name: /image suivante/i }));
            await user.click(screen.getByRole('button', { name: /image précédente/i }));

            expect(currentIndex()).toBe('1 / 3');
        });
    });

    describe('bouclage', () => {
        it('revient à la première photo après la dernière', async () => {
            const user = userEvent.setup();
            renderCarousel();
            const next = screen.getByRole('button', { name: /image suivante/i });

            await user.click(next);
            await user.click(next);
            expect(currentIndex()).toBe('3 / 3');

            await user.click(next);
            expect(currentIndex()).toBe('1 / 3');
        });

        it('passe à la dernière photo depuis la première', async () => {
            const user = userEvent.setup();
            renderCarousel();

            await user.click(screen.getByRole('button', { name: /image précédente/i }));

            expect(currentIndex()).toBe('3 / 3');
        });
    });

    describe('cas d\'une seule photo', () => {
        it('masque les deux flèches', () => {
            renderCarousel([PICTURES[0]]);

            expect(
                screen.queryByRole('button', { name: /image suivante/i })
            ).not.toBeInTheDocument();
            expect(
                screen.queryByRole('button', { name: /image précédente/i })
            ).not.toBeInTheDocument();
        });

        it('masque les vignettes et le compteur', () => {
            renderCarousel([PICTURES[0]]);

            expect(screen.queryByRole('list')).not.toBeInTheDocument();
            expect(screen.queryByText(/^\d+ \/ \d+$/)).not.toBeInTheDocument();
        });

        it('affiche tout de même la photo', () => {
            renderCarousel([PICTURES[0]]);
            expect(
                screen.getByAltText('Appartement cosy — photo 1 sur 1')
            ).toBeInTheDocument();
        });
    });

    describe('accessibilité au clavier', () => {
        it('avance avec la flèche droite', async () => {
            const user = userEvent.setup();
            renderCarousel();

            await user.click(screen.getByRole('group'));
            await user.keyboard('{ArrowRight}');

            expect(currentIndex()).toBe('2 / 3');
        });

        it('recule avec la flèche gauche, en bouclant', async () => {
            const user = userEvent.setup();
            renderCarousel();

            await user.click(screen.getByRole('group'));
            await user.keyboard('{ArrowLeft}');

            expect(currentIndex()).toBe('3 / 3');
        });

        it('rend le carrousel atteignable au clavier', async () => {
            const user = userEvent.setup();
            renderCarousel();

            await user.tab();

            expect(screen.getByRole('group')).toHaveFocus();
        });
    });

    describe('vignettes', () => {
        it('affiche la photo correspondante au clic', async () => {
            const user = userEvent.setup();
            renderCarousel();

            await user.click(screen.getByRole('button', { name: /afficher la photo 3/i }));

            expect(currentIndex()).toBe('3 / 3');
        });

        it('signale la vignette active via aria-current', async () => {
            const user = userEvent.setup();
            renderCarousel();
            const list = screen.getByRole('list');

            expect(
                within(list).getByRole('button', { name: /afficher la photo 1/i })
            ).toHaveAttribute('aria-current', 'true');

            await user.click(
                within(list).getByRole('button', { name: /afficher la photo 2/i })
            );

            expect(
                within(list).getByRole('button', { name: /afficher la photo 2/i })
            ).toHaveAttribute('aria-current', 'true');
            expect(
                within(list).getByRole('button', { name: /afficher la photo 1/i })
            ).toHaveAttribute('aria-current', 'false');
        });
    });
});