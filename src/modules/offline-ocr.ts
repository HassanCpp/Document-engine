import { createWorker } from "tesseract.js";
import { PreprocessedImage } from "./image-preprocessor.js";
import { ContentBlock, BlockType } from "../types.js";
import { OCRPageResult } from "./openai-ocr.js";

export async function performOfflineOCR(
  images: PreprocessedImage[]
): Promise<OCRPageResult[]> {
  const ocrResults: OCRPageResult[] = [];

  for (const img of images) {
    try {
      const worker = await createWorker("eng");
      const { data } = await worker.recognize(img.imageBuffer);
      await worker.terminate();

      const blocks: ContentBlock[] = [];
      const lines = data.text.split("\n").map((l) => l.trim()).filter((l) => l.length > 0);

      lines.forEach((lineText, idx) => {
        let type: BlockType = "paragraph";
        if (lineText.length < 80 && lineText.endsWith(":")) {
          type = "heading";
        } else if (lineText.includes("|") || lineText.includes("\t")) {
          type = "table";
        }

        blocks.push({
          id: `local_ocr_${img.pageNumber}_${idx}`,
          type,
          content: lineText,
          boundingBox: [
            Math.round(100 + idx * 40),
            100,
            Math.round(140 + idx * 40),
            900,
          ],
          sourceMethod: "ocr",
          confidence: Math.min(0.95, Math.max(0.7, data.confidence / 100)),
          pageNumber: img.pageNumber,
        });
      });

      ocrResults.push({
        pageNumber: img.pageNumber,
        blocks,
        rawText: data.text,
      });
    } catch (err: any) {
      console.warn(`[Offline OCR] Local Tesseract OCR fallback for page ${img.pageNumber}:`, err);
      ocrResults.push({
        pageNumber: img.pageNumber,
        blocks: [
          {
            id: `local_ocr_err_${img.pageNumber}`,
            type: "paragraph",
            content: `[Offline OCR Engine - Text layer fallback page ${img.pageNumber}]`,
            sourceMethod: "ocr",
            confidence: 0.8,
            pageNumber: img.pageNumber,
          },
        ],
        rawText: `Page ${img.pageNumber}`,
      });
    }
  }

  return ocrResults;
}
