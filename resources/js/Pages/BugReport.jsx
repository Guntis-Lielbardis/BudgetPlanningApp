import {React, useState, useEffect} from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head, useForm, usePage} from '@inertiajs/react';
import SecondaryButton from '@/Components/SecondaryButton';

export default function BugReport() {
    const {auth} = usePage().props;
    const userId = auth?.user?.id;
    const storageKey = `bugReportLastSent_${userId}`;
    
    const { data, setData, post, processing, reset } = useForm({
        message: ""
    });

    const [messageStatus, setMessageStatus] = useState("");
    const [disabled, setDisabled] = useState(false);
    const [remaining, setRemaining] = useState(0);
    const [minutesLeft, setMinutesLeft] = useState(0);
    const [secondsLeft, setSecondsLeft] = useState(0);

    useEffect(() => {
    const cooldown = 3600000;
    const checkCooldown = () => {
        const lastSent = localStorage.getItem(storageKey);
        if (!lastSent) {
            setDisabled(false);
            return;
        }

        const elapsed = Date.now() - lastSent;
        if (elapsed >= cooldown) {
            setDisabled(false);
        } else {
            setDisabled(true);
        }

        const remainingTime = Math.ceil((cooldown - elapsed) / 1000);
        if (remainingTime > 0) {
            setDisabled(true);
            setRemaining(remainingTime);
            setMinutesLeft(Math.floor (remainingTime / 60));
            setSecondsLeft(remainingTime % 60)
        } else {
            setDisabled(false);
            setRemaining(0);
        }
    };

    checkCooldown();
    const interval = setInterval(checkCooldown, 1000);
    return () => clearInterval(interval);
}, []);

    function submit(e) {
        e.preventDefault();
        post("/bug_report", {
            onSuccess: ()=>{
                reset("message");
                setMessageStatus("\u2713 Ziņa nosūtīta!");
                setTimeout(() => {
                setMessageStatus("");
                }, 5000);
                localStorage.setItem(storageKey, Date.now());
                setDisabled(true);
            },
            
            onError: (errors) => {
                if (errors?.response?.status === 429) {
                    const retryAfter = errors.response.headers["retry-after"];
                    const lastSent = Date.now() - (60 - retryAfter) * 1000;
                    localStorage.setItem("bugReportLastSent", lastSent);
                }
            }
        });
    }
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Ziņot par kļūdu" />
            <div className="p-6">
                <h1 className="text-center font-semibold my-5">Šeit varat paziņot par atrastām kļūdām aplikācijā. Maksimums: 1 iesniegums stundā!</h1>
            </div>
            <form className="relative" onSubmit={submit}>
                <textarea className="absolute top-16 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-700 dark:text-gray-200 dark:bg-gray-700 resize-none w-1/2 rounded-md" value={data.message} onChange={(e) => setData("message", e.target.value)} rows="6" maxLength="500" disabled={disabled || processing} required/>
                <SecondaryButton type="submit" className="absolute right-[200px] top-[110px]" disabled={disabled || processing}>{processing ? "Nosūta" : "Iesniegt"}</SecondaryButton>
                {messageStatus && (
                    <p className="absolute top-[180px] left-1/2 transform -translate-x-1/2 text-green-500">
                        {messageStatus}
                    </p>
                )}

                {remaining > 0 && messageStatus!=="\u2713 Ziņa nosūtīta!" && (
                    <p className="absolute top-[180px] left-1/2 transform -translate-x-1/2 text-green-500">
                        Jaunu ziņojumu varat iesniegt pēc {minutesLeft}:{secondsLeft < 10 ? "0"+secondsLeft:secondsLeft}
                    </p>
                )}
            </form>
        </AuthenticatedLayout>
    );
}