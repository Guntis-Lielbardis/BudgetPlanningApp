import { Head, Link } from '@inertiajs/react';
import { MdLogin } from "react-icons/md";

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Budžeta plānošanas aplikācija" />
            <div className="relative flex flex-col min-h-screen items-center justify-center bg-gray-200">
                <img
                    id="background"
                    className="absolute w-full h-full object-cover"
                    src="/bluesky_FrancescoUngaro.jpg"
                />
                <nav className="absolute top-0 flex justify-center p-4">
                    {auth.user ? (
                        <Link
                            href={route('dashboard')}
                            className="px-2 text-lg rounded-md text-black transition hover:bg-black/50"
                        >
                            Informācijas panelis
                        </Link>
                    ) : (
                        <>
                            <Link
                                href={route('login')}
                                className="flex items-center px-2 text-lg rounded-md text-black hover:bg-black/50"
                            >
                                <MdLogin className="mr-1"/>Ieiet
                            </Link>
                            <Link
                                href={route('register')}
                                className="px-2 text-lg rounded-md text-black hover:bg-black/50"
                            >
                                Reģistrēties
                            </Link>
                        </>
                    )}
                </nav>
                <main className="absolute text-center px-4">
                    <div className="text-[50px] text-black font-bold p-8">Laipni lūdzu tīmekļa<br></br> aplikācijā budžeta plānošanai!</div>
                </main>
            </div>
        </>
    );
}