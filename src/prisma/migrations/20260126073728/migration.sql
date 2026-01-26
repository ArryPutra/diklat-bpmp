-- CreateTable
CREATE TABLE "Diklat" (
    "id" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Diklat_pkey" PRIMARY KEY ("id")
);
