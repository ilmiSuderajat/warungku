import Detail from "./Detail";
import { getPesananById } from "../viewModel";
export default async function PageDetail({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const pesananData = await getPesananById(id);
  if (!pesananData) {
    return (
      <div>
        <div>Pesanan tidak ditemukan</div>;
      </div>
    );
  }
  return (
    <>
      <Detail datapesanan={[pesananData]} />;
    </>
  );
}
