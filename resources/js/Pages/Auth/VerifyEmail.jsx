import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="E-pasta apstiprināšana" />

            <div className="mb-4 text-sm text-gray-600">
                Paldies par reģistrāciju! Pirms darba uzsākšanas, vai Jūs varētu
                verificēt e-pasta adresi, nospiežot uz saites, ko tiko saņēmāt?
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    Jauna verifikācijas saite tika nosūtīta uz Jūsu e-pasta adresi.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-4 flex items-center justify-between">
                    <PrimaryButton disabled={processing}>
                        Nosūtīt verifikācijas e-pastu vēlreiz
                    </PrimaryButton>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                        Izlogoties
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}