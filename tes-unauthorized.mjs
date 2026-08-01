import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// Wallet KEDUA, milik user LAIN (bukan yang login)
const WALLET_ID_ORANG_LAIN = '7806d852-12b1-4350-b13b-7754daaeb140';

async function main() {
  // Login TETAP sebagai user pertama (054a6f4a-...)
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'testes@gmail.com',
    password: 'monyet'
  });

  if (authError) {
    console.error('Login gagal:', authError.message);
    return;
  }

  console.log('Login sebagai:', authData.user.id);

  // Coba bayar pakai wallet ORANG LAIN
  const { data, error } = await supabase.rpc('pay_order', {
    p_wallet_id: WALLET_ID_ORANG_LAIN,
    p_amount: 5000,
    p_order_id: 'HACK-ATTEMPT-001'
  });

  if (error) {
    console.log('Ditolak (seharusnya begini):', error.message);
  } else {
    console.log('BERBAHAYA - berhasil akses wallet orang lain:', data);
  }
}

main();