import type { NextApiRequest, NextApiResponse } from 'next';
import supabaseServer from '@/lib/supabaseServer';

// GET /api/categories/:id/products?limit=20&offset=0
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    const { limit = '20', offset = '0' } = req.query;
    if (!id) return res.status(400).json({ message: 'Missing category id' });

    const lim = Math.max(1, Math.min(100, parseInt(String(limit), 10) || 20));
    const off = Math.max(0, parseInt(String(offset), 10) || 0);
    const from = off;
    const to = off + lim - 1;

    const { data, count, error } = await supabaseServer
      .from('Products')
      .select('*', { count: 'exact' })
      .eq('category', id)
      .order('created_at', { ascending: false })
      .range(from, to);

    if (error) {
      console.error('Error fetching category products:', error);
      return res.status(500).json({ message: 'Error fetching products' });
    }

    return res.status(200).json({ products: data ?? [], count: count ?? 0 });
  } catch (err) {
    console.error('Category products API error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
