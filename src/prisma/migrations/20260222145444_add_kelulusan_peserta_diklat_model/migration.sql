/*
  Warnings:

  - You are about to drop the column `fileMateri` on the `materi_diklat` table. All the data in the column will be lost.
  - Added the required column `minimalKehadiranPersen` to the `diklat` table without a default value. This is not possible if the table is not empty.
  - Added the required column `statusPelaksanaanAcaraDiklatId` to the `diklat` table without a default value. This is not possible if the table is not empty.
  - Made the column `statusPelaksanaanPesertaDiklatId` on table `peserta_diklat` required. This step will fail if there are existing NULL values in that column.
  - Made the column `statusKelulusanPesertaDiklatId` on table `peserta_diklat` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "peserta_diklat" DROP CONSTRAINT "peserta_diklat_statusKelulusanPesertaDiklatId_fkey";

-- DropForeignKey
ALTER TABLE "peserta_diklat" DROP CONSTRAINT "peserta_diklat_statusPelaksanaanPesertaDiklatId_fkey";

-- AlterTable
ALTER TABLE "diklat" ADD COLUMN     "minimalKehadiranPersen" INTEGER NOT NULL,
ADD COLUMN     "statusPelaksanaanAcaraDiklatId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "materi_diklat" DROP COLUMN "fileMateri",
ADD COLUMN     "isSelesai" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "linkMateri" TEXT;

-- AlterTable
ALTER TABLE "peserta_diklat" ALTER COLUMN "statusPelaksanaanPesertaDiklatId" SET NOT NULL,
ALTER COLUMN "statusPelaksanaanPesertaDiklatId" SET DEFAULT 1,
ALTER COLUMN "statusKelulusanPesertaDiklatId" SET NOT NULL,
ALTER COLUMN "statusKelulusanPesertaDiklatId" SET DEFAULT 1;

-- CreateTable
CREATE TABLE "status_pelaksanaan_acara_diklat" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "backgroundColor" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "status_pelaksanaan_acara_diklat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "kelulusan_peserta_diklat" (
    "id" SERIAL NOT NULL,
    "pesertaDiklatId" INTEGER NOT NULL,
    "statusKelulusanPesertaDiklatId" INTEGER NOT NULL,
    "isSertifikatTerbit" BOOLEAN NOT NULL DEFAULT false,
    "nomorSertifikat" TEXT,
    "tanggalTerbitSertifikat" TIMESTAMP(3),
    "fileSertifikatUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "kelulusan_peserta_diklat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "absensi_peserta_diklat" (
    "id" SERIAL NOT NULL,
    "pesertaDiklatId" INTEGER NOT NULL,
    "materiDiklatId" INTEGER NOT NULL,
    "statusAbsensiId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "absensi_peserta_diklat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status_absensi_peserta_diklat" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "status_absensi_peserta_diklat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "status_pelaksanaan_acara_diklat_nama_key" ON "status_pelaksanaan_acara_diklat"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "kelulusan_peserta_diklat_pesertaDiklatId_key" ON "kelulusan_peserta_diklat"("pesertaDiklatId");

-- CreateIndex
CREATE UNIQUE INDEX "absensi_peserta_diklat_pesertaDiklatId_materiDiklatId_key" ON "absensi_peserta_diklat"("pesertaDiklatId", "materiDiklatId");

-- CreateIndex
CREATE UNIQUE INDEX "status_absensi_peserta_diklat_nama_key" ON "status_absensi_peserta_diklat"("nama");

-- AddForeignKey
ALTER TABLE "diklat" ADD CONSTRAINT "diklat_statusPelaksanaanAcaraDiklatId_fkey" FOREIGN KEY ("statusPelaksanaanAcaraDiklatId") REFERENCES "status_pelaksanaan_acara_diklat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peserta_diklat" ADD CONSTRAINT "peserta_diklat_statusPelaksanaanPesertaDiklatId_fkey" FOREIGN KEY ("statusPelaksanaanPesertaDiklatId") REFERENCES "status_pelaksanaan_peserta_diklat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peserta_diklat" ADD CONSTRAINT "peserta_diklat_statusKelulusanPesertaDiklatId_fkey" FOREIGN KEY ("statusKelulusanPesertaDiklatId") REFERENCES "status_kelulusan_peserta_diklat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kelulusan_peserta_diklat" ADD CONSTRAINT "kelulusan_peserta_diklat_pesertaDiklatId_fkey" FOREIGN KEY ("pesertaDiklatId") REFERENCES "peserta_diklat"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "kelulusan_peserta_diklat" ADD CONSTRAINT "kelulusan_peserta_diklat_statusKelulusanPesertaDiklatId_fkey" FOREIGN KEY ("statusKelulusanPesertaDiklatId") REFERENCES "status_kelulusan_peserta_diklat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "absensi_peserta_diklat" ADD CONSTRAINT "absensi_peserta_diklat_pesertaDiklatId_fkey" FOREIGN KEY ("pesertaDiklatId") REFERENCES "peserta_diklat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "absensi_peserta_diklat" ADD CONSTRAINT "absensi_peserta_diklat_materiDiklatId_fkey" FOREIGN KEY ("materiDiklatId") REFERENCES "materi_diklat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "absensi_peserta_diklat" ADD CONSTRAINT "absensi_peserta_diklat_statusAbsensiId_fkey" FOREIGN KEY ("statusAbsensiId") REFERENCES "status_absensi_peserta_diklat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
