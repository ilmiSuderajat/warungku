import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const WALLET_ID = '7607e1e1-3d3c-42cf-92de-8af63a2883ae';

async function main() {
  // 1. Login dulu - ganti dengan email/password user yang kamu buat di Authentication
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'testes@gmail.com',
    password: 'monyet'
  });

  if (authError) {
    console.error('Login gagal:', authError.message);
    return;
  }

  console.log('Login berhasil, user id:', authData.user.id);

  // 2. Sekarang panggil RPC - supabase client otomatis menyertakan token dari sesi login di atas
  const { data, error } = await supabase.rpc('pay_order', {
    p_wallet_id: WALLET_ID,
    p_amount: 5000,
    p_order_id: 'RLS-TEST-001'
  });

  if (error) {
    console.error('pay_order gagal:', error.message);
    return;
  }

  console.log('pay_order berhasil:', JSON.stringify(data, null, 2));
}

main();