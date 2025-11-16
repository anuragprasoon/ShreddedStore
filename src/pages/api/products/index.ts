import type { NextApiRequest, NextApiResponse } from 'next';
import supabaseServer from '@/lib/supabaseServer';

// GET /api/products?limit=20&offset=0&category=Top%20wear&active=true
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { limit = '20', offset = '0', category, active } = req.query;
    const lim = Math.max(1, Math.min(100, parseInt(String(limit), 10) || 20));
    const off = Math.max(0, parseInt(String(offset), 10) || 0);

  // Note: your table is named "Products" (case-sensitive schema); select from it.
  let query = supabaseServer.from('Products').select('*', { count: 'exact' });

    if (category) {
      query = query.eq('category', String(category));
    }

    if (active !== undefined) {
      const isActive = String(active).toLowerCase() === 'true';
      query = query.eq('is_active', isActive);
    }

    // Range uses 0-based indices
    const from = off;
    const to = off + lim - 1;

  const { data, count, error } = await query.range(from, to).order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase error fetching products:', error);
      return res.status(500).json({ message: 'Error fetching products' });
    }

    return res.status(200).json({ products: data ?? [], count: count ?? 0 });
  } catch (err) {
    console.error('Products API error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
