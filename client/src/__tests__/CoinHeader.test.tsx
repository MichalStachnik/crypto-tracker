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
      timeInterval="24hr"
      onIntervalClick={() => console.log('clicked')}
      chartMode="price"
      setChartMode={() => console.log('setChartMode')}
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
      timeInterval="24hr"
      onIntervalClick={mockCb}
      chartMode="price"
      setChartMode={() => console.log('setChartMode')}
    />
  );

  const toggleButtonElement = screen.getByText('24hr');
  fireEvent.click(toggleButtonElement);
});
