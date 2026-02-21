export type Point = { x: number; y: number; pressure?: number; };

export type Stroke = {
    points: Point[];
    color: string;
    size: number;
    tool: "pen" | "eraser";
};

export const COLORS = [
    "#1C1C1E",
    "#FF3B30",
    "#FF9500",
    "#FFCC00",
    "#34C759",
    "#007AFF",
    "#5856D6",
    "#FF2D55",
    "#636366",
];

export const PEN_SIZES = [2, 4, 7, 12];
