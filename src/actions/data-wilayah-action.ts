"use server"

const baseUrl = "https://wilayah.id/api/"

export async function getKabupatenKotaAction() {
    const res = await fetch(`${baseUrl}/regencies/63.json`)

    if (!res.ok) {
        return [];
    }

    const json = await res.json();

    return json.data;
}

export async function getKecamatanAction(districtCode: string) {
    const res = await fetch(`${baseUrl}/districts/${districtCode}.json`)

    if (!res.ok) {
        return [];
    }

    const json = await res.json();

    return json.data;
}

export async function getDesaKelurahanAction(villagesCode: string) {
    const res = await fetch(`${baseUrl}/villages/${villagesCode}.json`)

    if (!res.ok) {
        return [];
    }

    const json = await res.json();

    return json.data;
}