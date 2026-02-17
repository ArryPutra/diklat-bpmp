/**
 * Mengecek apakah diklat aktif berdasarkan rentang tanggal pelaksanaan.
 * 
 * @param tanggalMulaiAcara - Tanggal mulai acara diklat
 * @param tanggalSelesaiAcara - Tanggal selesai acara diklat
 * @param tanggalAcuan - Tanggal acuan untuk pengecekan (default: hari ini)
 * @returns true jika diklat aktif pada tanggal acuan, false jika kadaluarsa
 * 
 * @example
 * const isActive = isTanggalPelaksanaanDiklatAktif(new Date('2026-02-17'), new Date('2026-02-20'))
 * // returns true jika tanggal sekarang antara 17-20 Feb 2026
 */
export function isTanggalPelaksanaanDiklatAktif(
    tanggalMulaiAcara: Date | string,
    tanggalSelesaiAcara: Date | string,
    tanggalAcuan: Date | string = new Date()
): boolean {
    const tanggalSekarang = new Date(tanggalAcuan)
    const mulai = new Date(tanggalMulaiAcara)
    const selesai = new Date(tanggalSelesaiAcara)

    tanggalSekarang.setHours(0, 0, 0, 0)
    mulai.setHours(0, 0, 0, 0)
    selesai.setHours(23, 59, 59, 999)

    return tanggalSekarang >= mulai && tanggalSekarang <= selesai
}

/**
 * Alias untuk isTanggalPelaksanaanDiklatAktif dengan nama lebih pendek.
 * 
 * @param tanggalMulaiAcara - Tanggal mulai acara diklat
 * @param tanggalSelesaiAcara - Tanggal selesai acara diklat
 * @returns true jika diklat aktif, false jika kadaluarsa
 */
export function isDiklatAktif(
    tanggalMulaiAcara: Date | string,
    tanggalSelesaiAcara: Date | string
): boolean {
    return isTanggalPelaksanaanDiklatAktif(tanggalMulaiAcara, tanggalSelesaiAcara)
}
