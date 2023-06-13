import { it, expect, vi, afterEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import CoinHeader from '../components/CoinHeader';

/**
 * @vitest-environment happy-dom
 */
afterEach(() => cleanup());

it('should render', () => {
  render(
    <CoinHeader
      selectedCoin={null}
      liveCoinWatchData={null}
      isLoading={true}
      timeInterval="24hr"
      onIntervalClick={() => console.log('clicked')}
    />
  );

  const element = screen.getByTestId('coin-header');
  expect(element).toBeTruthy();
});

it('can fire its callback', () => {
  const mockCb = vi.fn();
  render(
    <CoinHeader
      selectedCoin={null}
      liveCoinWatchData={null}
      isLoading={false}
      timeInterval="24hr"
      onIntervalClick={mockCb}
    />
  );

  const toggleButtonElement = screen.getByText('24hr');
  fireEvent.click(toggleButtonElement);
});
