// pages/api/save-settings.js
import { ADMIN_EMAIL } from '../../lib/constants';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { data: { user } } = await supabase.auth.getUser(req.headers.cookie);
  if (!user || user.email !== ADMIN_EMAIL) return res.status(401).end();

  const { provider, model, system_prompt } = req.body || {};
  await supabase.from('settings').update({ provider, model, system_prompt }).eq('id', 1);
  res.status(200).end();
}
