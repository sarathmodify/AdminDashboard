import { createClient } from '@supabase/supabase-js';
import { CookieStorage } from './cookieStorage';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// Create custom cookie storage instance
const cookieStorage = new CookieStorage();

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        // Use secure cookie storage instead of localStorage
        storage: cookieStorage,

        // Cookie name for auth token
        storageKey: 'supabase-auth-token',

        // Persist session across page refreshes
        persistSession: true,

        // Automatically refresh the token before expiry
        autoRefreshToken: true,

        // Detect session from URL (OAuth redirects)
        detectSessionInUrl: true
    },
});
