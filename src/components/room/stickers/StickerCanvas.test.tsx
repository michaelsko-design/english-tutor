import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { StickerCanvas, type StickerCanvasHandle, type Stroke } from './StickerCanvas';

const ctx = {
  save: vi.fn(),
  restore: vi.fn(),
  clearRect: vi.fn(),
  beginPath: vi.fn(),
  arc: vi.fn(),
  fill: vi.fn(),
  moveTo: vi.fn(),
  lineTo: vi.fn(),
  stroke: vi.fn(),
  drawImage: vi.fn(),
  globalCompositeOperation: '',
  strokeStyle: '',
  fillStyle: '',
  lineWidth: 0,
  lineCap: '',
  lineJoin: '',
  imageSmoothingQuality: '',
};

const onStrokesChange = vi.fn();

function setup(props: { strokes?: Stroke[]; isEraser?: boolean } = {}) {
  const ref = createRef<StickerCanvasHandle>();
  render(
    <StickerCanvas ref={ref} strokes={props.strokes ?? []} color="#ef4444" brushWidth={14} isEraser={props.isEraser ?? false} onStrokesChange={onStrokesChange} />
  );
  const canvas = screen.getByLabelText('משטח ציור') as HTMLCanvasElement;
  canvas.getBoundingClientRect = () => ({ left: 0, top: 0, width: 240, height: 240, right: 240, bottom: 240, x: 0, y: 0, toJSON: () => ({}) });
  canvas.setPointerCapture = vi.fn();
  return { ref, canvas };
}

const point = (x: number, y: number) => ({ clientX: x, clientY: y, pointerId: 1 });

beforeEach(() => {
  Object.values(ctx).forEach((value) => typeof value === 'function' && (value as ReturnType<typeof vi.fn>).mockClear());
  onStrokesChange.mockClear();
  HTMLCanvasElement.prototype.getContext = vi.fn(() => ctx) as never;
  HTMLCanvasElement.prototype.toDataURL = vi.fn(() => 'data:image/png;base64,AAAA');
});

describe('StickerCanvas', () => {
  it('redraws the saved strokes when they change', () => {
    setup({
      strokes: [
        { color: '#111827', width: 14, isEraser: false, points: [[10, 10], [50, 50]] },
        { color: '#111827', width: 14, isEraser: false, points: [[100, 100]] },
      ],
    });
    expect(ctx.clearRect).toHaveBeenCalled();
    expect(ctx.stroke).toHaveBeenCalledTimes(1);
    expect(ctx.arc).toHaveBeenCalledTimes(1);
  });

  it('records a stroke from press, move and release, scaled to the drawing size', () => {
    const { canvas } = setup();
    fireEvent.pointerDown(canvas, point(120, 120));
    fireEvent.pointerMove(canvas, point(180, 60));
    fireEvent.pointerUp(canvas);
    expect(onStrokesChange).toHaveBeenCalledTimes(1);
    const [strokes] = onStrokesChange.mock.calls[0] as [Stroke[]];
    expect(strokes).toHaveLength(1);
    expect(strokes[0]).toMatchObject({ color: '#ef4444', width: 14, isEraser: false });
    expect(strokes[0].points[0]).toEqual([240, 240]);
    expect(strokes[0].points[1]).toEqual([360, 120]);
  });

  it('marks eraser strokes', () => {
    const { canvas } = setup({ isEraser: true });
    fireEvent.pointerDown(canvas, point(10, 10));
    fireEvent.pointerUp(canvas);
    expect((onStrokesChange.mock.calls[0][0] as Stroke[])[0].isEraser).toBe(true);
  });

  it('draws nothing when the pointer moves without being pressed', () => {
    const { canvas } = setup();
    fireEvent.pointerMove(canvas, point(50, 50));
    fireEvent.pointerUp(canvas);
    expect(onStrokesChange).not.toHaveBeenCalled();
  });

  it('still draws when pointer capture is not available', () => {
    const { canvas } = setup();
    canvas.setPointerCapture = () => {
      throw new Error('not supported');
    };
    fireEvent.pointerDown(canvas, point(10, 10));
    fireEvent.pointerCancel(canvas);
    expect(onStrokesChange).toHaveBeenCalledTimes(1);
  });

  it('exports the drawing as a small PNG data URL', () => {
    const { ref } = setup();
    expect(ref.current!.exportPng()).toBe('data:image/png;base64,AAAA');
    expect(ctx.drawImage).toHaveBeenCalled();
  });
});
