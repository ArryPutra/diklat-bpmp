import { Prisma } from "@/generated/prisma/client";
import prisma from "@/lib/prisma";

export async function getAllInstansiAction({
    search = "",
    page = "1",
    apakahNonaktif = "false"
}) {
    const _search = search.trim();

    const where: Prisma.InstansiWhereInput = {
        user: {
            apakahNonaktif: apakahNonaktif === "true",
            OR: [
                {
                    name: {
                        contains: _search,
                        mode: "insensitive"
                    }
                },
                {
                    email: {
                        contains: _search,
                        mode: "insensitive"
                    },
                }
            ]
        }
    }

    const data = await prisma.instansi.findMany({
        skip: parseInt(page) * 10 - 10,
        take: 10,
        where,
        include: {
            user: true,
            picInstansi: true,
            registrasiInstansi: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    const total = await prisma.instansi.count({ where });

    return {
        data: data,
        total: total,
    };
}

export async function getInstansiById(id: number) {
    const instansi = await prisma.instansi.findUnique({
        where: { id: id },
        include: {
            user: true,
            picInstansi: true,
            registrasiInstansi: true
        }
    })

    return instansi

}