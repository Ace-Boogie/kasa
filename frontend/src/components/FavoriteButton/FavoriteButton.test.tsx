import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FavoritesProvider } from '@/context/FavoritesContext';
import FavoriteButton from './FavoriteButton';

const STORAGE_KEY = 'kasa:favorites';

function renderButton() {
  return render(
    <FavoritesProvider>
      <FavoriteButton propertyId="c67ab8a7" propertyTitle="Appartement cosy" />
    </FavoritesProvider>
  );
}

beforeEach(() => {
  window.localStorage.clear();
});

describe('FavoriteButton', () => {
  it("n'est pas actif au premier affichage", async () => {
    renderButton();
    const button = await screen.findByRole('button', {
      name: /ajouter appartement cosy/i,
    });
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  it('devient actif au clic', async () => {
    const user = userEvent.setup();
    renderButton();

    await user.click(await screen.findByRole('button'));

    expect(
      screen.getByRole('button', { name: /retirer appartement cosy/i })
    ).toHaveAttribute('aria-pressed', 'true');
  });

  it('redevient inactif au second clic', async () => {
    const user = userEvent.setup();
    renderButton();

    const button = await screen.findByRole('button');
    await user.click(button);
    await user.click(button);

    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  it('écrit le favori dans localStorage', async () => {
    const user = userEvent.setup();
    renderButton();

    await user.click(await screen.findByRole('button'));

    expect(JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '[]')).toEqual(
      ['c67ab8a7']
    );
  });

  it('restaure un favori enregistré lors d\'une session précédente', async () => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(['c67ab8a7']));
    renderButton();

    const button = await screen.findByRole('button', {
      name: /retirer appartement cosy/i,
    });
    expect(button).toHaveAttribute('aria-pressed', 'true');
  });

  it('ignore un contenu localStorage invalide sans planter', async () => {
    window.localStorage.setItem(STORAGE_KEY, 'pas du json');
    renderButton();

    expect(await screen.findByRole('button')).toHaveAttribute(
      'aria-pressed',
      'false'
    );
  });
});
