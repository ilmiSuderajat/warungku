import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const WALLET_ID = '7607e1e1-3d3c-42cf-92de-8af63a2883ae';

async function payOrder(orderId) {
  const { data, error } = await supabase.rpc('pay_order', {
    p_wallet_id: WALLET_ID,
    p_amount: 20000,
    p_order_id: orderId
  });

  if (error) {
    console.log(`[${orderId}] GAGAL:`, error.message);
  } else {
    console.log(`[${orderId}] BERHASIL, saldo sekarang: ${data.balance}`);
  }
}

async function main() {
  // Kirim dua request BERSAMAAN, bukan satu-satu
  await Promise.all([
    payOrder('RACE-ORDER-A'),
    payOrder('RACE-ORDER-B')
  ]);

  // Cek saldo final setelah keduanya selesai
  const { data: wallet } = await supabase
    .from('wallets')
    .select('balance')
    .eq('id', WALLET_ID)
    .single();

  console.log('--- Saldo final:', wallet.balance);
}

main();