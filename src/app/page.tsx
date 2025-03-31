"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState, useEffect } from "react";

export default function Home() {
  const [liveScore, setLiveScore] = useState<any[]>([]);
  const [schedule, setSchedule] = useState<any[]>([]);
  const [squad, setSquad] = useState<any[]>([]);
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
      else if (type === "squad") setSquad(data.squad);
      else if (type === "schedule") {
        const sortedSchedule = Object.entries(data)
          .sort(
            (a, b) =>
              Number(a[0].replace("Match ", "")) -
              Number(b[0].replace("Match ", ""))
          )
          .map(([match, details]) => {
            if (typeof details === "object" && details !== null) {
              return { match, ...details };
            } else {
              return { match };
            }
          });

        setSchedule(sortedSchedule);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(`Failed to fetch ${type}: ${error.message}`);
      } else {
        setError(`Failed to fetch ${type}: An unknown error occurred`);
      }
    }
  };

  useEffect(() => {
    fetchData("live-score");
    fetchData("schedule");
    fetchData("squad");
  }, [selectedTeam]);

  return <div className="mx-auto p-8 min-h-screen bg-gradient-to-r from-gray-900 to-indigo-900 text-white">
    <h1 className="text-4xl font-bold mb-8 text-center">Live Score & Schedule</h1>
  </div>;
}
