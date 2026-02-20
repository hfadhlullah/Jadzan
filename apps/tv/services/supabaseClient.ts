import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnon = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnon) {
    console.error("Missing Supabase environment variables! Check your .env file or EAS secrets.");
}

export const supabase = createClient(supabaseUrl || '', supabaseAnon || '');
