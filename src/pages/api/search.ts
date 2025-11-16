import type { NextApiRequest, NextApiResponse } from 'next';
import supabaseServer from '@/lib/supabaseServer';

// GET /api/search?q=tee&limit=20&offset=0
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { q, limit = '20', offset = '0' } = req.query;
    if (!q || String(q).trim().length === 0) {
      return res.status(400).json({ message: 'Missing search query (q)' });
    }

    const query = String(q).trim();
    const lim = Math.max(1, Math.min(100, parseInt(String(limit), 10) || 20));
    const off = Math.max(0, parseInt(String(offset), 10) || 0);
    const from = off;
    const to = off + lim - 1;

    // Basic ILIKE search over name and description
    const ilike = `%${query.replace(/%/g, '\\%')}%`;

    const { data, count, error } = await supabaseServer
      .from('Products')
      .select('*', { count: 'exact' })
      // search name, description and slog (your slug column)
      .or(`name.ilike.${ilike},description.ilike.${ilike},slog.ilike.${ilike}`)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Search error:', error);
      return res.status(500).json({ message: 'Error searching products' });
    }

    return res.status(200).json({ products: data ?? [], count: count ?? 0 });
  } catch (err) {
    console.error('Search API error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
