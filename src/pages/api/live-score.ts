import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const response = await fetch(
      "https://api.cricapi.com/v1/currentMatches?apikey=fba495cb-9715-41af-a494-14e00b50967b&offset=0"
    );
    const data = await response.json();

    if (!data || !data.data) {
      return res.status(500).json({ error: "Invalid API response" }); 
    }

    const iplTeams = [
        "Chennai Super Kings",
        "Delhi Capitals",
        "Mumbai Indians",
        "Kolkata Knight Riders",
        "Royal Challengers Bangalore",
        "Sunrisers Hyderabad",
        "Rajasthan Royals",
        "Punjab Kings",
        "Lucknow Super Giants",
        "Gujarat Titans"
    ];
    
   const iplMatches = data.data.filter((match:{teams : string[]}) => {
        match.teams.some(team => iplTeams.includes(team))
    })

    res.status(200).json({ matches: iplMatches});
  } catch (error) {
    console.error("Error fetching live score data:", error);
    res.status(500).json({ error: "Failed to fetch score live" });
  }
}
