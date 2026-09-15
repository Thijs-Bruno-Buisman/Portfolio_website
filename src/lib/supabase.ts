import { createClient, type SupabaseClient, type User } from '@supabase/supabase-js';
import type { EvidenceItem, UserProfile } from '../types';
import { initialProfile } from '../data/initialData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

export const supabaseConfigurationError =
  !supabaseUrl || !supabaseAnonKey
    ? 'Supabase is niet ingesteld. Voeg VITE_SUPABASE_URL en VITE_SUPABASE_ANON_KEY toe en start de website daarna opnieuw.'
    : null;

export const supabase: SupabaseClient | null = supabaseConfigurationError
  ? null
  : createClient(supabaseUrl, supabaseAnonKey);

export type SupabaseUser = User;

function requireSupabase(): SupabaseClient {
  if (!supabase) {
    throw new Error(supabaseConfigurationError ?? 'Supabase is niet beschikbaar.');
  }
  return supabase;
}

type SubscriptionErrorHandler = (message: string) => void;

export function subscribeProfile(
  onProfileChange: (profile: UserProfile) => void,
  onError?: SubscriptionErrorHandler,
) {
  const client = requireSupabase();
  let active = true;
  const loadProfile = async () => {
    const { data, error } = await client.from('profiles').select('data').eq('id', 'main').maybeSingle();
    if (!active) return;
    if (error) {
      console.warn('Supabase profile read failed; local profile was preserved:', error.message);
      onError?.(`Profiel kon niet uit Supabase worden geladen: ${error.message}`);
      return;
    }
    onProfileChange(data?.data ? (data.data as UserProfile) : initialProfile);
  };

  void loadProfile();
  const channel = client
    .channel('portfolio-profile')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, loadProfile)
    .subscribe((status) => {
      if (status === 'CHANNEL_ERROR' && active) onError?.('De live verbinding voor het profiel kon niet worden gestart.');
    });

  return () => {
    active = false;
    void client.removeChannel(channel);
  };
}

export async function saveProfileToSupabase(profile: UserProfile) {
  const { error } = await requireSupabase()
    .from('profiles')
    .upsert({ id: 'main', data: profile, updated_at: new Date().toISOString() });
  if (error) throw error;
}

export function subscribeEvidence(
  onEvidenceChange: (items: EvidenceItem[]) => void,
  onError?: SubscriptionErrorHandler,
) {
  const client = requireSupabase();
  let active = true;
  const loadEvidence = async () => {
    const { data, error } = await client.from('evidence').select('id, data').order('created_at', { ascending: false });
    if (!active) return;
    if (error) {
      console.warn('Supabase evidence read failed; local evidence was preserved:', error.message);
      onError?.(`Bewijsstukken konden niet uit Supabase worden geladen: ${error.message}`);
      return;
    }
    onEvidenceChange((data ?? []).map((row) => ({ ...(row.data as EvidenceItem), id: row.id })));
  };

  void loadEvidence();
  const channel = client
    .channel('portfolio-evidence')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'evidence' }, loadEvidence)
    .subscribe((status) => {
      if (status === 'CHANNEL_ERROR' && active) onError?.('De live verbinding voor bewijsstukken kon niet worden gestart.');
    });

  return () => {
    active = false;
    void client.removeChannel(channel);
  };
}

export async function saveEvidenceToSupabase(item: EvidenceItem) {
  const { error } = await requireSupabase()
    .from('evidence')
    .upsert({ id: item.id, data: item, updated_at: new Date().toISOString() });
  if (error) throw error;
}

export async function deleteEvidenceFromSupabase(id: string) {
  const { error } = await requireSupabase().from('evidence').delete().eq('id', id);
  if (error) throw error;
}

export async function deleteAllEvidenceFromSupabase() {
  const { error } = await requireSupabase().from('evidence').delete().neq('id', '');
  if (error) throw error;
}

export async function loginWithGoogle(): Promise<void> {
  const { error } = await requireSupabase().auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  });
  if (error) throw error;
}

export async function logoutUser() {
  const { error } = await requireSupabase().auth.signOut();
  if (error) throw error;
}

export async function isPortfolioOwner(): Promise<boolean> {
  const { data, error } = await requireSupabase().rpc('is_portfolio_owner');
  if (error) throw error;
  return data === true;
}
