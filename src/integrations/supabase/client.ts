// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://ovaieeaoutnpzpbiwhnb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im92YWllZWFvdXRucHpwYml3aG5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTEwMTgwNzIsImV4cCI6MjA2NjU5NDA3Mn0.ZsHBsxkPfnREPzSKPO_ILp9FtWZDSFsl4UlR62HOPwc";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);