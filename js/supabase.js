const darkbookSupabase = (() => {
  const env = window.DARKBOOK_ENV || {};
  const url = env.supabaseUrl || '';
  const anonKey = env.supabaseAnonKey || '';

  let client = null;

  if (window.supabase && url && anonKey) {
    client = window.supabase.createClient(url, anonKey, {
      auth: { persistSession: true, autoRefreshToken: true }
    });
  }

  async function safeCall(fn, fallback) {
    try {
      if (!client || !fn) return fallback;
      return await fn();
    } catch (error) {
      console.warn('[darkbookSupabase]', error.message || error);
      return fallback;
    }
  }

  return {
    isReady: () => Boolean(client),
    getClient: () => client,
    async getSession() {
      return safeCall(() => client.auth.getSession(), { data: { session: null } });
    },
    async signUp({ email, password, username, full_name }) {
      return safeCall(
        () =>
          client.auth.signUp({
            email,
            password,
            options: {
              data: {
                username,
                name: full_name
              }
            }
          }),
        { data: { user: null }, error: null }
      );
    },
    async signIn({ email, password }) {
      return safeCall(
        () => client.auth.signInWithPassword({ email, password }),
        { data: { user: null }, error: null }
      );
    },
    async signOut() {
      return safeCall(() => client.auth.signOut(), { error: null });
    },
    async upsertProfile(profile) {
      return safeCall(
        async () => {
          const { data, error } = await client.from('profiles').upsert(profile).select();
          if (error) throw error;
          return { data, error: null };
        },
        { data: [], error: null }
      );
    },
    async getProfile(id) {
      return safeCall(
        async () => {
          const { data, error } = await client.from('profiles').select('*').eq('id', id).single();
          if (error) throw error;
          return { data, error: null };
        },
        { data: null, error: null }
      );
    }
  };
})();

window.darkbookSupabase = darkbookSupabase;
