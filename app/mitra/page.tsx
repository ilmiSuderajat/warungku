import TopCardMitra from "./dashboard/TopCardMitra";
import StoreControlCard from "./dashboard/StoreControlCard";
import OrderListMitra from "./dashboard/OrderListMitra";
import ProductManagement from "./dashboard/ProductManagement";
import WithdrawCard from "./dashboard/WithdrawCard";
import NavbarMitra from "../components/NavbarMitra";

export default function DashboardMitraPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <NavbarMitra />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-6 sm:px-6 lg:px-8">
        <section className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-indigo-600">
              Panel Mitra
            </p>
            <h1 className="text-2xl font-bold tracking-tight text-slate-950 md:text-3xl">
              Dashboard Warung
            </h1>
            <p className="mt-1 max-w-2xl text-sm text-slate-500">
              Pantau pesanan, stok menu, status operasional, dan saldo warung
              dalam satu tempat.
            </p>
          </div>
        </section>

        <TopCardMitra />

        <section className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="flex flex-col gap-5">
            <OrderListMitra />
            <ProductManagement />
          </div>

          <aside className="flex flex-col gap-5">
            <StoreControlCard />
            <WithdrawCard />
          </aside>
        </section>
      </main>
    </div>
  );
}
