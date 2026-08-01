import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const WALLET_ID = '7607e1e1-3d3c-42cf-92de-8af63a2883ae';
const STARTING_BALANCE = 25000;
const JUMLAH_PERCOBAAN = 100;

async function resetBalance() {
  await supabase
    .from('wallets')
    .update({ balance: STARTING_BALANCE })
    .eq('id', WALLET_ID);
}

async function payOrderUnsafe(orderId) {
  const { data, error } = await supabase.rpc('pay_order_unsafe_nosleep', {
    p_wallet_id: WALLET_ID,
    p_amount: 20000,
    p_order_id: orderId
  });
  return { orderId, success: !error, balance: data?.balance, errorMsg: error?.message };
}

async function main() {
  let jumlahAnomali = 0;

  for (let i = 1; i <= JUMLAH_PERCOBAAN; i++) {
    await resetBalance();

    const [hasilA, hasilB] = await Promise.all([
      payOrderUnsafe(`LOOP-${i}-A`),
      payOrderUnsafe(`LOOP-${i}-B`)
    ]);

    const { data: walletAkhir } = await supabase
      .from('wallets')
      .select('balance')
      .eq('id', WALLET_ID)
      .single();

    const jumlahBerhasil = [hasilA, hasilB].filter(h => h.success).length;
    const anomali = jumlahBerhasil === 2; // dua-duanya lolos padahal seharusnya cuma 1

    if (anomali) jumlahAnomali++;

    console.log(
      `Percobaan ${i}: A=${hasilA.success ? 'OK' : 'GAGAL'} B=${hasilB.success ? 'OK' : 'GAGAL'} | saldo akhir=${walletAkhir.balance} ${anomali ? '⚠️ ANOMALI' : ''}`
    );
  }

  console.log(`\n--- Total anomali: ${jumlahAnomali} dari ${JUMLAH_PERCOBAAN} percobaan`);
}

main();