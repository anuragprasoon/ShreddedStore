import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client. Use the service role key in env for server APIs.
// Required env vars (add to your project .env):
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceRoleKey) {
  // Fail fast in development if env is missing
  console.warn('SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is not set. Product API will not work until configured.');
}

export const supabaseServer = createClient(supabaseUrl , supabaseServiceRoleKey , {
  auth: { persistSession: false },
});

export default supabaseServer;
