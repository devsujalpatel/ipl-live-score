import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch(
      "https://ipl-okn0.onrender.com/ipl-2025-schedule"
    );
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching schedule data:", error);
    res.status(500).json({ error: "Failed to fetch schedule" });
  }
}
