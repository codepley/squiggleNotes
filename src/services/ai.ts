import type { Stroke } from "../data/canvas/types";

// Configuration
// Configuration (API Key unused since we are mocking)
// const apiKey = import.meta.env.VITE_GEMINI_API_KEY || "";

/**
 * Renders an array of Strokes onto a temporary offscreen canvas,
 * crops to the bounding box to reduce blank space,
 * and returns the image as a Base64 encoded PNG string.
 */
export const extractBase64ImageFromStrokes = (strokes: Stroke[]): string | null => {
    if (!strokes || strokes.length === 0) return null;

    // 1. Find the Bounding Box of all strokes to crop the image
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    strokes.forEach(s => {
        s.points.forEach(pt => {
            if (pt.x < minX) minX = pt.x;
            if (pt.y < minY) minY = pt.y;
            if (pt.x > maxX) maxX = pt.x;
            if (pt.y > maxY) maxY = pt.y;
        });
    });

    // Add padding
    const padding = 20;
    minX = Math.max(0, minX - padding);
    minY = Math.max(0, minY - padding);
    maxX += padding;
    maxY += padding;

    const cropWidth = maxX - minX;
    const cropHeight = maxY - minY;

    if (cropWidth <= 0 || cropHeight <= 0) return null;

    // 2. Create offscreen canvas matched exactly to the crop size
    const canvas = document.createElement('canvas');
    canvas.width = cropWidth;
    canvas.height = cropHeight;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Fill white background for better OCR contrast
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, cropWidth, cropHeight);

    // 3. Draw strokes relative to the new cropped origin (minX, minY)
    strokes.forEach((s) => {
        if (s.tool === "eraser") return; // Skip erasers for the final exported image

        ctx.beginPath();
        ctx.strokeStyle = s.color;
        ctx.lineWidth = s.size;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        s.points.forEach((pt, i) => {
            const adjustedX = pt.x - minX;
            const adjustedY = pt.y - minY;

            if (i === 0) {
                ctx.moveTo(adjustedX, adjustedY);
            } else {
                ctx.lineTo(adjustedX, adjustedY);
            }
        });
        ctx.stroke();
    });

    // 4. Export as base64 string
    return canvas.toDataURL("image/png");
};

export const generateInsightsFromImage = async (_base64Image: string): Promise<{ digitalText: string; aiInsights: string } | null> => {
    // Return static mock data without making any API calls
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                digitalText: "This is a static mock representation of the handwritten text. The API integration has been temporarily disabled.",
                aiInsights: `
                    <h3>Summary</h3>
                    <p>This note contains handwritten text that has been processed by our (currently mocked) AI service.</p>
                    <h3>Key Concepts</h3>
                    <ul>
                        <li>Static Content</li>
                        <li>Mocked API</li>
                        <li>Placeholder Data</li>
                    </ul>
                `
            });
        }, 800); // Simulate slight network delay
    });
};
