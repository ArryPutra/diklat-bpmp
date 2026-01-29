import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { MetodeDiklat, TipeAktivitas } from "@/generated/prisma/enums";

async function main() {
    console.log("🌱 Seeding database...");

    // 1. Seed Status Registrasi Instansi
    console.log("📋 Creating status registrasi...");
    await prisma.statusRegistrasiInstansi.createMany({
        data: [
            { nama: "Menunggu" },
            { nama: "Ditinjau" },
            { nama: "Diterima" },
            { nama: "Ditolak" },
        ],
        skipDuplicates: true
    });

    // 2. Seed Admin User
    console.log("👤 Creating admin user...");
    try {
        await auth.api.signUpEmail({
            body: {
                name: "Admin",
                email: "admin@gmail.com",
                password: "password123",
            }
        });
    } catch (error) {
        console.log("Admin user may already exist, skipping...");
    }

    // 3. Seed Sample Diklat
    console.log("📚 Creating sample diklat...");
    const diklatData = [
        {
            nama: "Peningkatan Kompetensi Guru dalam Pembelajaran Berbasis Teknologi",
            deskripsi: "Program pelatihan ini dirancang untuk meningkatkan kemampuan guru dalam mengintegrasikan teknologi ke dalam proses pembelajaran.",
            metode: MetodeDiklat.ONLINE,
            target: "Guru",
            tanggalMulai: new Date("2026-02-01"),
            tanggalSelesai: new Date("2026-02-05"),
            waktuMulai: "08:00",
            waktuSelesai: "16:00",
            batasPendaftaran: new Date("2026-01-31"),
            kuota: 30,
            lokasi: "Via Zoom Meeting",
            linkMeeting: "https://zoom.us/j/example",
            materi: [
                "Pengenalan Platform Pembelajaran Digital",
                "Membuat Konten Pembelajaran Interaktif",
                "Penggunaan AI dalam Pendidikan",
                "Evaluasi Pembelajaran Berbasis Teknologi"
            ],
            persyaratan: [
                "Guru aktif di satuan pendidikan",
                "Memiliki akses internet yang stabil",
                "Memiliki laptop/komputer"
            ],
            fasilitas: [
                "Sertifikat Elektronik",
                "Materi Pelatihan Digital",
                "Akses Rekaman Pelatihan"
            ],
            isActive: true
        },
        {
            nama: "Workshop Kurikulum Merdeka",
            deskripsi: "Workshop intensif untuk memahami dan mengimplementasikan Kurikulum Merdeka di satuan pendidikan.",
            metode: MetodeDiklat.OFFLINE,
            target: "Kepala Sekolah, Guru",
            tanggalMulai: new Date("2026-02-15"),
            tanggalSelesai: new Date("2026-02-17"),
            waktuMulai: "08:00",
            waktuSelesai: "16:00",
            batasPendaftaran: new Date("2026-02-10"),
            kuota: 50,
            lokasi: "Aula BPMP Kalsel",
            materi: [
                "Konsep Dasar Kurikulum Merdeka",
                "Profil Pelajar Pancasila",
                "Pembelajaran Berdiferensiasi",
                "Asesmen Kurikulum Merdeka"
            ],
            persyaratan: [
                "Kepala Sekolah atau Guru aktif",
                "Membawa laptop"
            ],
            fasilitas: [
                "Sertifikat",
                "Konsumsi",
                "Materi Pelatihan"
            ],
            isActive: true
        },
        {
            nama: "Pelatihan Kepemimpinan Kepala Sekolah",
            deskripsi: "Program pengembangan kepemimpinan untuk kepala sekolah dalam era transformasi pendidikan.",
            metode: MetodeDiklat.HYBRID,
            target: "Kepala Sekolah",
            tanggalMulai: new Date("2026-03-01"),
            tanggalSelesai: new Date("2026-03-05"),
            waktuMulai: "08:00",
            waktuSelesai: "15:00",
            batasPendaftaran: new Date("2026-02-25"),
            kuota: 25,
            lokasi: "BPMP Kalsel & Online",
            materi: [
                "Kepemimpinan Transformasional",
                "Manajemen Perubahan",
                "Supervisi Akademik",
                "Pengembangan Budaya Sekolah"
            ],
            persyaratan: [
                "Kepala Sekolah aktif",
                "Minimal 2 tahun pengalaman"
            ],
            fasilitas: [
                "Sertifikat 40 JP",
                "Modul Pembelajaran",
                "Pendampingan"
            ],
            isActive: true
        }
    ];

    for (const diklat of diklatData) {
        await prisma.diklat.upsert({
            where: { id: diklat.nama.substring(0, 20) },
            update: {},
            create: diklat
        });
    }

    // 4. Seed Sample Aktivitas
    console.log("📝 Creating sample aktivitas...");
    await prisma.aktivitas.createMany({
        data: [
            {
                aksi: "Sistem diinisialisasi",
                detail: "Database seeding completed",
                tipe: TipeAktivitas.INFO
            },
            {
                aksi: "Diklat baru ditambahkan",
                detail: "Peningkatan Kompetensi Guru dalam Pembelajaran Berbasis Teknologi",
                tipe: TipeAktivitas.CREATE
            },
            {
                aksi: "Diklat baru ditambahkan",
                detail: "Workshop Kurikulum Merdeka",
                tipe: TipeAktivitas.CREATE
            }
        ]
    });

    console.log("✅ Seeding completed!");
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })