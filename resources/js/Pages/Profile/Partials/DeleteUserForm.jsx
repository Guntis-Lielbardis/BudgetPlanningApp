import DangerButton from '@/Components/DangerButton';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { useForm } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function DeleteUserForm({ className = '' }) {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const passwordInput = useRef();

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
        clearErrors,
    } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser = (e) => {
        e.preventDefault();

        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => passwordInput.current.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        clearErrors();
        reset();
    };

    return (
        <section className={`space-y-6 ${className}`}>
            <header>
                <h2 className="text-lg font-medium text-gray-900 dark:text-gray-200">
                    Konta dzēšana
                </h2>

                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Kad jūsu konts tiks dzēsts, visi tā dati tiks neatgriezeniski dzēsti. Pirms konta dzēšanas, lūdzu, lejupielādējiet visus datus vai informāciju, ko vēlaties saglabāt.
                </p>
            </header>

            <DangerButton onClick={confirmUserDeletion}>
                Dzēst kontu
            </DangerButton>

            <Modal show={confirmingUserDeletion} onClose={closeModal}>
                <form onSubmit={deleteUser} className="p-6 dark:bg-gray-700">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-200">
                        Vai esat pārliecināti, ka vēlaties dzēst kontu?
                    </h2>

                    <p className="mt-1 text-md text-gray-600 dark:text-gray-400">
                        Kad jūsu konts tiks dzēsts, visi tā dati neatgriezeniski pazudīs. Lūdzu, ievadiet paroli, lai apstiprinātu, ka vēlaties neatgriezeniski dzēst kontu.
                    </p>

                    <div className="mt-6">
                        <InputLabel
                            htmlFor="password"
                            value="Password"
                            className="sr-only"
                        />

                        <TextInput
                            id="password"
                            type="password"
                            name="password"
                            ref={passwordInput}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className="mt-1 block w-3/4 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                            isFocused
                            placeholder="Parole"
                        />

                        <InputError
                            message={errors.password}
                            className="mt-2"
                        />
                    </div>

                    <div className="mt-6 flex justify-end">
                        <SecondaryButton className="dark:bg-gray-700 dark:text-white" onClick={closeModal}>
                            Atcelt
                        </SecondaryButton>

                        <DangerButton className="ms-3" disabled={processing}>
                            Dzēst kontu
                        </DangerButton>
                    </div>
                </form>
            </Modal>
        </section>
    );
}