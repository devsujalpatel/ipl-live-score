import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const response = await fetch("https://ipl-okn0.onrender.com/ipl-2025-schedule");

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (!data || Object.keys(data).length === 0) {
      return res.status(404).json({ error: "No schedule data found" });
    }

    res.status(200).json(data);
  } catch (error: unknown) {
    console.error("Error fetching schedule data:", error);
    res.status(500).json({ error: "Failed to fetch schedule" });
  }
}
