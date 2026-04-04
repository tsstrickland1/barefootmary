export type Visibility = "public" | "subscriber" | "patron";
export type SubmissionStatus = "pending" | "reviewed" | "accepted" | "declined";
export type ArticleTag = "essay" | "primary-source" | "interview" | "reading-list" | "research-note" | "analysis" | "deep-dive";
export type ArchiveType = "pdf" | "image" | "audio" | "transcript";

export interface Season {
  id: string;
  slug: string;
  number: number;
  title: string;
  subtitle: string;
  description: string;
  numeral: string;
  status: "upcoming" | "airing" | "complete";
  created_at: string;
}

export interface Episode {
  id: string;
  season_id: string;
  slug: string;
  number: number;
  title: string;
  description: string;
  show_notes_json: Record<string, unknown> | null;
  duration: string;
  audio_url: string | null;
  peaks_json_url: string | null;
  visibility: Visibility;
  published_at: string | null;
  created_at: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  body_json: Record<string, unknown> | null;
  tag: ArticleTag;
  visibility: Visibility;
  author: string;
  featured: boolean;
  published_at: string | null;
  created_at: string;
}

export interface ArchiveItem {
  id: string;
  episode_id: string | null;
  season_id: string | null;
  title: string;
  description: string | null;
  type: ArchiveType;
  file_path: string;
  visibility: Visibility;
  created_at: string;
}

export interface Submission {
  id: string;
  name: string;
  email: string | null;
  description: string;
  file_path: string | null;
  status: SubmissionStatus;
  created_at: string;
}

export interface Subscriber {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  plan: "free" | "descender" | "patron";
  status: "active" | "canceled" | "past_due";
  current_period_end: string;
  created_at: string;
}
