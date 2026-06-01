import { createClient } from '@supabase/supabase-js';

// Pull the keys from .env.local file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables! Check your .env.local file.');
}
// Create and export the database connection
export const supabase = createClient(supabaseUrl, supabaseAnonKey);