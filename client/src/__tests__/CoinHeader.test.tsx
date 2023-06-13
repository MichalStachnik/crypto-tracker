import { it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CoinHeader from '../components/CoinHeader';

/**
 * @vitest-environment happy-dom
 */

it('should work', () => {
  expect(1).toBe(1);
});

it('should render', () => {
  const renderedOutput = render(
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
