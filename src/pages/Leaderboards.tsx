
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { db } from '@/services/database';
import { Leaderboard, User } from '@/models/types';
import { TrophyIcon, MedalIcon, AwardIcon } from 'lucide-react';

const MedalIcon = ({ size = 24, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="8" r="6" />
    <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
  </svg>
);

const LeaderboardsPage = () => {
  const [leaderboards, setLeaderboards] = useState<Leaderboard[]>([]);
  const [users, setUsers] = useState<Map<string, User>>(new Map());
  const [currentSport, setCurrentSport] = useState<string>("all");
  const [currentPeriod, setCurrentPeriod] = useState<string>("all");
  
  useEffect(() => {
    // Load leaderboards and users
    const fetchData = async () => {
      const leaderboardsData = await db.getLeaderboards();
      const usersData = await db.getUsers();
      
      // Create map of users for easy lookup
      const usersMap = new Map<string, User>();
      usersData.forEach(user => usersMap.set(user.id, user));
      
      setLeaderboards(leaderboardsData);
      setUsers(usersMap);
    };
    
    fetchData();
  }, []);
  
  // Filter leaderboards based on selected sport and period
  const filteredLeaderboards = leaderboards.filter(leaderboard => {
    if (currentSport !== "all" && leaderboard.sport !== currentSport) {
      return false;
    }
    if (currentPeriod !== "all" && leaderboard.period !== currentPeriod) {
      return false;
    }
    return true;
  });
  
  // Get unique sports for filter
  const sports = Array.from(new Set(leaderboards.map(l => l.sport)));
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-clover-primary mb-8">Leaderboards</h1>
      
      <div className="flex flex-wrap gap-4 mb-6">
        <Card className="flex-1">
          <CardHeader className="py-4">
            <CardDescription>Sport</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1 rounded-full text-sm ${
                  currentSport === "all" 
                    ? "bg-clover-primary text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setCurrentSport("all")}
              >
                All
              </button>
              
              {sports.map(sport => (
                <button
                  key={sport}
                  className={`px-3 py-1 rounded-full text-sm ${
                    currentSport === sport 
                      ? "bg-clover-primary text-white" 
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setCurrentSport(sport)}
                >
                  {sport}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="flex-1">
          <CardHeader className="py-4">
            <CardDescription>Time Period</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-3 py-1 rounded-full text-sm ${
                  currentPeriod === "all" 
                    ? "bg-clover-primary text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setCurrentPeriod("all")}
              >
                All
              </button>
              
              <button
                className={`px-3 py-1 rounded-full text-sm ${
                  currentPeriod === "weekly" 
                    ? "bg-clover-primary text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setCurrentPeriod("weekly")}
              >
                Weekly
              </button>
              
              <button
                className={`px-3 py-1 rounded-full text-sm ${
                  currentPeriod === "monthly" 
                    ? "bg-clover-primary text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setCurrentPeriod("monthly")}
              >
                Monthly
              </button>
              
              <button
                className={`px-3 py-1 rounded-full text-sm ${
                  currentPeriod === "yearly" 
                    ? "bg-clover-primary text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setCurrentPeriod("yearly")}
              >
                Yearly
              </button>
              
              <button
                className={`px-3 py-1 rounded-full text-sm ${
                  currentPeriod === "allTime" 
                    ? "bg-clover-primary text-white" 
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setCurrentPeriod("allTime")}
              >
                All Time
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {filteredLeaderboards.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredLeaderboards.map(leaderboard => (
            <Card key={leaderboard.id} className="overflow-hidden">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>{leaderboard.title}</CardTitle>
                    <CardDescription>
                      {leaderboard.period === "weekly" && "Weekly Rankings"}
                      {leaderboard.period === "monthly" && "Monthly Rankings"}
                      {leaderboard.period === "yearly" && "Yearly Rankings"}
                      {leaderboard.period === "allTime" && "All Time Rankings"}
                    </CardDescription>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-clover-light flex items-center justify-center text-clover-primary">
                    <TrophyIcon size={20} />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="space-y-4">
                  {leaderboard.entries
                    .sort((a, b) => a.rank - b.rank)
                    .map((entry, index) => {
                      const user = users.get(entry.userId);
                      
                      return (
                        <div 
                          key={entry.userId} 
                          className={`flex items-center p-3 rounded-lg ${
                            index === 0 ? "bg-amber-50" :
                            index === 1 ? "bg-gray-50" :
                            index === 2 ? "bg-amber-50/50" :
                            "bg-white"
                          }`}
                        >
                          <div className="flex items-center justify-center h-8 w-8 rounded-full mr-3">
                            {index === 0 && (
                              <div className="text-amber-500">
                                <TrophyIcon size={20} />
                              </div>
                            )}
                            {index === 1 && (
                              <div className="text-gray-400">
                                <MedalIcon size={20} />
                              </div>
                            )}
                            {index === 2 && (
                              <div className="text-amber-700">
                                <AwardIcon size={20} />
                              </div>
                            )}
                            {index > 2 && (
                              <span className="text-sm font-medium text-gray-600">{index + 1}</span>
                            )}
                          </div>
                          
                          <Avatar className="h-10 w-10 mr-3">
                            <AvatarImage src={user?.avatar} alt={user?.name} />
                            <AvatarFallback>{user?.name?.substring(0, 2) || "U"}</AvatarFallback>
                          </Avatar>
                          
                          <div className="flex-grow">
                            <p className="font-medium">{user?.name || "Unknown Player"}</p>
                            <p className="text-xs text-gray-500">{user?.location || "—"}</p>
                          </div>
                          
                          <div className="text-xl font-bold text-clover-primary">
                            {entry.score}
                            <span className="text-xs text-gray-500 ml-1">pts</span>
                          </div>
                        </div>
                      );
                    })}
                    
                    {leaderboard.entries.length === 0 && (
                      <p className="text-center text-gray-500 py-4">No entries yet</p>
                    )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <TrophyIcon size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500">No leaderboards found for the selected filters</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LeaderboardsPage;
