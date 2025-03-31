"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";

interface Match {
  name: string;
  venue: string;
  dateTimeGMT: string;
  status: string;
  matchStarted: boolean;
  matchEnded: boolean;
  score?: { inning: string; r: number; w: number; o: number }[];
}

interface SquadMember {
  name: string;
  role: string;
}

interface Schedule {
  match: string;
  [key: string]: unknown;
}

export default function Home() {
  const [liveScore, setLiveScore] = useState<Match[]>([]);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [squad, setSquad] = useState<SquadMember[]>([]);
  const [error, setError] = useState<string>("");
  const [selectedTeam, setSelectedTeam] = useState<string>("csk");

  const fetchData = async (type: "live-score" | "schedule" | "squad") => {
    try {
      const url =
        type === "squad" ? `/api/${type}?team=${selectedTeam}` : `/api/${type}`;
      const res = await fetch(url);

      if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

      const data = await res.json();

      if (type === "live-score") setLiveScore(data.matches || []);
      else if (type === "squad") setSquad(data.squad || []);
      else if (type === "schedule") {
        const sortedSchedule = Object.entries(data)
          .sort((a, b) => {
            const matchNumberA = Number(a[0].replace(/\D/g, "")) || 0;
            const matchNumberB = Number(b[0].replace(/\D/g, "")) || 0;
            return matchNumberA - matchNumberB;
          })
          .map(([match, details]) =>
            typeof details === "object" && details !== null
              ? { match, ...details }
              : { match }
          );

        setSchedule(sortedSchedule);
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
    }
  };

  useEffect(() => {
    fetchData("live-score");
    fetchData("schedule");
    fetchData("squad");
  }, [selectedTeam]);

  return (
    <div className="container mx-auto p-8 min-h-screen bg-gradient-to-r from-gray-900 to-indigo-900 text-white">
      <h1 className="text-4xl font-bold mb-8 text-center">Live Score & Schedule</h1>
      <Tabs defaultValue="live-score" className="w-full">
        <TabsList className="flex justify-center mb-8 bg-amber-50 text-black">
          <TabsTrigger value="live-score" onClick={() => fetchData("live-score")}
            className="px-6 py-4 text-xl font-semibold rounded-lg transition-all focus:outline-none data-[state=active]:bg-yellow-500 data-[state=active]:text-gray-900 data-[state=active]:shadow-lg cursor-pointer">
            Live Score
          </TabsTrigger>
          <TabsTrigger value="schedule" onClick={() => fetchData("schedule")}
            className="px-6 py-4 text-xl font-semibold rounded-lg transition-all focus:outline-none data-[state=active]:bg-yellow-500 data-[state=active]:text-gray-900 data-[state=active]:shadow-lg cursor-pointer ml-4">
            Schedule
          </TabsTrigger>
          <TabsTrigger value="squad" onClick={() => fetchData("squad")}
            className="px-6 py-4 text-xl font-semibold rounded-lg transition-all focus:outline-none data-[state=active]:bg-yellow-500 data-[state=active]:text-gray-900 data-[state=active]:shadow-lg cursor-pointer ml-4">
            Squad
          </TabsTrigger>
        </TabsList>
        <TabsContent value="live-score">
          {error ? (
            <p className="text-red-400">{error}</p>
          ) : (
            <div>
              {liveScore.length === 0 ? (
                <p className="text-yellow-300">No Live Matches available.</p>
              ) : (
                liveScore.map((match, index) => (
                  <div key={index} className="p-6 bg-gray-800 rounded-lg mb-6 shadow-lg border border-yellow-400">
                    <h2 className="text-2xl font-bold mb-2">{match.name}</h2>
                    <p className="text-gray-300">🍭 Venue: {match.venue}</p>
                    <p className="text-gray-300">📅 Date: {new Date(match.dateTimeGMT).toLocaleString()}</p>
                    <p className="text-green-400 font-semibold">🟢 Status: {match.status}</p>
                    {match.score && match.score.length > 0 ? (
                      <div className="mt-4">
                        {match.score.map((teamScore, i) => (
                          <p key={i} className="text-gray-300">
                            <span className="font-bold">{teamScore.inning}</span> - {teamScore.r}/{teamScore.w} ({teamScore.o} Overs)
                          </p>
                        ))}
                      </div>
                    ) : (
                      <p className="text-yellow-400">No Score Available</p>
                    )}
                    <p className="mt-4 text-yellow-400">Match Started: {match.matchStarted ? "✅ Yes" : "❌ No"}</p>
                    <p className="mt-4 text-red-400">Match Ended: {match.matchEnded ? "✅ Yes" : "❌ No"}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
