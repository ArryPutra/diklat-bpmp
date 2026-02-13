"use server"

import { getCurrentUser } from "@/actions/auth-action";
import { getDiklatAction } from "@/actions/diklat-action";
import prisma from "@/lib/prisma";
import DiklatView from "./view";

export default async function DiklatPage({
    params
}: {
    params: Promise<{ id: string }>
}) {

    const _params = await params

    const diklat = await getDiklatAction(_params.id)
    const user = await getCurrentUser()

    const isInstansi = user?.peranId === 2

    let daftarPesertaDariInstansi: any[] = []
    let daftarPesertaDiklat: any[] = []

    if (isInstansi) {
        const instansi = await prisma.instansi.findUniqueOrThrow({ where: { userId: user.id } })
        daftarPesertaDariInstansi = await prisma.peserta.findMany({
            where: {
                instansiId: instansi.id,
                pesertaDiklat: {
                    none: {
                        diklatId: diklat?.id
                    }
                }
            },
            select: {
                id: true,
                nik: true,
                user: {
                    select: {
                        name: true
                    }
                }
            },
        })
    }

    daftarPesertaDiklat = await prisma.pesertaDiklat.findMany({
        where: { diklatId: diklat?.id },
        select: {
            createdAt: true,
            statusDaftarPesertaDiklat: {
                select: {
                    nama: true
                }
            },
            peserta: {
                select: {
                    user: {
                        select: {
                            name: true
                        }
                    },
                    instansi: {
                        select: {
                            user: {
                                select: {
                                    name: true
                                }
                            }
                        }
                    }
                },
            }
        }
    });

    return (
        <DiklatView
            diklat={diklat}
            isInstansi={isInstansi}
            daftarPesertaDariInstansi={daftarPesertaDariInstansi}
            daftarPesertaDiklat={daftarPesertaDiklat} />
    )
}
