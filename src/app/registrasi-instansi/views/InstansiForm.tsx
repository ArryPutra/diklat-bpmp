import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import Instansi, { RegistrasiInstansi } from '@/models/RegistrasiInstansi'
import { BiLeftArrowAlt } from 'react-icons/bi'

export default function InstansiForm({
    setData,
    data,
    onSubmit,
    onBackStep,
    errorMessages
}: {
    setData: React.Dispatch<React.SetStateAction<RegistrasiInstansi>>,
    data: RegistrasiInstansi,
    onSubmit: (formData: FormData) => void,
    onBackStep: () => void,
    errorMessages: Instansi
}) {
    return (
        <>
            <h1 className='text-xl font-semibold mb-6 gradient-text'>Data Instansi</h1>

            <form action={onSubmit}>
                <FieldGroup>
                    <FieldSet>
                        <Field className='animate-fade-in-up'>
                            <FieldLabel>Nama Instansi</FieldLabel>
                            <Input placeholder='Contoh: Badan Penjaminan Mutu Pendidikan Provinsi Kalimantan Selatan'
                                name='nama'
                                value={data.nama}
                                className='transition-all duration-300 focus:ring-2 focus:ring-primary/20'
                                onChange={(e) => setData(prev => ({ ...prev, nama: e.target.value }))} />
                            {
                                errorMessages.nama &&
                                <FieldError>{errorMessages.nama}</FieldError>
                            }
                        </Field>
                        <Field className='animate-fade-in-up delay-100'>
                            <FieldLabel>Email</FieldLabel>
                            <Input placeholder='Contoh: bpmpkalsel@kemendikdasmen.go.id' type='email'
                                name='email'
                                value={data.email}
                                className='transition-all duration-300 focus:ring-2 focus:ring-primary/20'
                                onChange={(e) =>
                                    setData(prev => ({ ...prev, email: e.target.value }))
                                } />
                            {
                                errorMessages.email &&
                                <FieldError>{errorMessages.email}</FieldError>
                            }
                        </Field>
                        <Field className='animate-fade-in-up delay-200'>
                            <FieldLabel>Nomor Telepon</FieldLabel>
                            <Input placeholder='Contoh: 08123456789'
                                name='nomorTelepon'
                                value={data.nomorTelepon}
                                className='transition-all duration-300 focus:ring-2 focus:ring-primary/20'
                                onChange={(e) =>
                                    setData(prev => ({ ...prev, nomorTelepon: e.target.value }))
                                } />
                            {
                                errorMessages.nomorTelepon &&
                                <FieldError>{errorMessages.nomorTelepon}</FieldError>
                            }
                        </Field>
                        <Field>
                            <FieldLabel>Desa/Kelurahan</FieldLabel>
                            <Select value={data.desaKelurahan} name='desaKelurahan'
                                onValueChange={(value) =>
                                    setData(prev => ({ ...prev, desaKelurahan: value }))
                                }>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Desa/Kelurahan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Desa/Kelurahan</SelectLabel>
                                        <SelectItem value="Landasan Ulin Timur">Landasan Ulin Timur</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {
                                errorMessages.desaKelurahan &&
                                <FieldError>{errorMessages.desaKelurahan}</FieldError>
                            }
                        </Field>
                        <Field>
                            <FieldLabel>Kecamatan</FieldLabel>
                            <Select value={data.kecamatan} name='kecamatan'
                                onValueChange={(value) =>
                                    setData(prev => ({ ...prev, kecamatan: value }))
                                }>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Kecamatan" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Kecamatan</SelectLabel>
                                        <SelectItem value="Landasan Ulin">Landasan Ulin</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {
                                errorMessages.kecamatan &&
                                <FieldError>{errorMessages.kecamatan}</FieldError>
                            }
                        </Field>
                        <Field>
                            <FieldLabel>Kabupaten/Kota</FieldLabel>
                            <Select value={data.kabupatenKota} name='kabupatenKota'
                                onValueChange={(value) =>
                                    setData(prev => ({ ...prev, kabupatenKota: value }))
                                }>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih Kabupaten/Kota" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Kabupaten/Kota</SelectLabel>
                                        <SelectItem value="Banjarbaru">Banjarbaru</SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                            {
                                errorMessages.kabupatenKota &&
                                <FieldError>{errorMessages.kabupatenKota}</FieldError>
                            }
                        </Field>
                        <Field>
                            <FieldLabel>Password</FieldLabel>
                            <PasswordInput placeholder='Masukkan password'
                                name='password'
                                value={data.password}
                                onChange={(e) =>
                                    setData(prev => ({ ...prev, password: e.target.value }))
                                } />
                            {
                                errorMessages.password &&
                                <FieldError>{errorMessages.password}</FieldError>
                            }
                        </Field>
                        <Field>
                            <FieldLabel>Konfirmasi Password</FieldLabel>
                            <PasswordInput placeholder='Masukkan konfirmasi password' name='konfirmasiPassword'
                                value={data.konfirmasiPassword}
                                onChange={(e) =>
                                    setData(prev => ({ ...prev, konfirmasiPassword: e.target.value }))
                                } />
                            {
                                errorMessages.konfirmasiPassword &&
                                <FieldError>{errorMessages.konfirmasiPassword}</FieldError>
                            }
                        </Field>
                        <Field>
                            <FieldLabel>Alamat Instansi</FieldLabel>
                            <Textarea placeholder='Contoh: Jl. Gotong Royong No.85, Loktabat Utara, Kec. Banjarbaru Utara, Kota Banjar Baru, Kalimantan Selatan 70714'
                                value={data.alamat}
                                onChange={(e) =>
                                    setData(prev => ({ ...prev, alamat: e.target.value }))
                                } />
                            {
                                errorMessages.alamat &&
                                <FieldError>{errorMessages.alamat}</FieldError>
                            }
                        </Field>
                    </FieldSet>

                    <div className='flex animate-fade-in-up'>
                        <Button className='w-fit hover-lift' variant='secondary' onClick={onBackStep}>
                            <BiLeftArrowAlt /> Kembali
                        </Button>
                        <Button className='w-fit ml-auto hover-lift' type='submit'>Konfirmasi Data</Button>
                    </div>
                </FieldGroup>
            </form>
        </>
    )
}