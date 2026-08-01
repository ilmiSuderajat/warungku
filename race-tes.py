import os
import concurrent.futures
import threading
from typing import TypedDict, cast
from dotenv import load_dotenv
from supabase import create_client, Client


load_dotenv('.env.local')  # Memuat variabel lingkungan dari file .env.local
# Konfigurasi Supabase dari environment variables
# Pastikan Anda telah mengatur variabel lingkungan ini di sistem/terminal Anda
SUPABASE_URL = os.environ.get("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.environ.get("NEXT_PUBLIC_SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("URL dan Key Supabase belum diset di environment variables.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

WALLET_ID = '7607e1e1-3d3c-42cf-92de-8af63a2883ae'
STARTING_BALANCE = 25000
JUMLAH_PERCOBAAN = 10

class PayOrderResult(TypedDict):
    orderId: str
    success: bool
    balance: object | None
    errorMsg: str | None


def reset_balance() -> None:
    supabase.table('wallets').update({'balance': STARTING_BALANCE}).eq('id', WALLET_ID).execute()
    
start_barrier = threading.Barrier(2)

def pay_order_unsafe(order_id: str) -> PayOrderResult:
    try:
        # TAHAN KEDUA THREAD DI SINI
        # Mereka akan menunggu sampai 2 thread memanggil wait()
        start_barrier.wait() 
        
        # Eksekusi tepat bersamaan!
        response = supabase.rpc('pay_order_unsafe_nosleep', {
            'p_wallet_id': WALLET_ID,
            'p_amount': 20000,
            'p_order_id': order_id
        }).execute()
        
        response_data = response.data
        if isinstance(response_data, dict):
            balance = cast(dict[str, object], response_data).get('balance')
        else:
            balance = response_data
        return {'orderId': order_id, 'success': True, 'balance': balance, 'errorMsg': None}
    except Exception as e:
        return {'orderId': order_id, 'success': False, 'balance': None, 'errorMsg': str(e)}

def main() -> None:
    jumlah_anomali = 0

    for i in range(1, JUMLAH_PERCOBAAN + 1):
        reset_balance()

        order_a = f"LOOP-{i}-A"
        order_b = f"LOOP-{i}-B"

        # Menggunakan 2 worker thread untuk menembak API secara bersamaan
        with concurrent.futures.ThreadPoolExecutor(max_workers=2) as executor:
            future_a = executor.submit(pay_order_unsafe, order_a)
            future_b = executor.submit(pay_order_unsafe, order_b)

            # Tunggu hingga kedua thread selesai (ekuivalen dengan await Promise.all)
            hasil_a = future_a.result()
            hasil_b = future_b.result()

        # Ambil saldo akhir dari database
        wallet_akhir_response = supabase.table('wallets').select('balance').eq('id', WALLET_ID).execute()
        
        # Ambil data balance dari list response
        wallet_akhir_balance = 0
        if wallet_akhir_response.data:
            wallet_row = wallet_akhir_response.data[0]
            if isinstance(wallet_row, dict):
                wallet_akhir_balance = cast(dict[str, object], wallet_row).get('balance', 0)

        jumlah_berhasil = sum([1 for h in (hasil_a, hasil_b) if h['success']])
        anomali = jumlah_berhasil == 2  # anomali jika kedua request lolos (race condition)

        if anomali:
            jumlah_anomali += 1

        status_a = "OK" if hasil_a['success'] else "GAGAL"
        status_b = "OK" if hasil_b['success'] else "GAGAL"
        mark = " ⚠️ ANOMALI" if anomali else ""

        print(
            f"Percobaan {i}: A={status_a} B={status_b} | "
            f"saldo akhir={wallet_akhir_balance}{mark}"
        )

    print(f"\n--- Total anomali: {jumlah_anomali} dari {JUMLAH_PERCOBAAN} percobaan")

if __name__ == "__main__":
    main()