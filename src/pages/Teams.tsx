
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { db } from '@/services/database';
import { authService } from '@/services/auth';
import { Team, User } from '@/models/types';
import { MapPinIcon, UsersIcon, SearchIcon, FilterIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const TeamsPage = () => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<Map<string, User>>(new Map());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [authState, setAuthState] = useState(authService.getState());
  
  // Get unique sports for filter
  const sportsSet = new Set<string>();
  teams.forEach(team => {
    if (team.sport) {
      sportsSet.add(team.sport);
    }
  });
  const sports = Array.from(sportsSet);
  
  useEffect(() => {
    // Load teams and users
    const fetchData = async () => {
      const teamsData = await db.getTeams();
      const usersData = await db.getUsers();
      
      // Create map of users for easy lookup
      const usersMap = new Map<string, User>();
      usersData.forEach(user => usersMap.set(user.id, user));
      
      setTeams(teamsData);
      setUsers(usersMap);
    };
    
    fetchData();
    
    // Subscribe to auth changes
    const unsubscribe = authService.subscribe(setAuthState);
    return unsubscribe;
  }, []);
  
  // Filter teams based on search term and selected sport
  const filteredTeams = teams.filter(team => {
    const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         team.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSport = selectedSport ? team.sport === selectedSport : true;
    return matchesSearch && matchesSport;
  });
  
  const handleJoinTeam = async (teamId: string) => {
    if (!authState.isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to join this team.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const updatedTeam = await db.joinTeam(teamId, authState.user.id);
      
      if (updatedTeam) {
        setTeams(prevTeams => 
          prevTeams.map(team => 
            team.id === teamId ? updatedTeam : team
          )
        );
        
        toast({
          title: "Team Joined",
          description: "You have successfully joined this team.",
        });
      }
    } catch (error) {
      console.error('Error joining team:', error);
      toast({
        title: "Error",
        description: "Failed to join team. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-clover-primary mb-8">Teams</h1>
      
      {/* Search and Filter */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input 
              placeholder="Search teams..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            <Button
              variant={selectedSport === null ? "default" : "outline"}
              className={selectedSport === null ? "bg-clover-primary hover:bg-clover-dark" : ""}
              onClick={() => setSelectedSport(null)}
            >
              All Sports
            </Button>
            
            {sports.map(sport => (
              <Button
                key={sport}
                variant={selectedSport === sport ? "default" : "outline"}
                className={selectedSport === sport ? "bg-clover-primary hover:bg-clover-dark" : ""}
                onClick={() => setSelectedSport(sport)}
              >
                {sport}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      {filteredTeams.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTeams.map(team => {
            const captain = users.get(team.captainId);
            return (
              <Card key={team.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
                  {team.logo ? (
                    <img 
                      src={team.logo} 
                      alt={team.name} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="bg-clover-light w-16 h-16 rounded-full flex items-center justify-center text-clover-primary text-2xl font-bold">
                      {team.name.substring(0, 1)}
                    </div>
                  )}
                </div>
                
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{team.name}</CardTitle>
                      <CardDescription>{team.sport}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{team.description}</p>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <MapPinIcon size={16} />
                    <span>{team.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <UsersIcon size={16} />
                    <span>{team.members.length} members</span>
                  </div>
                  
                  {captain && (
                    <div className="flex items-center mt-4">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage src={captain.avatar} alt={captain.name} />
                        <AvatarFallback>{captain.name.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">Captain: {captain.name}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter>
                  <Button 
                    variant="default" 
                    className="w-full bg-clover-primary hover:bg-clover-dark"
                    onClick={() => handleJoinTeam(team.id)}
                    disabled={authState.isAuthenticated && team.members.includes(authState.user.id)}
                  >
                    {authState.isAuthenticated && team.members.includes(authState.user.id) 
                      ? "Already a Member" 
                      : "Join Team"}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UsersIcon size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500">No teams found</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TeamsPage;
