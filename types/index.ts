export type User = {
  id: string;
  username: string;
  name: string;
  avatar: string;
  email: string;
};

export type Profile = {
  id: string;
  updated_at?: string | null;
  username?: string | null;
  full_name?: string | null;
  avatar_url?: string | null;
  email?: string | null;
  phone?: string | null;
  role?: "STUDENT" | "TEACHER" | "ADMIN" | string | null;
  institute_name?: string | null;
  class_level?: string | null;
  board?: "WBBSE" | "WBCHSE" | "OTHERS" | string | null;
  language_pref?: "en" | "bn" | string | null;
};
