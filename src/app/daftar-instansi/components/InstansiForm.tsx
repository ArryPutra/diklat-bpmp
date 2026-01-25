import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { PasswordInput } from '@/components/ui/password-input'
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import Instansi from '@/models/Instansi'
import { BiLeftArrowAlt } from 'react-icons/bi'

export default function InstansiForm({
    setData,
    data,
    onSubmit,
    onBackStep,
    errorMessages
}: {
    setData: React.Dispatch<React.SetStateAction<Instansi>>,
    data: Instansi,
    onSubmit: () => void,
    onBackStep: () => void,
    errorMessages: Instansi
}) {
    return (
        <>
            <h1 className='text-xl font-semibold mb-6'>Data Instansi</h1>

            <FieldSet>
                <Field>
                    <FieldLabel>Nama Instansi</FieldLabel>
                    <Input placeholder='Contoh: Badan Penjaminan Mutu Pendidikan Provinsi Kalimantan Selatan'
                        onChange={(e) => setData(prev => ({ ...prev, nama: e.target.value }))} />
                    {
                        errorMessages.nama &&
                        <FieldError>{errorMessages.nama}</FieldError>
                    }
                </Field>
                <Field>
                    <FieldLabel>Email</FieldLabel>
                    <Input placeholder='Contoh: bpmpkalsel@kemendikdasmen.go.id' type='email' />
                    {
                        errorMessages.email &&
                        <FieldError>{errorMessages.email}</FieldError>
                    }
                </Field>
                <Field>
                    <FieldLabel>Nomor Telepon</FieldLabel>
                    <Input placeholder='Contoh: 08123456789' type='number' />
                    {
                        errorMessages.nomorTelepon &&
                        <FieldError>{errorMessages.nomorTelepon}</FieldError>
                    }
                </Field>
                <Field>
                    <FieldLabel>Desa/Kelurahan</FieldLabel>
                    <Select>
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
                    <Select>
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
                    <Select>
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
                    <PasswordInput placeholder='Masukkan password' />
                    {
                        errorMessages.password &&
                        <FieldError>{errorMessages.password}</FieldError>
                    }
                </Field>
                <Field>
                    <FieldLabel>Konfirmasi Password</FieldLabel>
                    <PasswordInput placeholder='Masukkan konfirmasi password' />
                    {
                        errorMessages.konfirmasiPassword &&
                        <FieldError>{errorMessages.konfirmasiPassword}</FieldError>
                    }
                </Field>
                <Field>
                    <FieldLabel>Alamat Instansi</FieldLabel>
                    <Textarea placeholder='Contoh: Jl. Gotong Royong No.85, Loktabat Utara, Kec. Banjarbaru Utara, Kota Banjar Baru, Kalimantan Selatan 70714' />
                    {
                        errorMessages.alamat &&
                        <FieldError>{errorMessages.alamat}</FieldError>
                    }
                </Field>

                <div className='flex'>
                    <Button className='w-fit' variant='secondary' onClick={onBackStep}>
                        <BiLeftArrowAlt /> Kembali
                    </Button>
                    <Button className='w-fit ml-auto' onClick={() => onSubmit()}>Daftarkan Instansi</Button>
                </div>
            </FieldSet>
        </>
    )
}