import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { team } = req.query;
  if (!team) {
    return res.status(400).json({ error: "Team name is required" });
  }
  try {
    const response = await fetch(`https://ipl-okn0.onrender.com/squad/${team}`);
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching Squad data:", error);
    res.status(500).json({ error: "Failed to fetch Squad" });
  }
}
