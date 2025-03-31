import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const team = req.query.team as string;

  if (!team || typeof team !== "string") {
    return res.status(400).json({ error: "Team name is required and must be a string" });
  }

  try {
    const response = await fetch(`https://ipl-okn0.onrender.com/squad/${encodeURIComponent(team)}`);

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();

    if (!data || Object.keys(data).length === 0) {
      return res.status(404).json({ error: "Squad data not found for the given team" });
    }

    res.status(200).json(data);
  } catch (error: unknown) {
    console.error("Error fetching Squad data:", error);
    res.status(500).json({ error: "Failed to fetch Squad" });
  }
}
