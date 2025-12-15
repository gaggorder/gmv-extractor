import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const SYSTEM_INSTRUCTION = `You are a specialized financial data extraction assistant. 
Your task is to analyze an image of a financial data table and extract specific GMV (Gross Merchandise Value) metrics.
You must format the output exactly into a specific bullet-point format.

**Extraction Targets:**
1. **Dates:** Look at the header rows (typically "This Month") to find the specific date range (e.g., "12/1/25 to 12/14/25").
2. **Metrics:** specific rows matching:
   - "Confirmed GMV" (This is the Total)
   - "Elite Confirmed GMV"
   - "Enterprise Confirmed GMV"
   - "Pro Confirmed GMV"
3. **Values:** For each metric, extract:
   - The value in the "This Month" column.
   - The percentage value in the "vs Last Month" column.
   - The percentage value in the "vs Last Year" column.

**Formatting Rules:**
- The output must start with a bold header line: **MTD As of Yesterday ([Start Date]-[End Date]) Confirmed GMV:**
- Followed by a list:
- **Total:** [Amount] ([MoM]% MoM, [YoY]% YoY)
- **Elite:** [Amount] ([MoM]% MoM, [YoY]% YoY)
- **Enterprise:** [Amount] ([MoM]% MoM, [YoY]% YoY)
- **Pro:** [Amount] ([MoM]% MoM, [YoY]% YoY)

**Important Notes:**
- Preserve the exact formatting of numbers (dollar signs, commas).
- Ensure positive percentages have a '+' sign and negative have a '-' sign.
- If a value is missing or 0, report it as seen.
- Do not output any introductory text or markdown code blocks (like \`\`\`), just the raw formatted text.
`;

export const extractGmvData = async (base64Image: string, mimeType: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Using gemini-2.5-flash as it is excellent for multimodal extraction and text formatting
    // as per guidelines for "Basic Text Tasks" and extracting from images.
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: base64Image
            }
          },
          {
            text: "Extract the confirmed GMV data for Total, Elite, Enterprise, and Pro. Format strictly as the requested bullet points."
          }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.1, // Low temperature for high precision/extraction
      }
    });

    return response.text || "No text could be extracted.";
  } catch (error) {
    console.error("Gemini Extraction Error:", error);
    throw new Error("Failed to extract data from the image. Please try again.");
  }
};