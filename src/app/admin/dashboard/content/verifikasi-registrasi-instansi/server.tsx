"use server"

import { getAllRegistrasiInstansiAction } from "@/actions/registrasi-instansi-action";
import VerifikasiRegistrasiInstansiCanvas from "./view";

export default async function VerifikasiRegistrasiInstansiServer({
  searchQuery
}: {
  searchQuery: {
    search?: string
    page?: string
    status?: string
  }
}) {
  const daftarRegistrasiInstansi =
    await getAllRegistrasiInstansiAction({
      page: searchQuery.page,
      search: searchQuery.search,
      statusRegistrasiInstansiId: parseInt(searchQuery.status ?? "1"),
    });

  return (
    <VerifikasiRegistrasiInstansiCanvas
      daftarRegistrasiInstansi={daftarRegistrasiInstansi.data}
      totalDaftarRegistrasiInstansi={daftarRegistrasiInstansi.total} />
  )
}
