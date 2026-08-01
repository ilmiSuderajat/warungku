import { createClient} from '@/utils/supabase/server';
import { redirect } from 'next/navigation';

export default async function TransactionPage() {

    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    console.log(user);

    if (!user) {
        redirect('/login');
    }

    const { data: transactions, error } = await supabase
            .from("wallet_transactions")
            .select("*")
            .order("created_at", { ascending: false });
        
            console.log('transactions :', transactions, 'error :', error  );

    return(
        <>
            <div className="flex flex-col items-center justify-center min-h-screen py-2">
                <h1 className="text-2xl font-bold mb-4">Welcome {user ? user.email : ''}</h1>
                <h1>Transaksi Saya</h1>     
            <div className="mt-4">
                <table className="table-auto border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Description</th>
                            <th className="border border-gray-300 px-4 py-2">Amount</th>
                            <th className="border border-gray-300 px-4 py-2">Status</th>
                            <th className="border border-gray-300 px-4 py-2">reference_id</th>
                            <th className="border border-gray-300 px-4 py-2">Time</th>
                            <th className="border border-gray-300 px-4 py-2">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions?.map((tx) => (
                            <tr key={tx.id}>
                                <td className="border border-gray-300 px-4 py-2">{tx.type}</td>
                                <td className="border border-gray-300 px-4 py-2">Rp. {tx.amount.toLocaleString('id-ID')}</td>
                                <td className="border border-gray-300 px-4 py-2">{tx.status}</td>
                                <td className="border border-gray-300 px-4 py-2">{tx.reference_id}</td>
                                <td className="border border-gray-300 px-4 py-2">{new Date(tx.created_at).toLocaleTimeString('id-ID')}</td>
                                <td className="border border-gray-300 px-4 py-2">{new Date(tx.created_at).toLocaleDateString('id-ID')}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            </div>
        </>
    )
}