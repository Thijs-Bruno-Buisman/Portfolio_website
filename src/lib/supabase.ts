import { createClient, User } from '@supabase/supabase-js';
import { UserProfile, EvidenceItem } from '../types';
import { initialProfile } from '../data/initialData';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env.');
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
);

export type SupabaseUser = User;

export function subscribeProfile(onProfileChange: (profile: UserProfile) => void) {
  let active = true;
  const loadProfile = async () => {
    const { data, error } = await supabase.from('profiles').select('data').eq('id', 'main').maybeSingle();
    if (!active) return;
    if (error) {
      console.warn('Supabase profile read failed; using local profile:', error.message);
      onProfileChange(initialProfile);
      return;
    }
    onProfileChange(data?.data ? data.data as UserProfile : initialProfile);
  };
  void loadProfile();
  const channel = supabase.channel('portfolio-profile').on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, loadProfile).subscribe();
  return () => { active = false; void supabase.removeChannel(channel); };
}

export async function saveProfileToSupabase(profile: UserProfile) {
  const { error } = await supabase.from('profiles').upsert({ id: 'main', data: profile });
  if (error) throw error;
}

export function subscribeEvidence(onEvidenceChange: (items: EvidenceItem[]) => void) {
  let active = true;
  const loadEvidence = async () => {
    const { data, error } = await supabase.from('evidence').select('id, data').order('created_at', { ascending: false });
    if (!active) return;
    if (error) {
      console.warn('Supabase evidence read failed; using local evidence:', error.message);
      onEvidenceChange([]);
      return;
    }
    onEvidenceChange((data ?? []).map((row) => ({ ...(row.data as EvidenceItem), id: row.id })));
  };
  void loadEvidence();
  const channel = supabase.channel('portfolio-evidence').on('postgres_changes', { event: '*', schema: 'public', table: 'evidence' }, loadEvidence).subscribe();
  return () => { active = false; void supabase.removeChannel(channel); };
}

export async function saveEvidenceToSupabase(item: EvidenceItem) {
  const { error } = await supabase.from('evidence').upsert({ id: item.id, data: item });
  if (error) throw error;
}

export async function deleteEvidenceFromSupabase(id: string) {
  const { error } = await supabase.from('evidence').delete().eq('id', id);
  if (error) throw error;
}

export async function loginWithGoogle(): Promise<User | null> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  });
  if (error) throw error;
  return null;
}

export async function logoutUser() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
