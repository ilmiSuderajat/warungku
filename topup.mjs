import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function main() {
  const { data, error } = await supabase.rpc('topup_wallet', {
    p_wallet_id: '7607e1e1-3d3c-42cf-92de-8af63a2883ae', // wallet id kamu tadi
    p_amount: 25000,
    p_reference_id: 'TEST-TOPUP-001'
  });

  if (error) {
    console.error('Error:', error);
    return;
  }

  console.log(JSON.stringify(data, null, 2));
}

main();