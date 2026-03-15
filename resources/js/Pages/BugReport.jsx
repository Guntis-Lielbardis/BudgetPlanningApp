import {React, useState} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, useForm} from '@inertiajs/react';
import SecondaryButton from '@/Components/SecondaryButton';

export default function BugReport({ auth }) {
    const { data, setData, post, processing, reset } = useForm({
        message: ""
    });

    const [messageStatus, setMessageStatus] = useState("");

    function submit(e) {
        e.preventDefault();
        post("/bug_report", {
            onSuccess: ()=>{
                reset("message");
                setMessageStatus("\u2713 Ziņa nosūtīta!");
                
                    setTimeout(() => {
                    setMessageStatus("");
                }, 5000);
            }  
        });
    }
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Iesniegt par kļūdu" />
            <div className="p-6">
                <h1 className="text-center font-semibold my-5">Šeit varat paziņot par atrastām kļūdām aplikācijā!</h1>
            </div>
            <form className="relative" onSubmit={submit}>
                <textarea className="absolute top-16 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-700 resize-none w-1/2 rounded-md" value={data.message} onChange={(e) => setData("message", e.target.value)} rows="6" maxLength="500" required/>
                <SecondaryButton type="submit" className="absolute right-[200px] top-[110px]" disabled={processing}>{processing ? "Nosūta" : "Iesniegt"}</SecondaryButton>
                {messageStatus && (
                <p className="absolute top-[180px] left-1/2 transform -translate-x-1/2 text-green-500">
                    {messageStatus}
                </p>
            )}
            </form>
        </AuthenticatedLayout>
    );
}