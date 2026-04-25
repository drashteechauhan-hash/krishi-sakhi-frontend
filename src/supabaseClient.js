// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cslevgqtojhxlqervahi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNzbGV2Z3F0b2poeGxxZXJ2YWhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzOTYxMDQsImV4cCI6MjA5MTk3MjEwNH0.eGblh70fgfGTBPMLEM3_aJ-5aZ-_874oNhDhqLlSyb4'; // Supabase → Settings → API → anon public

export const supabase = createClient(supabaseUrl, supabaseAnonKey);