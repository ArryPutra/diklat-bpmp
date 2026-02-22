/*
  Warnings:

  - You are about to drop the column `isSertifikatTerbit` on the `kelulusan_peserta_diklat` table. All the data in the column will be lost.
  - You are about to drop the column `nomorSertifikat` on the `kelulusan_peserta_diklat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "kelulusan_peserta_diklat" DROP COLUMN "isSertifikatTerbit",
DROP COLUMN "nomorSertifikat",
ADD COLUMN     "kodeSertifikasi" TEXT;
