// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zpnoanzthieyqjwkvelw.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpwbm9hbnp0aGlleXFqd2t2ZWx3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzMzU4MTksImV4cCI6MjA2NDkxMTgxOX0.7q6yjspLZAvI3kxEGkmkekK3SByKbln9C3Qv51sADME";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);