import type { Point } from "../../data/canvas/types";

export const getPointFromEvent = (
    e: React.PointerEvent<HTMLCanvasElement>,
    canvas: HTMLCanvasElement,
    scale: number = 1
): Point => {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (e.clientX - rect.left) / scale,
        y: (e.clientY - rect.top) / scale,
        pressure: e.pressure !== undefined ? e.pressure : 0.5,
    };
};

export const drawRuledLines = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
) => {
    const lineSpacing = 32;
    ctx.strokeStyle = "#e5e7eb"; // subtle gray grid
    ctx.lineWidth = 1;

    ctx.beginPath();
    for (let y = lineSpacing; y < height; y += lineSpacing) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
    }
    ctx.stroke();

    // Draw a typical red margin line on the left
    ctx.strokeStyle = "#fca5a5";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(80, 0); // Margin at 80px
    ctx.lineTo(80, height);
    ctx.stroke();
};
