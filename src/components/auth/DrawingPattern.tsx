import React, { useRef, useState, useEffect } from 'react';
import { useBehavioral } from '../../context/BehavioralContext';

interface Point {
  x: number;
  y: number;
  time: number;
}

interface DrawingPatternProps {
  onComplete: (pattern: number[]) => void;
  verificationMode?: boolean;
}

const DrawingPattern: React.FC<DrawingPatternProps> = ({ onComplete, verificationMode = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState<Point[]>([]);
  const { updateNavigationBehavior } = useBehavioral();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = 300;
    canvas.height = 300;

    // Draw grid
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;

    for (let i = 0; i <= 300; i += 100) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, 300);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(300, i);
      ctx.stroke();
    }

    // Draw points
    ctx.fillStyle = '#3b82f6';
    for (let i = 0; i < 9; i++) {
      const x = (i % 3) * 100 + 50;
      const y = Math.floor(i / 3) * 100 + 50;
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    setPoints([{ x, y, time: Date.now() }]);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ('touches' in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ('touches' in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#3b82f6';

    ctx.beginPath();
    const prevPoint = points[points.length - 1];
    ctx.moveTo(prevPoint.x, prevPoint.y);
    ctx.lineTo(x, y);
    ctx.stroke();

    setPoints([...points, { x, y, time: Date.now() }]);
  };

  const endDrawing = () => {
    setIsDrawing(false);

    if (points.length < 4) {
      // Reset if pattern is too short
      const ctx = canvasRef.current?.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, 300, 300);
      }
      setPoints([]);
      return;
    }

    // Convert points to pattern
    const pattern = points.map((point, index) => {
      if (index === 0) return 0;
      const prevPoint = points[index - 1];
      const dx = point.x - prevPoint.x;
      const dy = point.y - prevPoint.y;
      const time = point.time - prevPoint.time;
      return Math.sqrt(dx * dx + dy * dy) + time;
    });

    // Update behavioral data
    updateNavigationBehavior('pattern-draw', points[points.length - 1].time - points[0].time);

    onComplete(pattern);
  };

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        className="border border-gray-200 rounded-lg touch-none"
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={endDrawing}
        onMouseLeave={endDrawing}
        onTouchStart={startDrawing}
        onTouchMove={draw}
        onTouchEnd={endDrawing}
      />
      <p className="mt-4 text-sm text-gray-600">
        {verificationMode
          ? 'Draw your pattern to verify your identity'
          : 'Draw a pattern to set up authentication'}
      </p>
    </div>
  );
};

export default DrawingPattern;