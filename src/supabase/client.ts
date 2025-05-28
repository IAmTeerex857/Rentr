import { createClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

export const supabaseUrl = "https://wcxzcusgdnlerhwbiucc.supabase.co";
export const supabaseAnonKey =
	"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjeHpjdXNnZG5sZXJod2JpdWNjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg0NjE5NTQsImV4cCI6MjA2NDAzNzk1NH0.cFsmGeryWUqpS819XH82uY3ThjifYPkxxdi7N7xS60Q";

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
