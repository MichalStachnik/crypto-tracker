import { Box } from '@mui/material';
import { Coin } from '../types/Coin';
import { useEffect, useRef } from 'react';

class Bubble {
  context: CanvasRenderingContext2D;
  x: number;
  y: number;
  radius: number;
  coin: Coin;
  constructor(
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    radius: number,
    coin: Coin
  ) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.coin = coin;
  }

  draw() {
    this.context.beginPath();
    this.context.fillStyle =
      this.coin.quote.USD.percent_change_24h > 0 ? '#5ccd7c' : 'red';
    this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    this.context.fill();
    const fontSize = this.getFontSize();
    this.context.font = `${fontSize}px Arial`;
    this.context.fillStyle = 'white';
    this.context.fillText(this.coin.symbol, this.x - 15, this.y - 10);
    this.context.fillText(
      this.coin.quote.USD.percent_change_24h.toFixed(2),
      this.x - 15,
      this.y + 10
    );
  }

  getFontSize() {
    const _percentChange = Math.ceil(this.coin.quote.USD.percent_change_24h);
    if (_percentChange < 10) return 12;
    else if (_percentChange > 30) return 30;
  }
}

const createBubbles = (context: CanvasRenderingContext2D, coins: Coin[]) => {
  return coins.map((coin, index) => {
    console.log(coin);
    const x = Math.floor(index / 10) * 130 + 20;
    const y = (index % 10) * 100 + 70;
    const radius = Math.abs(coin.quote.USD.percent_change_24h) * 2;
    return new Bubble(context, x, y, radius, coin);
  });
};

interface BubblesProps {
  coins: Coin[];
}

const Bubbles = ({ coins }: BubblesProps) => {
  // console.log('coins', coins);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    const { width, height } = canvas.getBoundingClientRect();
    const { devicePixelRatio } = window;
    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    context?.scale(devicePixelRatio, devicePixelRatio);
    let animationId: number;
    let i = 0;
    if (!context) return;
    console.log('coins', coins);
    const bubbles = createBubbles(context, coins);
    const render = () => {
      context?.clearRect(0, 0, canvas.width, canvas.height);
      context?.beginPath();
      // context?.arc(50, 50, 50 * Math.abs(Math.cos(i)), 0, 2 * Math.PI);
      context?.fill();
      // i += 0.05;

      bubbles.forEach((b) => b.draw());
      animationId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [coins]);

  return (
    <Box width="100%" height="100%">
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
    </Box>
  );
};

export default Bubbles;
