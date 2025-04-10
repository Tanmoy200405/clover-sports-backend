
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { db } from '@/services/database';
import { authService } from '@/services/auth';
import { Activity, Post, Team, User } from '@/models/types';
import { CalendarIcon, MapPinIcon, UsersIcon, TrophyIcon, MessageSquareIcon } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from '@/hooks/use-toast';

const Community = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [users, setUsers] = useState<Map<string, User>>(new Map());
  const [authState, setAuthState] = useState(authService.getState());

  // New post form state
  const [newPostTitle, setNewPostTitle] = useState("");
  const [newPostContent, setNewPostContent] = useState("");
  const [newPostCategory, setNewPostCategory] = useState("General");

  // New comment form state
  const [commentText, setCommentText] = useState<{ [postId: string]: string }>({});

  useEffect(() => {
    // Load data from database
    const fetchData = async () => {
      const activitiesData = await db.getActivities();
      const teamsData = await db.getTeams();
      const postsData = await db.getPosts();
      const usersData = await db.getUsers();
      
      // Create map of users for easy lookup
      const usersMap = new Map<string, User>();
      usersData.forEach(user => usersMap.set(user.id, user));
      
      setActivities(activitiesData);
      setTeams(teamsData);
      setPosts(postsData);
      setUsers(usersMap);
    };
    
    fetchData();
    
    // Subscribe to auth changes
    const unsubscribe = authService.subscribe(setAuthState);
    return unsubscribe;
  }, []);
  
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!authState.isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to create a post.",
        variant: "destructive"
      });
      return;
    }
    
    if (!newPostTitle.trim() || !newPostContent.trim()) {
      toast({
        title: "Validation Error",
        description: "Title and content are required.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const newPost = await db.createPost({
        title: newPostTitle,
        content: newPostContent,
        authorId: authState.user.id,
        category: newPostCategory,
        tags: newPostCategory ? [newPostCategory.toLowerCase()] : []
      });
      
      setPosts(prevPosts => [newPost, ...prevPosts]);
      
      setNewPostTitle("");
      setNewPostContent("");
      setNewPostCategory("General");
      
      toast({
        title: "Post Created",
        description: "Your post has been published.",
      });
    } catch (error) {
      console.error('Error creating post:', error);
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleAddComment = async (postId: string) => {
    if (!authState.isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to add a comment.",
        variant: "destructive"
      });
      return;
    }
    
    const text = commentText[postId];
    
    if (!text || !text.trim()) {
      toast({
        title: "Validation Error",
        description: "Comment text is required.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const updatedPost = await db.addComment(postId, {
        content: text,
        authorId: authState.user.id
      });
      
      if (updatedPost) {
        setPosts(prevPosts => 
          prevPosts.map(post => 
            post.id === postId ? updatedPost : post
          )
        );
        
        // Clear comment input
        setCommentText(prev => ({ ...prev, [postId]: "" }));
        
        toast({
          title: "Comment Added",
          description: "Your comment has been posted.",
        });
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleJoinActivity = async (activityId: string) => {
    if (!authState.isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please login to join this activity.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const updatedActivity = await db.joinActivity(activityId, authState.user.id);
      
      if (updatedActivity) {
        setActivities(prevActivities => 
          prevActivities.map(activity => 
            activity.id === activityId ? updatedActivity : activity
          )
        );
        
        toast({
          title: "Activity Joined",
          description: "You have successfully joined this activity.",
        });
      }
    } catch (error) {
      console.error('Error joining activity:', error);
      toast({
        title: "Error",
        description: "Failed to join activity. Please try again.",
        variant: "destructive"
      });
    }
  };
  
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
      <h1 className="text-4xl font-bold text-clover-primary mb-8">Clover Community</h1>
      
      <Tabs defaultValue="activities" className="w-full">
        <TabsList className="mb-8">
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="discussions">Discussions</TabsTrigger>
        </TabsList>
        
        {/* Activities Tab */}
        <TabsContent value="activities">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map(activity => {
              const host = users.get(activity.hostId);
              return (
                <Card key={activity.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  {activity.image && (
                    <div className="h-48 overflow-hidden">
                      <img 
                        src={activity.image} 
                        alt={activity.title} 
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{activity.title}</CardTitle>
                        <CardDescription>{activity.category}</CardDescription>
                      </div>
                      <span className="px-2 py-1 bg-clover-light text-clover-dark text-xs font-medium rounded-md">
                        {activity.status}
                      </span>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{activity.description}</p>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <CalendarIcon size={16} />
                      <span>{format(new Date(activity.date), 'PPP')} at {activity.time}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <MapPinIcon size={16} />
                      <span>{activity.location}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                      <UsersIcon size={16} />
                      <span>
                        {activity.participants.length} 
                        {activity.maxParticipants ? ` / ${activity.maxParticipants}` : ''} participants
                      </span>
                    </div>
                    
                    {host && (
                      <div className="flex items-center mt-4">
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage src={host.avatar} alt={host.name} />
                          <AvatarFallback>{host.name.substring(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">Hosted by {host.name}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  
                  <CardFooter>
                    <Button 
                      variant="default" 
                      className="w-full bg-clover-primary hover:bg-clover-dark"
                      onClick={() => handleJoinActivity(activity.id)}
                      disabled={authState.isAuthenticated && activity.participants.includes(authState.user.id)}
                    >
                      {authState.isAuthenticated && activity.participants.includes(authState.user.id) 
                        ? "Already Joined" 
                        : "Join Activity"}
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </TabsContent>
        
        {/* Teams Tab */}
        <TabsContent value="teams">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map(team => {
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
                      <TrophyIcon size={64} className="text-gray-300" />
                    )}
                  </div>
                  
                  <CardHeader>
                    <CardTitle>{team.name}</CardTitle>
                    <CardDescription>{team.sport}</CardDescription>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4">{team.description}</p>
                    
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
        </TabsContent>
        
        {/* Discussions Tab */}
        <TabsContent value="discussions">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create Post Form */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Start a Discussion</CardTitle>
                  <CardDescription>Share your thoughts with the community</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleCreatePost} className="space-y-4">
                    <div>
                      <Input
                        placeholder="Title"
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                        className="mb-2"
                      />
                    </div>
                    
                    <div>
                      <Textarea
                        placeholder="What's on your mind?"
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        className="min-h-[120px]"
                      />
                    </div>
                    
                    <div>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        value={newPostCategory}
                        onChange={(e) => setNewPostCategory(e.target.value)}
                      >
                        <option value="General">General</option>
                        <option value="Cricket">Cricket</option>
                        <option value="Football">Football</option>
                        <option value="Tennis">Tennis</option>
                        <option value="Yoga">Yoga</option>
                        <option value="Running">Running</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-clover-primary hover:bg-clover-dark"
                      disabled={!authState.isAuthenticated}
                    >
                      Post
                    </Button>
                    
                    {!authState.isAuthenticated && (
                      <p className="text-xs text-center text-gray-500">
                        Please login to create a post
                      </p>
                    )}
                  </form>
                </CardContent>
              </Card>
            </div>
            
            {/* Posts List */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {posts.map(post => {
                  const author = users.get(post.authorId);
                  return (
                    <Card key={post.id}>
                      <CardHeader>
                        <div className="flex justify-between">
                          <div className="flex items-center">
                            {author && (
                              <Avatar className="h-8 w-8 mr-2">
                                <AvatarImage src={author.avatar} alt={author.name} />
                                <AvatarFallback>{author.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                            )}
                            <div>
                              <CardTitle className="text-lg">{post.title}</CardTitle>
                              <CardDescription>
                                {author ? author.name : "Unknown"} • {format(new Date(post.createdAt), 'PP')}
                              </CardDescription>
                            </div>
                          </div>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-md">
                            {post.category}
                          </span>
                        </div>
                      </CardHeader>
                      
                      <CardContent>
                        <p className="text-gray-700 whitespace-pre-line">{post.content}</p>
                        
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex gap-2 mt-4">
                            {post.tags.map(tag => (
                              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {/* Comments */}
                        {post.comments.length > 0 && (
                          <div className="mt-6">
                            <h3 className="font-medium flex items-center gap-1 mb-4">
                              <MessageSquareIcon size={18} />
                              <span>{post.comments.length} Comments</span>
                            </h3>
                            
                            <div className="space-y-4">
                              {post.comments.map(comment => {
                                const commentAuthor = users.get(comment.authorId);
                                return (
                                  <div key={comment.id} className="flex gap-3">
                                    {commentAuthor && (
                                      <Avatar className="h-8 w-8">
                                        <AvatarImage src={commentAuthor.avatar} alt={commentAuthor.name} />
                                        <AvatarFallback>{commentAuthor.name.substring(0, 2)}</AvatarFallback>
                                      </Avatar>
                                    )}
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <p className="font-medium text-sm">
                                          {commentAuthor ? commentAuthor.name : "Unknown"}
                                        </p>
                                        <span className="text-xs text-gray-500">
                                          {format(new Date(comment.createdAt), 'PP')}
                                        </span>
                                      </div>
                                      <p className="text-gray-700 text-sm mt-1">{comment.content}</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                        
                        {/* Add Comment */}
                        <div className="mt-6">
                          <div className="flex gap-3">
                            {authState.user && (
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={authState.user.avatar} alt={authState.user.name} />
                                <AvatarFallback>{authState.user.name.substring(0, 2)}</AvatarFallback>
                              </Avatar>
                            )}
                            <div className="flex-1">
                              <Textarea
                                placeholder={authState.isAuthenticated ? "Add a comment..." : "Login to comment"}
                                value={commentText[post.id] || ""}
                                onChange={(e) => setCommentText(prev => ({ ...prev, [post.id]: e.target.value }))}
                                disabled={!authState.isAuthenticated}
                                className="min-h-[60px]"
                              />
                              <Button 
                                onClick={() => handleAddComment(post.id)}
                                className="mt-2 bg-clover-primary hover:bg-clover-dark"
                                size="sm"
                                disabled={!authState.isAuthenticated || !commentText[post.id]?.trim()}
                              >
                                Post Comment
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
                
                {posts.length === 0 && (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <MessageSquareIcon size={48} className="text-gray-300 mb-4" />
                      <p className="text-gray-500">No discussions yet. Be the first to start one!</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Community;
