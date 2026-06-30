import type { VercelRequest, VercelResponse } from "@vercel/node";

const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQCPGxbKogw93V9PBXklJgsA35TXFMbC8aRd5hwAf4KsIaCdN0F4mvLlybMB6Q-7dx04DWUbAjKzR2E/pub?output=csv";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  try {
    const response = await fetch(CSV_URL);

    if (!response.ok) {
      throw new Error("Unable to fetch CSV");
    }

    const csv = await response.text();

    res.setHeader("Cache-Control", "s-maxage=300");

    res.status(200).json({
      success: true,
      csv,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: String(err),
    });
  }
}