import type { NextApiRequest, NextApiResponse } from 'next';
import supabaseServer from '@/lib/supabaseServer';

interface CouponRow {
  id: string;
  coupon: string;
  discount: number;
  is_active: boolean;
}

type Resp =
  | { valid: true; coupon: string; discount: number }
  | { valid: false; message: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Resp>) {
  try {
    let code: string | undefined;

    if (req.method === 'GET') {
      const q = req.query.code;
      if (!q || Array.isArray(q)) return res.status(400).json({ valid: false, message: 'Missing coupon code' });
      code = String(q).trim();
    } else if (req.method === 'POST') {
      const body = req.body as Record<string, unknown>;
      const bodyCoupon = body?.coupon;
      if (!bodyCoupon || typeof bodyCoupon !== 'string') return res.status(400).json({ valid: false, message: 'Missing coupon code' });
      code = bodyCoupon.trim();
    } else {
      return res.status(405).json({ valid: false, message: 'Method not allowed' });
    }

    // case-insensitive exact match
    const { data, error } = await supabaseServer
      .from('Coupons')
      .select('id,coupon,discount,is_active')
      .ilike('coupon', code)
      .limit(1);

    if (error) {
      console.error('Supabase error fetching coupon', error);
      return res.status(500).json({ valid: false, message: 'Server error' });
    }

    if (!data || data.length === 0) return res.status(200).json({ valid: false, message: 'Invalid coupon' });

    const row = data[0] as CouponRow;
    if (!row.is_active) return res.status(200).json({ valid: false, message: 'Coupon is inactive' });

    return res.status(200).json({ valid: true, coupon: row.coupon, discount: Number(row.discount) });
  } catch (err) {
    console.error('Coupon validation error', err);
    return res.status(500).json({ valid: false, message: 'Unexpected server error' });
  }
}
