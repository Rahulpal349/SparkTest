const SUPABASE_URL = "https://dkmylpgzgrxsmhtwqthz.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ENt144rghuXe7mU-_Jq6uQ_SJkDPySs";

// Initialize the Supabase client
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log("Supabase initialized for Test Platform");
