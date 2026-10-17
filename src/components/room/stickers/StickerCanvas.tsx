import React, { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { DRAWN_STICKER_SIZE } from '../../../data/stickers';

/** Drawing resolution of the on-screen canvas (it is scaled down to the sticker size on save). */
const CANVAS_SIZE = 480;

export interface Stroke {
  color: string;
  /** In canvas pixels */
  width: number;
  isEraser: boolean;
  points: [number, number][];
}

export interface StickerCanvasHandle {
  /** The drawing as a small square PNG data URL */
  exportPng: () => string;
}

interface StickerCanvasProps {
  strokes: Stroke[];
  color: string;
  brushWidth: number;
  isEraser: boolean;
  onStrokesChange: (strokes: Stroke[]) => void;
}

function drawStroke(ctx: CanvasRenderingContext2D, stroke: Stroke) {
  ctx.save();
  ctx.globalCompositeOperation = stroke.isEraser ? 'destination-out' : 'source-over';
  ctx.strokeStyle = stroke.color;
  ctx.fillStyle = stroke.color;
  ctx.lineWidth = stroke.width;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  const [first, ...rest] = stroke.points;
  if (rest.length === 0) {
    ctx.beginPath();
    ctx.arc(first[0], first[1], stroke.width / 2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.moveTo(first[0], first[1]);
    rest.forEach(([x, y]) => ctx.lineTo(x, y));
    ctx.stroke();
  }
  ctx.restore();
}

function redraw(canvas: HTMLCanvasElement, strokes: Stroke[]) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
  strokes.forEach((stroke) => drawStroke(ctx, stroke));
}

/** A square drawing pad for finger or mouse; strokes are kept by the parent for undo. */
export const StickerCanvas = forwardRef<StickerCanvasHandle, StickerCanvasProps>(
  ({ strokes, color, brushWidth, isEraser, onStrokesChange }, ref) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const currentStroke = useRef<Stroke | null>(null);

    useEffect(() => {
      if (canvasRef.current) redraw(canvasRef.current, strokes);
    }, [strokes]);

    useImperativeHandle(ref, () => ({
      exportPng: () => {
        const out = document.createElement('canvas');
        out.width = DRAWN_STICKER_SIZE;
        out.height = DRAWN_STICKER_SIZE;
        const ctx = out.getContext('2d');
        if (ctx && canvasRef.current) {
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(canvasRef.current, 0, 0, DRAWN_STICKER_SIZE, DRAWN_STICKER_SIZE);
        }
        return out.toDataURL('image/png');
      },
    }));

    const toCanvasPoint = (e: React.PointerEvent<HTMLCanvasElement>): [number, number] => {
      const rect = e.currentTarget.getBoundingClientRect();
      return [
        ((e.clientX - rect.left) / rect.width) * CANVAS_SIZE,
        ((e.clientY - rect.top) / rect.height) * CANVAS_SIZE,
      ];
    };

    const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
      try {
        e.currentTarget.setPointerCapture(e.pointerId);
      } catch {
        // Capture is only a nicety (keeps the stroke when the finger leaves the pad).
      }
      currentStroke.current = { color, width: brushWidth, isEraser, points: [toCanvasPoint(e)] };
      const ctx = e.currentTarget.getContext('2d');
      if (ctx) drawStroke(ctx, currentStroke.current);
    };

    const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
      const stroke = currentStroke.current;
      if (!stroke) return;
      stroke.points.push(toCanvasPoint(e));
      // Draw only the newest segment while the finger moves; the full redraw happens on release.
      const ctx = e.currentTarget.getContext('2d');
      if (ctx) drawStroke(ctx, { ...stroke, points: stroke.points.slice(-2) });
    };

    const handlePointerUp = () => {
      const stroke = currentStroke.current;
      currentStroke.current = null;
      if (stroke) onStrokesChange([...strokes, stroke]);
    };

    return (
      <canvas
        ref={canvasRef}
        width={CANVAS_SIZE}
        height={CANVAS_SIZE}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        aria-label="משטח ציור"
        className="w-full max-w-[16rem] aspect-square mx-auto block rounded-3xl bg-white border-2 border-dashed border-purple-300 touch-none cursor-crosshair"
      />
    );
  }
);

StickerCanvas.displayName = 'StickerCanvas';
