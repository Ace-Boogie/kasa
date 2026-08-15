import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Collapse from './Collapse';

function renderCollapse(defaultOpen = false) {
  return render(
    <Collapse title="Équipements" defaultOpen={defaultOpen}>
      <p>Wifi et parking</p>
    </Collapse>
  );
}

describe('Collapse', () => {
  it('est fermé par défaut', () => {
    renderCollapse();
    expect(screen.getByRole('button', { name: /équipements/i })).toHaveAttribute(
      'aria-expanded',
      'false'
    );
  });

  it("s'ouvre au clic", async () => {
    const user = userEvent.setup();
    renderCollapse();

    await user.click(screen.getByRole('button', { name: /équipements/i }));

    expect(screen.getByRole('button', { name: /équipements/i })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });

  it('se referme au second clic', async () => {
    const user = userEvent.setup();
    renderCollapse();
    const trigger = screen.getByRole('button', { name: /équipements/i });

    await user.click(trigger);
    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('relie le bouton à son panneau via aria-controls', () => {
    renderCollapse();
    const trigger = screen.getByRole('button', { name: /équipements/i });
    const panelId = trigger.getAttribute('aria-controls');

    expect(panelId).toBeTruthy();
    expect(document.getElementById(panelId as string)).toBeInTheDocument();
  });

  it("s'affiche ouvert quand defaultOpen vaut true", () => {
    renderCollapse(true);
    expect(screen.getByRole('button', { name: /équipements/i })).toHaveAttribute(
      'aria-expanded',
      'true'
    );
  });
});
