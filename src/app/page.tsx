import { getAllDiklatAction } from "@/actions/diklat-action";
import View from "./view";

export const dynamic = "force-dynamic";

export default async function Page() {

  const daftarDiklat = await getAllDiklatAction({
    take: 3,
    statusPendaftaranDiklatId: [1, 2]
  });

  return (
    <View
      daftarDiklat={daftarDiklat.data || []} />
  )
}
