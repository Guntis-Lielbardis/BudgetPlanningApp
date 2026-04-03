import React from 'react';
const { useState, useEffect, useMemo } = React;
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import {Head} from '@inertiajs/react';
import TextInput from '@/Components/TextInput';

export default function About({ auth }) {    
    const [rates, setRates] = useState({});

    const [startAmount, setStartAmount] = useState("");
    const [currencyFrom, setCurrencyFrom] = useState("EUR");
    const [currencyTo, setCurrencyTo] = useState("USD");
    const currencyList = ["EUR", "USD", "GBP"];

    const converted = useMemo(() => {
        if (!startAmount || !rates[currencyTo]) return "";
        return (startAmount * rates[currencyTo]).toFixed(2);
    }, [startAmount, currencyTo, rates]);
    
    useEffect(() => {
    fetch(`/api/rates/${currencyFrom}`)
    .then(res => res.json())
    .then(data => {
        setRates({
            ...data.rates,
            [currencyFrom]: 1,
        });
    })
    .catch(err => console.error(err));
}, [currencyFrom]);

    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Valūtas konvertācija" />
            <div className="p-4">
                <label>
                    Ievadiet naudas summu:
                    <TextInput
                    type="number"
                    value={startAmount}
                    className="h-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200"
                    onChange={(e) => setStartAmount(Number(e.target.value))}
                    />
                </label>

                <br />

                <label>
                    No
                    <select
                        value={currencyFrom}
                        className="w-[100px] rounded-md px-3 py-2 dark:bg-gray-700 dark:text-gray-400"
                        onChange={(e) => setCurrencyFrom(e.target.value)}
                    >
                        {currencyList.map(cur => (
                            <option key={cur}>{cur}</option>
                        ))}
                    </select>
                </label>

                <br />

                <label>
                    Uz
                    <select
                        value={currencyTo}
                        className="w-[100px] rounded-md px-3 py-2 dark:bg-gray-700 dark:text-gray-400"
                        onChange={(e) => setCurrencyTo(e.target.value)}
                    >
                        {currencyList.map(cur => (
                            <option key={cur}>{cur}</option>
                        ))}
                    </select>
                </label>

                <p>
                    Konvertētais apjoms: {startAmount===""? "":`${converted} ${currencyTo}`}
                </p>
            </div>

        </AuthenticatedLayout>
    );
}