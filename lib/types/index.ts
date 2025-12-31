/**
 * Shared TypeScript Types and Interfaces
 * 
 * Centralized type definitions for the entire application.
 * These types ensure type safety across components, API routes, and database operations.
 * 
 * All types are exported and can be imported where needed:
 * import { Event, Game, TeamMember } from '@/lib/types';
 */

export interface Event {
  id: string;
  title: string;
  description?: string | null;
  date: string;
  time?: string | null;
  location?: string | null;
  type: 'game' | 'tournament' | 'training' | 'event' | 'other';
  teams?: string | null;
  image_url?: string | null;
  registration_link?: string | null;
  status: 'upcoming' | 'completed' | 'cancelled';
  featured: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Game {
  id: string;
  home_team: string;
  away_team: string;
  home_score: number;
  away_score: number;
  quarter: number;
  overtime: number;
  game_mode: 'basic' | 'stats' | 'full';
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  game_date: string;
  location?: string | null;
  notes?: string | null;
  created_by?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface GameEvent {
  id: string;
  game_id: string;
  player_id?: string | null;
  player_name: string;
  player_jersey?: number | null;
  team: 'home' | 'away';
  event_type: string;
  points: number;
  quarter: number;
  game_time?: string | null;
  details?: string | null;
  created_at?: string;
}

export interface QuarterScore {
  id: string;
  game_id: string;
  quarter: number;
  home_score: number;
  away_score: number;
  created_at?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  section: 'executive' | 'coach' | 'maintenance' | 'stakeholder' | 'media';
  image_url?: string | null;
  bio?: string | null;
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export interface BasketballTeam {
  id: string;
  name: string;
  category: 'madina' | 'accra' | 'other';
  created_at?: string;
}

export interface Content {
  id: string;
  key: string;
  value: string;
  type: 'text' | 'html' | 'json';
  updated_at?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  created_at?: string;
}

export type ApiResponse<T> = {
  data?: T;
  error?: string;
  code?: string;
};

