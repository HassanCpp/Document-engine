import OpenAI from "openai";
import { SoMTaggedPage, SoMTagItem } from "./som-tagger.js";
import { ContentBlock, ProcessOptions, BlockType } from "../types.js";

export interface SoMVisionPageResult {
  pageNumber: number;
  blocks: ContentBlock[];
}

export async function processSoMVisionPage(
  somPage: SoMTaggedPage,
  options?: ProcessOptions
): Promise<SoMVisionPageResult> {
  const apiKey = options?.apiKey || process.env.OPENAI_API_KEY;

  if (!apiKey) {
    const blocks: ContentBlock[] = somPage.tags.map((t, idx) => ({
      id: `som_block_${somPage.pageNumber}_${idx}`,
      type: t.type,
      content: t.draftContent,
      boundingBox: t.boundingBox,
      sourceMethod: "ocr",
      confidence: 0.9,
      pageNumber: somPage.pageNumber,
    }));

    return { pageNumber: somPage.pageNumber, blocks };
  }

  const openai = new OpenAI({ apiKey });
  const model = options?.model || "gpt-4o";

  const systemPrompt = `You are a High-Precision Document Intelligence & Multimodal Vision Engine.
Analyze the provided page image with overlaid color-coded bounding boxes and visual badge tags ([P-01], [C-01], [H-01], [T-01], [E-01], [F-01]).

CRITICAL TABLE DETECTION & FORMATTING MANDATE:
1. Whenever a region on the page image consists of multi-column tabular data, character entity tables, property matrices, or 2D rows & columns (e.g. "Result Description Name Number"), you MUST set type: "table" and format it as a clean Markdown table (| Header 1 | Header 2 | Header 3 |). NEVER return a multi-column table as plain paragraphs!
2. Extract EVERY SINGLE text element, header, code box, sample output text, quote block, and table visible on the page.
3. NEVER skip or summarize code snippets (e.g. "p, h1, h2 { color: green; }"). Extract them verbatim as type "code".
4. Reconcile content for each visual tag ID ([P-01], [C-01], [T-01], etc.) referencing the reference map.
5. Output strict JSON conforming to the PageDOM schema.`;

  const pageDomSchema = {
    name: "PageDOM",
    strict: true,
    schema: {
      type: "object",
      properties: {
        blocks: {
          type: "array",
          items: {
            type: "object",
            properties: {
              tagId: { type: "string", description: "Reference badge tag ID e.g. [P-01], [C-01], [T-01], [H-01]" },
              type: {
                type: "string",
                enum: [
                  "paragraph",
                  "heading",
                  "table",
                  "figure",
                  "chart",
                  "equation",
                  "code",
                  "list",
                ],
              },
              content: {
                type: "string",
                description: "Verbatim transcribed text, Markdown table (| Col 1 | Col 2 |), LaTeX string, or code snippet",
              },
              columnGroup: { type: "integer", description: "1 for left column/main, 2 for right column/sidebar" },
              confidence: { type: "number" },
            },
            required: ["tagId", "type", "content", "columnGroup", "confidence"],
            additionalProperties: false,
          },
        },
      },
      required: ["blocks"],
      additionalProperties: false,
    },
  };

  try {
    const response = await openai.chat.completions.create({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Reconcile Set-of-Marks tags for Page ${somPage.pageNumber}. If any tag covers tabular multi-column rows (e.g. Character Entities, tables), format it strictly as a Markdown table (| Col 1 | Col 2 |):\n\n${somPage.referenceMapText}`,
            },
            {
              type: "image_url",
              image_url: { url: somPage.somDataUrl, detail: "high" },
            },
          ],
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: pageDomSchema,
      },
      temperature: 0.1,
    });

    const messageContent = response.choices[0]?.message?.content;
    const parsed = messageContent ? JSON.parse(messageContent) : { blocks: [] };

    const tagLookup = new Map<string, SoMTagItem>();
    somPage.tags.forEach((t) => tagLookup.set(t.tagId, t));

    const blocks: ContentBlock[] = (parsed.blocks || []).map((b: any, idx: number) => {
      const matchedTag = tagLookup.get(b.tagId);
      const boundingBox = matchedTag ? matchedTag.boundingBox : [100, 100, 900, 900];

      return {
        id: `som_dom_${somPage.pageNumber}_${idx}`,
        type: b.type as BlockType,
        content: b.content,
        boundingBox,
        sourceMethod: "ocr",
        confidence: typeof b.confidence === "number" ? Math.max(0, Math.min(1, b.confidence)) : 0.95,
        pageNumber: somPage.pageNumber,
      };
    });

    return {
      pageNumber: somPage.pageNumber,
      blocks,
    };
  } catch (err: any) {
    console.error(`[SoM Vision] OpenAI processing error for page ${somPage.pageNumber}:`, err);
    const fallbackBlocks: ContentBlock[] = somPage.tags.map((t, idx) => ({
      id: `som_err_${somPage.pageNumber}_${idx}`,
      type: t.type,
      content: t.draftContent,
      boundingBox: t.boundingBox,
      sourceMethod: "ocr",
      confidence: 0.8,
      pageNumber: somPage.pageNumber,
    }));

    return { pageNumber: somPage.pageNumber, blocks: fallbackBlocks };
  }
}
