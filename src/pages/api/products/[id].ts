import type { NextApiRequest, NextApiResponse } from 'next';
import supabaseServer from '@/lib/supabaseServer';

// GET /api/products/:id  (id can be UUID or slug)
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { id } = req.query;
    if (!id || Array.isArray(id)) {
      return res.status(400).json({ message: 'Missing product id' });
    }

    const identifier = String(id);

    // If identifier is a number, try by numeric id (bigint identity). Otherwise try slog.
    let data = null;
    let error = null;

    const possibleId = Number(identifier);
    if (!Number.isNaN(possibleId)) {
      const r = await supabaseServer.from('Products').select('*').eq('id', possibleId).maybeSingle();
      data = r.data;
      error = r.error;
    }

    if (!data) {
      // try slog (text slug column named `slog` in your schema)
      const r2 = await supabaseServer.from('Products').select('*').eq('slog', identifier).maybeSingle();
      data = r2.data;
      error = r2.error;
    }

    if (error) {
      console.error('Supabase error fetching product:', error);
      return res.status(500).json({ message: 'Error fetching product' });
    }

    if (!data) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ product: data });
  } catch (err) {
    console.error('Product detail API error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
