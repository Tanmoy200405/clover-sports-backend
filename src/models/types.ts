
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  location?: string;
  joinedDate: Date;
  bio?: string;
  favoriteActivities?: string[];
  teams?: string[];
  eventsAttended?: string[];
  eventsHosted?: string[];
  achievements?: Achievement[];
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  date: Date;
  time: string;
  duration: number;
  hostId: string;
  participants: string[];
  maxParticipants?: number;
  image?: string;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
}

export interface Team {
  id: string;
  name: string;
  description: string;
  sport: string;
  captainId: string;
  members: string[];
  location: string;
  foundedDate: Date;
  logo?: string;
  achievements?: Achievement[];
  upcomingEvents?: string[];
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt?: Date;
  category: string;
  tags?: string[];
  likes: string[];
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  createdAt: Date;
  updatedAt?: Date;
  likes: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  dateEarned: Date;
  category: string;
}

export interface Leaderboard {
  id: string;
  title: string;
  sport: string;
  period: "weekly" | "monthly" | "yearly" | "allTime";
  entries: LeaderboardEntry[];
}

export interface LeaderboardEntry {
  userId: string;
  score: number;
  rank: number;
}
