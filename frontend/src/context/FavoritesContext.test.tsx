import { act, renderHook, waitFor } from '@testing-library/react';
import type { ReactNode } from 'react';
import { FavoritesProvider, useFavorites } from './FavoritesContext';

const STORAGE_KEY = 'kasa:favorites';

function wrapper({ children }: { children: ReactNode }) {
    return <FavoritesProvider>{children}</FavoritesProvider>;
}

/** Monte le hook et attend la fin de la lecture de localStorage. */
async function setup() {
    const view = renderHook(() => useFavorites(), { wrapper });
    await waitFor(() => expect(view.result.current.isLoaded).toBe(true));
    return view;
}

beforeEach(() => {
    window.localStorage.clear();
    jest.restoreAllMocks();
});

describe('FavoritesContext', () => {
    describe('état initial', () => {
        it('démarre avec une liste vide', async () => {
            const { result } = await setup();
            expect(result.current.favorites).toEqual([]);
        });

        it('passe isLoaded à true après la lecture de localStorage', async () => {
            const { result } = await setup();
            expect(result.current.isLoaded).toBe(true);
        });

        it('restaure les favoris enregistrés précédemment', async () => {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(['a1', 'b2']));

            const { result } = await setup();

            expect(result.current.favorites).toEqual(['a1', 'b2']);
        });
    });

    describe('toggleFavorite', () => {
        it('ajoute un identifiant absent', async () => {
            const { result } = await setup();

            act(() => result.current.toggleFavorite('a1'));

            expect(result.current.favorites).toEqual(['a1']);
        });

        it('retire un identifiant déjà présent', async () => {
            const { result } = await setup();

            act(() => result.current.toggleFavorite('a1'));
            act(() => result.current.toggleFavorite('a1'));

            expect(result.current.favorites).toEqual([]);
        });

        it('conserve les autres favoris lors d’un retrait', async () => {
            const { result } = await setup();

            act(() => result.current.toggleFavorite('a1'));
            act(() => result.current.toggleFavorite('b2'));
            act(() => result.current.toggleFavorite('a1'));

            expect(result.current.favorites).toEqual(['b2']);
        });
    });

    describe('isFavorite', () => {
        it('renvoie false pour un identifiant absent', async () => {
            const { result } = await setup();
            expect(result.current.isFavorite('a1')).toBe(false);
        });

        it('renvoie true après un ajout', async () => {
            const { result } = await setup();

            act(() => result.current.toggleFavorite('a1'));

            expect(result.current.isFavorite('a1')).toBe(true);
        });
    });

    describe('persistance', () => {
        it('écrit dans localStorage à chaque changement', async () => {
            const { result } = await setup();

            act(() => result.current.toggleFavorite('a1'));

            await waitFor(() => {
                expect(
                    JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]')
                ).toEqual(['a1']);
            });
        });

        it('n’écrase pas les données existantes avant la lecture initiale', async () => {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(['a1']));

            await setup();

            expect(
                JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]')
            ).toEqual(['a1']);
        });
    });

    describe('robustesse', () => {
        it('ignore un contenu localStorage illisible', async () => {
            window.localStorage.setItem(STORAGE_KEY, 'ceci n’est pas du json');

            const { result } = await setup();

            expect(result.current.favorites).toEqual([]);
        });

        it('ignore une valeur qui n’est pas un tableau', async () => {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ a: 1 }));

            const { result } = await setup();

            expect(result.current.favorites).toEqual([]);
        });

        it('filtre les entrées qui ne sont pas des chaînes', async () => {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(['a1', 42, null]));

            const { result } = await setup();

            expect(result.current.favorites).toEqual(['a1']);
        });

        it('reste fonctionnel si localStorage est indisponible', async () => {
            jest
                .spyOn(Storage.prototype, 'getItem')
                .mockImplementation(() => {
                    throw new Error('localStorage bloqué');
                });

            const { result } = await setup();

            act(() => result.current.toggleFavorite('a1'));

            // L'état vit en mémoire même quand l'écriture échoue.
            expect(result.current.favorites).toEqual(['a1']);
        });
    });

    describe('useFavorites', () => {
        it('lève une erreur hors du provider', () => {
            const consoleError = jest
                .spyOn(console, 'error')
                .mockImplementation(() => {});

            expect(() => renderHook(() => useFavorites())).toThrow(
                /doit être utilisé dans un FavoritesProvider/
            );

            consoleError.mockRestore();
        });
    });
});