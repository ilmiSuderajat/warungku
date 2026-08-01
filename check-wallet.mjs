import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function main () {

    const { data, error } = await supabase
    .from('wallets')
    .select('*');

    if (error) {
        console.error('Error fetching wallet data:', error);
        return;
    }

    console.log(JSON.stringify(data, null, 2));

}

main();