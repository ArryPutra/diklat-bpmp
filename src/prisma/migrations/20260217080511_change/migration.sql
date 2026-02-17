-- CreateEnum
CREATE TYPE "JenisKelamin" AS ENUM ('Pria', 'Wanita');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "peranId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "banned" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "peran" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "peran_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registrasi_instansi" (
    "id" TEXT NOT NULL,
    "statusRegistrasiInstansiId" INTEGER NOT NULL DEFAULT 1,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nomorTelepon" TEXT NOT NULL,
    "desaKelurahan" TEXT NOT NULL,
    "kecamatan" TEXT NOT NULL,
    "kabupatenKota" TEXT NOT NULL,
    "desaKelurahanKode" TEXT NOT NULL,
    "kecamatanKode" TEXT NOT NULL,
    "kabupatenKotaKode" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "registrasi_instansi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status_registrasi_instansi" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "backgroundColor" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "status_registrasi_instansi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "registrasi_pic_instansi" (
    "id" SERIAL NOT NULL,
    "registrasiInstansiId" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nomorTelepon" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "registrasi_pic_instansi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instansi" (
    "id" SERIAL NOT NULL,
    "registrasiInstansiId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "nomorTelepon" TEXT NOT NULL,
    "desaKelurahan" TEXT NOT NULL,
    "kecamatan" TEXT NOT NULL,
    "kabupatenKota" TEXT NOT NULL,
    "desaKelurahnKode" TEXT NOT NULL,
    "kecamatanKode" TEXT NOT NULL,
    "kabupatenKotaKode" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "instansi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pic_instansi" (
    "id" SERIAL NOT NULL,
    "instansiId" INTEGER NOT NULL,
    "registrasiPicInstansiId" INTEGER NOT NULL,
    "nama" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nomorTelepon" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pic_instansi_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diklat" (
    "id" TEXT NOT NULL,
    "metodeDiklatId" INTEGER NOT NULL,
    "statusPendaftaranDiklatId" INTEGER NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT,
    "gambar" TEXT,
    "tujuan" TEXT NOT NULL,
    "targetSasaran" TEXT NOT NULL,
    "lokasi" TEXT NOT NULL,
    "maksimalKuota" INTEGER NOT NULL,
    "tanggalBukaPendaftaran" TIMESTAMP(3) NOT NULL,
    "tanggalTutupPendaftaran" TIMESTAMP(3) NOT NULL,
    "tanggalMulaiAcara" TIMESTAMP(3) NOT NULL,
    "tanggalSelesaiAcara" TIMESTAMP(3) NOT NULL,
    "persyaratanPeserta" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "diklat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status_pendaftaran_diklat" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "backgroundColor" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "status_pendaftaran_diklat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metode_diklat" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "backgroundColor" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "metode_diklat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "peserta" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "instansiId" INTEGER NOT NULL,
    "nik" TEXT NOT NULL,
    "jabatan" TEXT NOT NULL,
    "nomorTelepon" TEXT NOT NULL,
    "jenisKelamin" "JenisKelamin" NOT NULL,
    "tanggalLahir" TIMESTAMP(3) NOT NULL,
    "tempatLahir" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "peserta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "peserta_diklat" (
    "id" SERIAL NOT NULL,
    "diklatId" TEXT NOT NULL,
    "pesertaId" INTEGER NOT NULL,
    "statusDaftarPesertaDiklatId" INTEGER NOT NULL DEFAULT 1,
    "statusPelaksanaanPesertaDiklatId" INTEGER,
    "statusKelulusanPesertaDiklatId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "peserta_diklat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status_daftar_peserta_diklat" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "status_daftar_peserta_diklat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status_pelaksanaan_peserta_diklat" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "status_pelaksanaan_peserta_diklat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "status_kelulusan_peserta_diklat" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "status_kelulusan_peserta_diklat_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "narasumber" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "nomorTelepon" TEXT NOT NULL,
    "jenisKelamin" "JenisKelamin" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "narasumber_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "materi_diklat" (
    "id" SERIAL NOT NULL,
    "diklatId" TEXT NOT NULL,
    "narasumberId" INTEGER NOT NULL,
    "judul" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "fileMateri" TEXT,
    "lokasi" TEXT,
    "tanggalPelaksanaan" TIMESTAMP(3) NOT NULL,
    "waktuMulai" TEXT NOT NULL,
    "waktuSelesai" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "materi_diklat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "peran_nama_key" ON "peran"("nama");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE UNIQUE INDEX "status_registrasi_instansi_nama_key" ON "status_registrasi_instansi"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "registrasi_pic_instansi_registrasiInstansiId_key" ON "registrasi_pic_instansi"("registrasiInstansiId");

-- CreateIndex
CREATE UNIQUE INDEX "instansi_registrasiInstansiId_key" ON "instansi"("registrasiInstansiId");

-- CreateIndex
CREATE UNIQUE INDEX "instansi_userId_key" ON "instansi"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "pic_instansi_instansiId_key" ON "pic_instansi"("instansiId");

-- CreateIndex
CREATE UNIQUE INDEX "pic_instansi_registrasiPicInstansiId_key" ON "pic_instansi"("registrasiPicInstansiId");

-- CreateIndex
CREATE UNIQUE INDEX "status_pendaftaran_diklat_nama_key" ON "status_pendaftaran_diklat"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "metode_diklat_nama_key" ON "metode_diklat"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "peserta_userId_key" ON "peserta"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "peserta_instansiId_nik_key" ON "peserta"("instansiId", "nik");

-- CreateIndex
CREATE UNIQUE INDEX "peserta_instansiId_nomorTelepon_key" ON "peserta"("instansiId", "nomorTelepon");

-- CreateIndex
CREATE UNIQUE INDEX "peserta_diklat_diklatId_pesertaId_key" ON "peserta_diklat"("diklatId", "pesertaId");

-- CreateIndex
CREATE UNIQUE INDEX "status_daftar_peserta_diklat_nama_key" ON "status_daftar_peserta_diklat"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "status_pelaksanaan_peserta_diklat_nama_key" ON "status_pelaksanaan_peserta_diklat"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "status_kelulusan_peserta_diklat_nama_key" ON "status_kelulusan_peserta_diklat"("nama");

-- CreateIndex
CREATE UNIQUE INDEX "narasumber_userId_key" ON "narasumber"("userId");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_peranId_fkey" FOREIGN KEY ("peranId") REFERENCES "peran"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrasi_instansi" ADD CONSTRAINT "registrasi_instansi_statusRegistrasiInstansiId_fkey" FOREIGN KEY ("statusRegistrasiInstansiId") REFERENCES "status_registrasi_instansi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "registrasi_pic_instansi" ADD CONSTRAINT "registrasi_pic_instansi_registrasiInstansiId_fkey" FOREIGN KEY ("registrasiInstansiId") REFERENCES "registrasi_instansi"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instansi" ADD CONSTRAINT "instansi_registrasiInstansiId_fkey" FOREIGN KEY ("registrasiInstansiId") REFERENCES "registrasi_instansi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instansi" ADD CONSTRAINT "instansi_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pic_instansi" ADD CONSTRAINT "pic_instansi_registrasiPicInstansiId_fkey" FOREIGN KEY ("registrasiPicInstansiId") REFERENCES "registrasi_pic_instansi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pic_instansi" ADD CONSTRAINT "pic_instansi_instansiId_fkey" FOREIGN KEY ("instansiId") REFERENCES "instansi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diklat" ADD CONSTRAINT "diklat_metodeDiklatId_fkey" FOREIGN KEY ("metodeDiklatId") REFERENCES "metode_diklat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diklat" ADD CONSTRAINT "diklat_statusPendaftaranDiklatId_fkey" FOREIGN KEY ("statusPendaftaranDiklatId") REFERENCES "status_pendaftaran_diklat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peserta" ADD CONSTRAINT "peserta_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peserta" ADD CONSTRAINT "peserta_instansiId_fkey" FOREIGN KEY ("instansiId") REFERENCES "instansi"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peserta_diklat" ADD CONSTRAINT "peserta_diklat_diklatId_fkey" FOREIGN KEY ("diklatId") REFERENCES "diklat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peserta_diklat" ADD CONSTRAINT "peserta_diklat_pesertaId_fkey" FOREIGN KEY ("pesertaId") REFERENCES "peserta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peserta_diklat" ADD CONSTRAINT "peserta_diklat_statusDaftarPesertaDiklatId_fkey" FOREIGN KEY ("statusDaftarPesertaDiklatId") REFERENCES "status_daftar_peserta_diklat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peserta_diklat" ADD CONSTRAINT "peserta_diklat_statusPelaksanaanPesertaDiklatId_fkey" FOREIGN KEY ("statusPelaksanaanPesertaDiklatId") REFERENCES "status_pelaksanaan_peserta_diklat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "peserta_diklat" ADD CONSTRAINT "peserta_diklat_statusKelulusanPesertaDiklatId_fkey" FOREIGN KEY ("statusKelulusanPesertaDiklatId") REFERENCES "status_kelulusan_peserta_diklat"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "narasumber" ADD CONSTRAINT "narasumber_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materi_diklat" ADD CONSTRAINT "materi_diklat_diklatId_fkey" FOREIGN KEY ("diklatId") REFERENCES "diklat"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "materi_diklat" ADD CONSTRAINT "materi_diklat_narasumberId_fkey" FOREIGN KEY ("narasumberId") REFERENCES "narasumber"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
