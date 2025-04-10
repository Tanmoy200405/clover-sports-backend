
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authService } from '@/services/auth';
import { db } from '@/services/database';
import { Activity, Team, Achievement, User } from '@/models/types';
import { MapPinIcon, CalendarIcon, TrophyIcon } from 'lucide-react';
import { format } from 'date-fns';

const Profile = () => {
  const [authState, setAuthState] = useState(authService.getState());
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  
  useEffect(() => {
    // Subscribe to auth changes
    const unsubscribe = authService.subscribe(setAuthState);
    
    // Initialize form values when user data is loaded
    if (authState.user) {
      setName(authState.user.name || "");
      setBio(authState.user.bio || "");
      setLocation(authState.user.location || "");
      
      // Load user activities and teams
      const fetchUserData = async () => {
        if (authState.user) {
          const allActivities = await db.getActivities();
          const userActivities = allActivities.filter(activity => 
            activity.participants.includes(authState.user.id) ||
            activity.hostId === authState.user.id
          );
          
          const allTeams = await db.getTeams();
          const userTeams = allTeams.filter(team => 
            team.members.includes(authState.user.id) ||
            team.captainId === authState.user.id
          );
          
          setActivities(userActivities);
          setTeams(userTeams);
        }
      };
      
      fetchUserData();
    }
    
    return unsubscribe;
  }, [authState.user?.id]);
  
  const handleUpdateProfile = async () => {
    if (authState.user) {
      await authService.updateProfile({
        name,
        bio,
        location
      });
      setIsEditing(false);
    }
  };
  
  const handleLogout = () => {
    authService.logout();
  };
  
  if (!authState.isAuthenticated) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle>Please login to view your profile</CardTitle>
        </CardHeader>
      </Card>
    );
  }
  
  const { user } = authState;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="flex flex-col items-center">
          <Avatar className="h-24 w-24 mb-4">
            <AvatarImage src={user.avatar} />
            <AvatarFallback>{user.name?.substring(0, 2) || "U"}</AvatarFallback>
          </Avatar>
          
          {isEditing ? (
            <Input 
              value={name} 
              onChange={(e) => setName(e.target.value)}
              className="text-center font-bold text-2xl mb-2 max-w-xs"
            />
          ) : (
            <CardTitle className="text-2xl">{user.name}</CardTitle>
          )}
          
          <div className="flex items-center gap-2 text-gray-600 mt-1">
            {isEditing ? (
              <div className="flex items-center">
                <MapPinIcon size={16} className="mr-1" />
                <Input 
                  value={location} 
                  onChange={(e) => setLocation(e.target.value)}
                  className="max-w-xs"
                  placeholder="Your location"
                />
              </div>
            ) : (
              user.location && (
                <div className="flex items-center">
                  <MapPinIcon size={16} className="mr-1" />
                  <span>{user.location}</span>
                </div>
              )
            )}
          </div>
          
          <div className="flex items-center gap-2 text-gray-600 mt-1">
            <CalendarIcon size={16} className="mr-1" />
            <span>Joined {format(new Date(user.joinedDate), 'MMMM yyyy')}</span>
          </div>
          
          <div className="mt-4 flex gap-4">
            {isEditing ? (
              <>
                <Button 
                  variant="default" 
                  className="bg-clover-primary hover:bg-clover-dark"
                  onClick={handleUpdateProfile}
                >
                  Save
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsEditing(false);
                    setName(user.name || "");
                    setBio(user.bio || "");
                    setLocation(user.location || "");
                  }}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="mb-8">
            <h3 className="font-medium text-gray-600 mb-2">About</h3>
            {isEditing ? (
              <Textarea 
                value={bio} 
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                className="min-h-[100px]"
              />
            ) : (
              <p className="text-gray-700">{user.bio || "No bio provided"}</p>
            )}
          </div>
          
          <Tabs defaultValue="activities">
            <TabsList className="mb-4">
              <TabsTrigger value="activities">Activities</TabsTrigger>
              <TabsTrigger value="teams">Teams</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            </TabsList>
            
            <TabsContent value="activities">
              {activities.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activities.map(activity => (
                    <Card key={activity.id} className="overflow-hidden">
                      <div className="p-4">
                        <h3 className="font-medium">{activity.title}</h3>
                        <p className="text-gray-600 text-sm mb-2">{activity.category}</p>
                        
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                          <CalendarIcon size={14} />
                          <span>{format(new Date(activity.date), 'PPP')}</span>
                        </div>
                        
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                          <MapPinIcon size={14} />
                          <span>{activity.location}</span>
                        </div>
                        
                        {activity.hostId === user.id && (
                          <div className="mt-2">
                            <span className="px-2 py-1 bg-clover-light text-clover-dark text-xs font-medium rounded-md">
                              You are hosting
                            </span>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No activities yet</p>
              )}
            </TabsContent>
            
            <TabsContent value="teams">
              {teams.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {teams.map(team => (
                    <Card key={team.id} className="overflow-hidden">
                      <div className="p-4">
                        <h3 className="font-medium">{team.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{team.sport}</p>
                        
                        <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                          <MapPinIcon size={14} />
                          <span>{team.location}</span>
                        </div>
                        
                        {team.captainId === user.id && (
                          <div className="mt-2">
                            <span className="px-2 py-1 bg-clover-light text-clover-dark text-xs font-medium rounded-md">
                              Team Captain
                            </span>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No teams yet</p>
              )}
            </TabsContent>
            
            <TabsContent value="achievements">
              {user.achievements && user.achievements.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {user.achievements.map(achievement => (
                    <Card key={achievement.id} className="overflow-hidden">
                      <div className="flex items-center p-4">
                        <div className="h-12 w-12 rounded-full bg-clover-light flex items-center justify-center mr-3 text-clover-primary">
                          <TrophyIcon size={24} />
                        </div>
                        <div>
                          <h3 className="font-medium">{achievement.title}</h3>
                          <p className="text-gray-600 text-sm">{achievement.description}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No achievements yet</p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
