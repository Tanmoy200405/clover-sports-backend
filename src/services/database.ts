
import { User, Activity, Team, Post, Comment, Achievement, Leaderboard } from '../models/types';
import { v4 as uuidv4 } from 'uuid';

// Mock database storage
class Database {
  private users: User[] = [];
  private activities: Activity[] = [];
  private teams: Team[] = [];
  private posts: Post[] = [];
  private achievements: Achievement[] = [];
  private leaderboards: Leaderboard[] = [];

  // User methods
  async getUsers(): Promise<User[]> {
    return this.users;
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async createUser(userData: Omit<User, 'id' | 'joinedDate'>): Promise<User> {
    const newUser: User = {
      id: uuidv4(),
      joinedDate: new Date(),
      eventsAttended: [],
      eventsHosted: [],
      teams: [],
      achievements: [],
      ...userData
    };
    this.users.push(newUser);
    return newUser;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User | undefined> {
    const index = this.users.findIndex(user => user.id === id);
    if (index !== -1) {
      this.users[index] = { ...this.users[index], ...userData };
      return this.users[index];
    }
    return undefined;
  }

  // Activity methods
  async getActivities(): Promise<Activity[]> {
    return this.activities;
  }

  async getActivityById(id: string): Promise<Activity | undefined> {
    return this.activities.find(activity => activity.id === id);
  }

  async createActivity(activityData: Omit<Activity, 'id'>): Promise<Activity> {
    const newActivity: Activity = {
      id: uuidv4(),
      ...activityData
    };
    this.activities.push(newActivity);
    
    // Update host's eventsHosted array
    const host = await this.getUserById(activityData.hostId);
    if (host) {
      await this.updateUser(host.id, { 
        eventsHosted: [...(host.eventsHosted || []), newActivity.id] 
      });
    }
    
    return newActivity;
  }

  async updateActivity(id: string, activityData: Partial<Activity>): Promise<Activity | undefined> {
    const index = this.activities.findIndex(activity => activity.id === id);
    if (index !== -1) {
      this.activities[index] = { ...this.activities[index], ...activityData };
      return this.activities[index];
    }
    return undefined;
  }

  async joinActivity(activityId: string, userId: string): Promise<Activity | undefined> {
    const activity = await this.getActivityById(activityId);
    const user = await this.getUserById(userId);
    
    if (!activity || !user) return undefined;
    
    if (activity.maxParticipants && activity.participants.length >= activity.maxParticipants) {
      throw new Error("Activity is full");
    }
    
    if (!activity.participants.includes(userId)) {
      activity.participants.push(userId);
      await this.updateActivity(activityId, { participants: activity.participants });
      
      // Update user's eventsAttended array
      await this.updateUser(userId, { 
        eventsAttended: [...(user.eventsAttended || []), activityId] 
      });
    }
    
    return activity;
  }

  // Team methods
  async getTeams(): Promise<Team[]> {
    return this.teams;
  }

  async getTeamById(id: string): Promise<Team | undefined> {
    return this.teams.find(team => team.id === id);
  }

  async createTeam(teamData: Omit<Team, 'id'>): Promise<Team> {
    const newTeam: Team = {
      id: uuidv4(),
      ...teamData
    };
    this.teams.push(newTeam);
    
    // Update team members' teams array
    for (const memberId of newTeam.members) {
      const member = await this.getUserById(memberId);
      if (member) {
        await this.updateUser(memberId, { 
          teams: [...(member.teams || []), newTeam.id] 
        });
      }
    }
    
    return newTeam;
  }

  async updateTeam(id: string, teamData: Partial<Team>): Promise<Team | undefined> {
    const index = this.teams.findIndex(team => team.id === id);
    if (index !== -1) {
      this.teams[index] = { ...this.teams[index], ...teamData };
      return this.teams[index];
    }
    return undefined;
  }

  async joinTeam(teamId: string, userId: string): Promise<Team | undefined> {
    const team = await this.getTeamById(teamId);
    const user = await this.getUserById(userId);
    
    if (!team || !user) return undefined;
    
    if (!team.members.includes(userId)) {
      team.members.push(userId);
      await this.updateTeam(teamId, { members: team.members });
      
      // Update user's teams array
      await this.updateUser(userId, { 
        teams: [...(user.teams || []), teamId] 
      });
    }
    
    return team;
  }

  // Post methods
  async getPosts(): Promise<Post[]> {
    return this.posts;
  }

  async getPostById(id: string): Promise<Post | undefined> {
    return this.posts.find(post => post.id === id);
  }

  async createPost(postData: Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments'>): Promise<Post> {
    const newPost: Post = {
      id: uuidv4(),
      createdAt: new Date(),
      likes: [],
      comments: [],
      ...postData
    };
    this.posts.push(newPost);
    return newPost;
  }

  async updatePost(id: string, postData: Partial<Post>): Promise<Post | undefined> {
    const index = this.posts.findIndex(post => post.id === id);
    if (index !== -1) {
      this.posts[index] = { 
        ...this.posts[index], 
        ...postData,
        updatedAt: new Date()
      };
      return this.posts[index];
    }
    return undefined;
  }

  async addComment(postId: string, comment: Omit<Comment, 'id' | 'createdAt' | 'likes'>): Promise<Post | undefined> {
    const post = await this.getPostById(postId);
    if (!post) return undefined;
    
    const newComment: Comment = {
      id: uuidv4(),
      createdAt: new Date(),
      likes: [],
      ...comment
    };
    
    post.comments.push(newComment);
    return this.updatePost(postId, { comments: post.comments });
  }

  // Achievement methods
  async getAchievements(): Promise<Achievement[]> {
    return this.achievements;
  }

  async createAchievement(achievementData: Omit<Achievement, 'id'>): Promise<Achievement> {
    const newAchievement: Achievement = {
      id: uuidv4(),
      ...achievementData
    };
    this.achievements.push(newAchievement);
    return newAchievement;
  }

  async awardAchievement(userId: string, achievementId: string): Promise<User | undefined> {
    const user = await this.getUserById(userId);
    const achievement = this.achievements.find(a => a.id === achievementId);
    
    if (!user || !achievement) return undefined;
    
    const userAchievements = user.achievements || [];
    if (!userAchievements.some(a => a.id === achievementId)) {
      userAchievements.push(achievement);
      return this.updateUser(userId, { achievements: userAchievements });
    }
    
    return user;
  }

  // Leaderboard methods
  async getLeaderboards(): Promise<Leaderboard[]> {
    return this.leaderboards;
  }

  async getLeaderboardById(id: string): Promise<Leaderboard | undefined> {
    return this.leaderboards.find(leaderboard => leaderboard.id === id);
  }

  async createLeaderboard(leaderboardData: Omit<Leaderboard, 'id'>): Promise<Leaderboard> {
    const newLeaderboard: Leaderboard = {
      id: uuidv4(),
      ...leaderboardData
    };
    this.leaderboards.push(newLeaderboard);
    return newLeaderboard;
  }

  async updateLeaderboard(id: string, leaderboardData: Partial<Leaderboard>): Promise<Leaderboard | undefined> {
    const index = this.leaderboards.findIndex(leaderboard => leaderboard.id === id);
    if (index !== -1) {
      this.leaderboards[index] = { ...this.leaderboards[index], ...leaderboardData };
      return this.leaderboards[index];
    }
    return undefined;
  }

  // Initialize database with mock data
  async seed(): Promise<void> {
    // Create users
    const user1 = await this.createUser({
      name: "Tanmoy Roy",
      email: "tanmoy@clover.com",
      avatar: "https://i.pravatar.cc/150?u=tanmoy",
      location: "Kolkata",
      bio: "Sports enthusiast and community organizer",
      favoriteActivities: ["Cricket", "Football", "Chess", "Running"]
    });
    
    const user2 = await this.createUser({
      name: "Rahul Sharma",
      email: "rahul@clover.com",
      avatar: "https://i.pravatar.cc/150?u=rahul",
      location: "Mumbai",
      bio: "Professional cricket player and coach",
      favoriteActivities: ["Cricket", "Swimming", "Badminton"]
    });
    
    const user3 = await this.createUser({
      name: "Priya Patel",
      email: "priya@clover.com",
      avatar: "https://i.pravatar.cc/150?u=priya",
      location: "Delhi",
      bio: "Yoga instructor and amateur footballer",
      favoriteActivities: ["Yoga", "Football", "Chess", "Hiking"]
    });
    
    const user4 = await this.createUser({
      name: "Amit Kumar",
      email: "amit@clover.com",
      avatar: "https://i.pravatar.cc/150?u=amit",
      location: "Bangalore",
      bio: "Chess champion and badminton enthusiast",
      favoriteActivities: ["Chess", "Badminton"]
    });
    
    // Create activities
    await this.createActivity({
      title: "Weekend Cricket Match",
      description: "Friendly cricket match at the local park. All skill levels welcome!",
      category: "Cricket",
      location: "Salt Lake Stadium, Kolkata",
      date: new Date(2025, 4, 15),
      time: "10:00 AM",
      duration: 3,
      hostId: user1.id,
      participants: [user1.id, user2.id],
      maxParticipants: 22,
      image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      status: "upcoming"
    });
    
    await this.createActivity({
      title: "Yoga in the Park",
      description: "Morning yoga session in the community park. Bring your own mat.",
      category: "Yoga",
      location: "Central Park, Kolkata",
      date: new Date(2025, 4, 12),
      time: "7:00 AM",
      duration: 1,
      hostId: user3.id,
      participants: [user3.id],
      maxParticipants: 15,
      image: "https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      status: "upcoming"
    });
    
    // Add new sports activities
    await this.createActivity({
      title: "Football Tournament",
      description: "5-a-side football tournament for all ages. Form a team or join individually.",
      category: "Football",
      location: "DLF Sports Complex, Delhi",
      date: new Date(2025, 4, 20),
      time: "3:00 PM",
      duration: 4,
      hostId: user3.id,
      participants: [user1.id, user3.id],
      maxParticipants: 30,
      image: "https://images.unsplash.com/photo-1600679472829-3044539ce8ed?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      status: "upcoming"
    });
    
    await this.createActivity({
      title: "Chess Club Meeting",
      description: "Weekly chess club meeting. Players of all levels welcome.",
      category: "Chess",
      location: "Gariahat Chess Club, Kolkata",
      date: new Date(2025, 4, 14),
      time: "6:00 PM",
      duration: 2,
      hostId: user4.id,
      participants: [user1.id, user3.id, user4.id],
      maxParticipants: 12,
      image: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      status: "upcoming"
    });
    
    await this.createActivity({
      title: "Badminton Doubles Tournament",
      description: "Join our monthly badminton doubles tournament with great prizes.",
      category: "Badminton",
      location: "Prakash Padukone Badminton Academy, Bangalore",
      date: new Date(2025, 4, 18),
      time: "2:00 PM",
      duration: 5,
      hostId: user2.id,
      participants: [user2.id, user4.id],
      maxParticipants: 16,
      image: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      status: "upcoming"
    });
    
    // Create teams
    await this.createTeam({
      name: "Kolkata Tigers",
      description: "Local cricket team for friendly matches",
      sport: "Cricket",
      captainId: user1.id,
      members: [user1.id, user2.id],
      location: "Kolkata",
      foundedDate: new Date(2024, 1, 10),
      logo: "https://images.unsplash.com/photo-1546519638-68e109acd618?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      upcomingEvents: []
    });
    
    // Add new sports teams
    await this.createTeam({
      name: "Delhi Dragons FC",
      description: "Community football club focusing on youth development",
      sport: "Football",
      captainId: user3.id,
      members: [user1.id, user3.id],
      location: "Delhi",
      foundedDate: new Date(2024, 2, 5),
      logo: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      upcomingEvents: []
    });
    
    await this.createTeam({
      name: "Bangalore Knights",
      description: "Competitive chess team participating in national tournaments",
      sport: "Chess",
      captainId: user4.id,
      members: [user3.id, user4.id],
      location: "Bangalore",
      foundedDate: new Date(2024, 1, 20),
      logo: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      upcomingEvents: []
    });
    
    await this.createTeam({
      name: "Mumbai Smashers",
      description: "Badminton team for all ages and skill levels",
      sport: "Badminton",
      captainId: user2.id,
      members: [user2.id, user4.id],
      location: "Mumbai",
      foundedDate: new Date(2024, 3, 15),
      logo: "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
      upcomingEvents: []
    });
    
    // Create posts
    await this.createPost({
      title: "Tips for Beginners in Cricket",
      content: "If you're just starting out in cricket, here are some tips that helped me improve my game quickly...",
      authorId: user2.id,
      category: "Cricket",
      tags: ["beginner", "tips", "cricket"]
    });
    
    await this.createPost({
      title: "Looking for Football Players",
      content: "We're forming a new football team in Kolkata. If you're interested in joining, please comment below!",
      authorId: user1.id,
      category: "Football",
      tags: ["recruitment", "football", "team"]
    });
    
    // Add new sport posts
    await this.createPost({
      title: "Chess Opening Strategies",
      content: "Master these three chess openings to improve your win rate dramatically...",
      authorId: user4.id,
      category: "Chess",
      tags: ["strategy", "chess", "openings"]
    });
    
    await this.createPost({
      title: "Badminton Footwork Techniques",
      content: "Good footwork is the foundation of badminton. Here's how to improve yours...",
      authorId: user2.id,
      category: "Badminton",
      tags: ["technique", "badminton", "footwork"]
    });
    
    // Create achievements
    await this.createAchievement({
      title: "Team Creator",
      description: "Created your first team",
      icon: "trophy",
      dateEarned: new Date(),
      category: "General"
    });
    
    await this.createAchievement({
      title: "Event Organizer",
      description: "Organized your first sporting event",
      icon: "calendar",
      dateEarned: new Date(),
      category: "General"
    });
    
    // Create leaderboards
    await this.createLeaderboard({
      title: "Cricket Runs - Monthly",
      sport: "Cricket",
      period: "monthly",
      entries: [
        { userId: user1.id, score: 120, rank: 2 },
        { userId: user2.id, score: 156, rank: 1 }
      ]
    });
    
    // Add new sport leaderboards
    await this.createLeaderboard({
      title: "Football Goals - Weekly",
      sport: "Football",
      period: "weekly",
      entries: [
        { userId: user1.id, score: 5, rank: 2 },
        { userId: user3.id, score: 7, rank: 1 }
      ]
    });
    
    await this.createLeaderboard({
      title: "Chess Tournament Rankings",
      sport: "Chess",
      period: "monthly",
      entries: [
        { userId: user3.id, score: 1800, rank: 2 },
        { userId: user4.id, score: 2100, rank: 1 }
      ]
    });
    
    await this.createLeaderboard({
      title: "Badminton Championships",
      sport: "Badminton",
      period: "yearly",
      entries: [
        { userId: user2.id, score: 320, rank: 1 },
        { userId: user4.id, score: 280, rank: 2 }
      ]
    });
  }
}

export const db = new Database();
// Seed the database
db.seed().catch(console.error);
