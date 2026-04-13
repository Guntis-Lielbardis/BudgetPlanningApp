import React, { useState, useEffect, useRef } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import InputError from '@/Components/InputError';
import Dropdown from '@/Components/Dropdown';
import ConfirmDelete from '@/Components/ConfirmDelete';
import Pagination from '@/Components/Pagination';
import axios from 'axios';
import { VscAdd, VscTrash, VscEdit } from 'react-icons/vsc';
import { formatInTimeZone } from 'date-fns-tz';
import * as XLSX from 'xlsx';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
  
export default function Dashboard() {
    const [incomeSource, setIncomeSource] = useState("");
    const [totalSumIncome, setTotalSumIncome] = useState(0);
    const [selectedCurrency, setSelectedCurrency] = useState(() => {
        return localStorage.getItem("currency") || "EUR";
    });
    const [descriptionIncome, setDescriptionIncome] = useState("");
    const [editingRowIdIncome, setEditingRowIdIncome] = useState(null);
    const [editedIncome, setEditedIncome] = useState({});
    const [errorMessageIncome, setErrorMessageIncome] = useState("");
    const [errorMessageExpense, setErrorMessageExpense] = useState("");
    const [monthFilter, setMonthFilter] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const currencies = [
        { code: "EUR", label: "Eiro €" },
        { code: "USD", label: "Dolāri $" },
        { code: "GBP", label: "Mārciņas £" },
    ];
    const selectedCurrencyLabel =
  currencies.find(c => c.code === selectedCurrency)?.label || selectedCurrency;

    const addIncomeSource = async () => {
        if (!descriptionIncome.trim() || !incomeSource) {
            setErrorMessageIncome("Lūdzu aizpildiet abus laukus!");
            setTimeout(() => {
            setErrorMessageIncome("");
        }, 5000);
            return;
        }
    
        setErrorMessageIncome("");
        await axios.post('/income-sources', {
            currency: selectedCurrency,
            description: descriptionIncome,
            amount: incomeSource,
        });
        
        fetchIncomeSources();
        setDescriptionIncome(""); 
        setIncomeSource("");
    }; 

    const fetchIncomeSources = async () => {
        const params = new URLSearchParams();
        if (monthFilter) {
            params.append('month', monthFilter);
        }

        try {
            const response = await axios.get(`/income-sources?${params.toString()}`);
            setIncomeSources(response.data.incomeSources || []);
            setTotalSumIncome(response.data.sum);
        } catch (error) {
            console.error("Neizdevās nolasīt ienākumu avotus:", error);
        }
    };
    
    useEffect(() => {
        localStorage.setItem("currency", selectedCurrency);
    }, [selectedCurrency]);

    useEffect(() => {
        axios.get('/user/theme')
            .then((response) => {
                const prefersDark = response.data.dark_mode;
                if (prefersDark) {
                    document.documentElement.classList.add('dark');
                } else {
                    document.documentElement.classList.remove('dark');
                }
            })
            .catch((error) => {
                console.error("Neizdevās nolasīt lietotāja režīmu:", error);
                setIsThemeLoaded(true);
            });
    }, []);

    useEffect(() => {
        fetchIncomeSources();
    }, [monthFilter]);

    useEffect(() => {
        fetchExpenseSources();
    }, [monthFilter, selectedCategory]);
    
    const [incomeSources, setIncomeSources] = useState([]);
    
    const startEditingIncome = (source) => {
        setEditingRowIdIncome(source.id);
        setEditedIncome({ 
            description: source.description, 
            amount: source.amount,
            currency: source.currency,
            updated_at: source.updated_at
        });
    };
    
    const saveEditedIncome = async (id) => {
        try {
            const currentIncomeSource = incomeSources.find(source => source.id === id);
            const payloadIncome = {
                description: editedIncome.description ?? currentIncomeSource.description,
                amount: editedIncome.amount ?? currentIncomeSource.amount,
                currency: editedIncome.currency ?? currentIncomeSource.currency,
                updated_at: editedIncome.updated_at ?? currentIncomeSource.updated_at
            };
            await axios.put(`/income-sources/${id}`, payloadIncome);
            fetchIncomeSources();
            setEditingRowIdIncome(null);
        } 
        catch (error) {
            console.error("Neizdevās saglabāt:", error);
        }
    };
      
    const deleteIncomeSource = async (id) => {
        try {
            await axios.delete(`/income-sources/${id}`);
            fetchIncomeSources();
        } catch (error) {
            console.error("Neizdevās izdzēst:", error);
        }
    };
    
    const [expenseSource, setExpenseSource] = useState("");
    const [totalSumExpense, setTotalSumExpense] = useState(0);
    const [descriptionExpense, setDescriptionExpense] = useState("");
    const [editingRowIdExpense, setEditingRowIdExpense] = useState(null);
    const [editedExpense, setEditedExpense] = useState({});

    const addExpenseSource = async () => {
        if (!descriptionExpense.trim() || !expenseSource) {
            setErrorMessageExpense("Lūdzu aizpildiet abus laukus!");
            setTimeout(() => {
            setErrorMessageExpense("");
        }, 5000);
            return;
        }
        
        setErrorMessageExpense("");
        await axios.post('/expense-sources', {
            currency: selectedCurrency,
            description: descriptionExpense,
            amount: expenseSource,
            category: selectedCategory,
        });
        fetchExpenseSources();
        setDescriptionExpense(""); 
        setExpenseSource("");
        setSelectedCategory("");
    };

    const fetchExpenseSources = async () => {
       try {
            const params = {
                month: monthFilter,
                category: selectedCategory,
            };

            const queryString = new URLSearchParams(params).toString();
            const response = await axios.get(`/expense-sources?${queryString}`);
            setExpenseSources(response.data.expenseSources);
            setTotalSumExpense(response.data.sum);
        } 
        catch (error) {
            console.error("Neizdevās nolasīt izdevumu avotus:", error);
        }
    };

    const [expenseSources, setExpenseSources] = useState([]);
    
    const startEditingExpense = (source) => {
        setEditingRowIdExpense(source.id);
        setEditedExpense({ 
            description: source.description, 
            amount: source.amount,
            currency: source.currency,
            updated_at: source.updated_at,
            category: source.category ==="" ? "Cits" : source.category
        });
    };
    
    const saveEditedExpense = async (id) => {
        try {
            const currentExpenseSource = expenseSources.find(source => source.id === id);
            const payloadExpense = {
                description: editedExpense.description ?? currentExpenseSource.description,
                amount: editedExpense.amount ?? currentExpenseSource.amount,
                currency: editedExpense.currency ?? currentExpenseSource.currency,
                updated_at: editedExpense.updated_at ?? currentExpenseSource.updated_at,
                category: editedExpense.category ?? currentExpenseSource.category,
            };
            await axios.put(`/expense-sources/${id}`, payloadExpense);
            fetchExpenseSources();
            setEditingRowIdExpense(null);
        } 
        catch (error) {
            console.error("Neizdevās saglabāt:", error);
        }
    };
      
    const deleteExpenseSource = async (id) => {
        try {
            await axios.delete(`/expense-sources/${id}`);
            fetchExpenseSources();
        } catch (error) {
            console.error("Neizdevās izdzēst:", error);
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedId, setSelectedId] = useState(null);
    const [selectedType, setSelectedType] = useState("");

    const openModal = (id, type) => {
        setSelectedId(id);
        setSelectedType(type);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedId(null);
    };

    const confirmDelete = () => {
        if (selectedId) {
            if (selectedType=="income")
                deleteIncomeSource(selectedId);
            else if (selectedType=="expense")
                deleteExpenseSource(selectedId);
        }
        closeModal();
    };
    
    const [currentPageIncome, setCurrentPageIncome] = useState(0);
    const [currentPageExpense, setCurrentPageExpense] = useState(0);
    const itemsPerPage = 5;
    const handleMonthChange = (event) => {
        setMonthFilter(event.target.value);
        setCurrentPageIncome(0);
        setCurrentPageExpense(0);
    };
    const filteredIncomeSources = monthFilter
    ? incomeSources?.filter(source => {
        const month = new Date(source.updated_at).getMonth() + 1;
        const formattedMonth = month < 10 ? `0${month}` : `${month}`;
        return formattedMonth === monthFilter;
    })
    : incomeSources;

    const indexOfLastIncome = (currentPageIncome + 1) * itemsPerPage;
    const indexOfFirstIncome = indexOfLastIncome - itemsPerPage;
    const currentItemsIncome = filteredIncomeSources?.slice(indexOfFirstIncome, indexOfLastIncome);
    const pageCountIncome = Math.ceil(filteredIncomeSources?.length / itemsPerPage);
    const offsetExpense = currentPageExpense * itemsPerPage;
    const currentItemsExpense = expenseSources.slice(offsetExpense, offsetExpense + itemsPerPage);
    const pageCountExpense = Math.ceil(expenseSources.length / itemsPerPage);

    const handlePageChangeIncome = ({ selected }) => {
        setCurrentPageIncome(selected);
    };
    const handlePageChangeExpense = ({ selected }) => {
        setCurrentPageExpense(selected);
    };
    
    const incomeFileInputRef = useRef(null);
    const expenseFileInputRef = useRef(null);
    const handleFileUpload = async (e, dataType, currentFileInputRef) => {
        const file = e.target.files[0];
        if (!file) return;
    
        const isCSV = file.name.endsWith('.csv');
        const isXLS = file.name.match(/\.(xls|xlsx)$/i);
        const reader = new FileReader();
    
        reader.onload = async (e) => {
            const data = e.target.result;
            let rows;
            let worksheet;
    
            if (isCSV||isXLS) {
                const workbook = XLSX.read(data, { type: 'array' });
                worksheet = workbook.Sheets[workbook.SheetNames[0]];
                rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
            }
    
            let description = null;
            let amount = null;
            let rawCurrency = null;
            let rawDate = null;
            const labelKeywords = {
                description: 'Apraksts',
                amount: 'Summa',
                currency: 'Valūta',
                date: 'Datums',
            };
    
            const labelsToFind = {
                income: labelKeywords,
                expense: labelKeywords,
            };
            const currentLabels = labelsToFind[dataType];
    
            for (let r = 0; r < rows.length; r++) {
                for (let c = 0; c < rows[r].length; c++) {
                    const cellValue = String(rows[r][c] || "");
                    if (cellValue === currentLabels.description && !description) {
                        description = rows[r + 1]?.[c];
                    }
                    if (cellValue === currentLabels.amount && !amount) {
                        amount = rows[r + 1]?.[c];
                    }
                    if (cellValue === currentLabels.currency && !rawCurrency) {
                        rawCurrency = rows[r + 1]?.[c];
                    }
                    if (cellValue === currentLabels.date && !rawDate) {
                        rawDate = rows[r + 1]?.[c];
                    }
                }
            }
    
            if (rawDate && description && amount) {
                const formattedDate = XLSX.SSF.format('yyyy-mm-dd', rawDate);
                const endpoint = dataType === 'income' ? '/income-sources' : '/expense-sources';
                const fetchFunction = dataType === 'income' ? fetchIncomeSources : fetchExpenseSources;
    
                try {
                    await axios.post(endpoint, {
                        description,
                        amount: parseFloat(amount),
                        currency: rawCurrency,
                        updated_at: formattedDate,
                    });
                    fetchFunction();
                } catch (err) {
                    console.error;
                    alert(`Nevarēja atrast un nolasīt visus nepieciešamos datus.`);
                } finally {
                    if (currentFileInputRef.current) {
                        currentFileInputRef.current.value = null;
                    }
                }
            } else {
                alert(`Nevarēja atrast un nolasīt visus nepieciešamos datus.`);
            }
        };
    
        if (isCSV) {
            reader.readAsText(file);
        } else {
            reader.readAsArrayBuffer(file);
        }
    };

    const chartIncomeData = {
        labels: currentItemsIncome.map(item => item.description),
        datasets: [
          {
            data: currentItemsIncome.map(item => item.amount),
            backgroundColor: 'rgba(86, 237, 139, 0.8)',
            borderColor: 'rgb(0, 0, 0)',
            borderWidth: 1,
          },
        ],
    };
      
    const chartIncomeOptions = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Ienākumu avoti',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                barThickness: 3,
            },
            x: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return value.toFixed(2);
                    }
                }
            }
        }
    };

    const chartExpenseData = {
        labels: currentItemsExpense.map(item => item.description),
        datasets: [
            {
            data: currentItemsExpense.map(item => item.amount),
            backgroundColor: 'rgba(232, 75, 44, 0.8)',
            borderColor: 'rgb(0, 0, 0)',
            borderWidth: 1,
            },
        ],
    };
      
    const chartExpenseOptions = {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: {
            legend: {
                display: false,
            },
            title: {
                display: true,
                text: 'Izdevumu avoti',
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                barThickness: 3,
            },
            x: {
                beginAtZero: true,
                ticks: {
                    callback: function(value) {
                        return value.toFixed(2);
                    }
                }
            }
        }
    };
    
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight dark:text-gray-200">
                    Informācijas panelis
                </h2>
            }
            headerClassName="dark:bg-gray-800"
        >
            <Head title="Informācijas panelis" />

            <div className="min-h-screen bg-gray-200 dark:bg-gray-800 p-6 rounded-md shadow">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-4">
                    <div className="bg-white dark:bg-gray-700 shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div>
                                <InputError className="mt-2" message={() => { }} />
                            </div>

                            <div>
                                <div className="relative inline-block">
                                    <InputLabel value="Valūta" className="text-gray-900 dark:text-gray-200" />
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center rounded-md mt-2 border border-transparent bg-white dark:bg-gray-700 dark:text-gray-300 px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:outline-none"
                                                >
                                                    {selectedCurrencyLabel}
                                                    <svg
                                                        className="-me-0.5 ms-2 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content className="absolute left-0 mt-4 w-36 bg-white dark:bg-gray-900 dark:text-gray-400 rounded-md z-50">
                                            {currencies.map(c => (
                                                <Dropdown.Link
                                                    key={c.code}
                                                    as="button"
                                                    onClick={() => setSelectedCurrency(c.code)}
                                                    className="block w-full px-4 py-2 bg-white dark:bg-gray-600 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                                                    >
                                                    {c.label}
                                                </Dropdown.Link>
                                            ))}
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                                
                                <div className="pt-5">
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-200">Ienākumu avoti</h2>
                                    <div className="mb-4">
                                        <label htmlFor="filterMonth" className="mr-2 dark:text-gray-200">Filtrēt pēc mēneša:</label>
                                        <select id="filterMonth" onChange={handleMonthChange} className="rounded-md px-3 py-2 dark:bg-gray-700 dark:text-gray-400">
                                            <option value="">Visi mēneši</option>
                                            <option value="01">Janvāris</option>
                                            <option value="02">Februāris</option>
                                            <option value="03">Marts</option>
                                            <option value="04">Aprīlis</option>
                                            <option value="05">Maijs</option>
                                            <option value="06">Jūnijs</option>
                                            <option value="07">Jūlijs</option>
                                            <option value="08">Augusts</option>
                                            <option value="09">Septembris</option>
                                            <option value="10">Oktobris</option>
                                            <option value="11">Novembris</option>
                                            <option value="12">Decembris</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex items-start gap-3">
                                            <textarea id="inputDescriptionIncome" placeholder="Raksturojums" className="h-10 w-1/4 resize-none overflow-hidden rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" value={descriptionIncome} onChange={(e) => setDescriptionIncome(e.target.value)} rows="1"
                                                onInput={(e) => {
                                                    e.target.style.height = "40px";
                                                    e.target.style.height = `${e.target.scrollHeight}px`;
                                                }}
                                            />

                                            <TextInput id="inputIncomeSource" type="number" placeholder="Apjoms" className="w-[150px] h-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" value={incomeSource} onChange={(e) => setIncomeSource(e.target.value)} required />
                                            <button onClick={addIncomeSource} className="flex items-center h-10 text-white bg-green-700 hover:bg-green-800 rounded-lg text-sm gap-1 px-4 py-2"><VscAdd className="text-lg"/>Pievienot</button>
                                            <label htmlFor="uploadIncomeFile" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
                                                Nolasīt CSV atskaiti
                                            </label>
                                            <input
                                                type="file"
                                                accept=".xlsx, .xls, .csv"
                                                onChange={(e) => handleFileUpload(e, 'income', incomeFileInputRef)}
                                                onClick={(e) => {
                                                    e.target.value = null;
                                                }}
                                                className="hidden" 
                                                id="uploadIncomeFile"
                                                ref={incomeFileInputRef}
                                            />
                                            
                                        </div>

                                        {errorMessageIncome && (<p className="text-red-500 font-semibold">{errorMessageIncome}</p>)}

                                        {incomeSources?.length > 0 ?(
                                        <div>
                                            <table className="table-auto bg-white dark:bg-gray-800 dark:text-gray-400">
                                                <thead>
                                                    <tr className="dark:text-gray-300">
                                                        <th className="border px-4 py-2">Apraksts</th>
                                                        <th className="border px-4 py-2">Summa</th>
                                                        <th className="border px-4 py-2">Valūta</th>
                                                        <th className="border px-4 py-2">Datums</th>
                                                        <th className="border px-4 py-2">Modifikācijas</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentItemsIncome.map((source) => (
                                                        <tr key={source.id} className="bg-white dark:bg-gray-600">
                                                            <td className="border px-4 py-2">
                                                                {editingRowIdIncome === source.id ? (
                                                                    <input
                                                                        type="text"
                                                                        value={editedIncome.description ?? ""}
                                                                        onChange={(e) => setEditedIncome((prev) => ({ ...prev, description: e.target.value }))}
                                                                        className="border rounded px-2 py-1 bg-white dark:bg-gray-700 w-full"
                                                                    />
                                                                ) : (
                                                                    source.description
                                                                )}
                                                            </td>

                                                            <td className="border px-4 py-2">
                                                                {editingRowIdIncome === source.id ? (
                                                                    <input
                                                                        type="number"
                                                                        value={editedIncome.amount ?? ""}
                                                                        onChange={(e) => setEditedIncome((prev) => ({ ...prev, amount: e.target.value }))}
                                                                        className="border rounded px-2 py-1 bg-white dark:bg-gray-700 w-full"
                                                                    />
                                                                ) : (
                                                                    source.amount !== null && source.amount !== undefined
                                                                    ? parseFloat(source.amount).toFixed(2): '0.00'
                                                                )}
                                                            </td>

                                                            <td className="border px-4 py-2">
                                                                {editingRowIdIncome === source.id ? (
                                                                    <select
                                                                        value={editedIncome.currency !== undefined ? editedIncome.currency : source.currency}
                                                                        onChange={(e) =>
                                                                            setEditedIncome((prev) => ({ ...prev, currency: e.target.value }))
                                                                        }
                                                                        className="border rounded px-2 py-1 bg-white dark:bg-gray-700 w-full"
                                                                    >
                                                                        <option value="EUR">Eiro €</option>
                                                                        <option value="USD">Dolāri $</option>
                                                                        <option value="GBP">Mārciņas £</option>
                                                                    </select>
                                                                ) : (
                                                                    currencies.find(c => c.code === source.currency)?.label || source.currency
                                                                )}
                                                            </td>
                                                            
                                                            <td className="border px-4 py-2">
                                                                {editingRowIdIncome === source.id ? (
                                                                    <input
                                                                        type="date"
                                                                        value={editedIncome.updated_at ?? ""}
                                                                        onChange={(e) =>
                                                                            setEditedIncome((prev) => ({
                                                                                ...prev,
                                                                                updated_at: e.target.value,
                                                                            }))
                                                                        }
                                                                        className="border rounded px-2 py-1 bg-white dark:bg-gray-700 w-full"
                                                                    />
                                                                ) : (
                                                                    source.updated_at
                                                                        ? formatInTimeZone(new Date(source.updated_at), 'Europe/Riga', 'dd/MM/yyyy')
                                                                        : ""
                                                                )}
                                                            </td>

                                                            <td className="border px-4 py-2">
                                                                {editingRowIdIncome === source.id ? (
                                                                    <>
                                                                        <button
                                                                            onClick={() => saveEditedIncome(source.id)}
                                                                            className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded">
                                                                            Saglabāt
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setEditingRowIdIncome(null)}
                                                                            className="ml-2 text-white bg-gray-500 hover:bg-gray-600 px-3 py-1 rounded">
                                                                            Atcelt
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <div className="flex gap-2">
                                                                        <button
                                                                            onClick={() => startEditingIncome(source)}
                                                                            className="flex items-center gap-1 text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-sm px-4 py-2">
                                                                            <VscEdit className="text-lg" /> Rediģēt
                                                                        </button>

                                                                        <button
                                                                            onClick={() => openModal(source.id, "income")}
                                                                            className="flex items-center gap-1 text-white bg-red-700 hover:bg-red-800 rounded-lg text-sm px-4 py-2">
                                                                            <VscTrash className="text-lg" /> Dzēst
                                                                        </button>

                                                                        <ConfirmDelete
                                                                            isOpen={isModalOpen}
                                                                            onClose={closeModal}
                                                                            onConfirm={confirmDelete}
                                                                            message="Vai tiešām vēlaties izdzēst?"
                                                                        />
                                                                    </div>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <div style={{ width: '60%', margin: '0 auto' }}>
                                                <Bar data={chartIncomeData} options={chartIncomeOptions} />
                                            </div>
                                            <p className="font-bold text-gray-900 dark:text-gray-200 mt-2">Kopā: {totalSumIncome.toFixed(2)}</p>
                                            <Pagination pageCount={pageCountIncome} onPageChange={handlePageChangeIncome} />
                                        </div>
                                        ):<div>
                                            <p className="my-10 text-center text-[25px] font-semibold">&#128181;<span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-indigo-800">Nav datu. Pievienojiet kādu ienākumu avotu!</span>&#128181;</p>
                                          </div>}
                                    </div>
                                </div>
                                
                                <div>
                                    <h2 className="text-lg font-bold text-gray-900 dark:text-gray-200">Izdevumu avoti</h2>
                                    <div className="space-y-2">
                                        <div className="flex items-start gap-3">
                                            <textarea id="inputDescriptionExpense" placeholder="Raksturojums" className="h-10 w-1/4 resize-none overflow-hidden rounded-md px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" value={descriptionExpense} onChange={(e) => setDescriptionExpense(e.target.value)} rows="1"
                                                onInput={(e) => {
                                                    e.target.style.height = "40px";
                                                    e.target.style.height = `${e.target.scrollHeight}px`;
                                                }}
                                            />

                                            <TextInput id="inputExpenseSource" type="number" placeholder="Apjoms" className="w-[150px] h-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200" value={expenseSource} onChange={(e) => setExpenseSource(e.target.value)} required />
                                            <button onClick={addExpenseSource} className="flex items-center h-10 text-white bg-green-700 hover:bg-green-800 rounded-lg text-sm gap-1 px-4 py-2"><VscAdd className="text-lg"/>Pievienot</button>
                                            <label htmlFor="uploadExpenseFile" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded cursor-pointer">
                                                Nolasīt CSV atskaiti
                                            </label>
                                            <br></br>
                                            <div className="relative mb-4">
                                                <label htmlFor="changeCategory" className="absolute justify-center dark:text-gray-200">Filtrēt pēc kategorijas:</label>
                                                    <select 
                                                        id="changeCategory"
                                                        value={selectedCategory}
                                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                                        className="absolute ml-[90px] rounded-md px-3 py-2 dark:bg-gray-700 dark:text-gray-400">
                                                        <option value="">Visas kategorijas</option>
                                                        <option value="Pārtika">Pārtika</option>
                                                        <option value="Transports">Transports</option>
                                                        <option value="Rēķini">Rēķini</option>
                                                        <option value="Neparedzēti izdevumi">Neparedzēti izdevumi</option>
                                                        <option value="Dāvanas">Dāvanas</option>
                                                        <option value="Sadzīves preces">Sadzīves preces</option>
                                                        <option value="Cits">Cits</option>
                                                    </select>
                                                </div>
                                            <input
                                                type="file"
                                                accept=".xlsx, .xls, .csv"
                                                onChange={(e) => handleFileUpload(e, 'expense', expenseFileInputRef)}
                                                onClick={(e) => {
                                                    e.target.value = null;
                                                }}
                                                className="hidden" 
                                                id="uploadExpenseFile"
                                                ref={expenseFileInputRef}
                                            />
                                        </div>

                                        {errorMessageExpense && (<p className="text-red-500 font-semibold">{errorMessageExpense}</p>)}

                                        {expenseSources?.length > 0 ?(
                                        <div>
                                            <table className="table-auto bg-white dark:bg-gray-800 dark:text-gray-400">
                                                <thead>
                                                    <tr className="dark:text-gray-300">
                                                        <th className="border px-4 py-2">Apraksts</th>
                                                        <th className="border px-4 py-2">Summa</th>
                                                        <th className="border px-4 py-2">Valūta</th>
                                                        <th className="border px-4 py-2">Datums</th>
                                                        <th className="border px-4 py-2">Kategorija</th>
                                                        <th className="border px-4 py-2">Modifikācijas</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {currentItemsExpense.map((source) => (
                                                        <tr key={source.id} className="bg-white dark:bg-gray-600">
                                                            <td className="border px-4 py-2">
                                                                {editingRowIdExpense === source.id ? (
                                                                    <input
                                                                        type="text"
                                                                        value={editedExpense.description ?? ""}
                                                                        onChange={(e) => setEditedExpense((prev) => ({ ...prev, description: e.target.value }))}
                                                                        className="border rounded px-2 py-1 bg-white dark:bg-gray-700 w-full"
                                                                    />
                                                                ) : (source.description)                                                               }
                                                            </td>

                                                            <td className="border px-4 py-2">
                                                                {editingRowIdExpense === source.id ? (
                                                                    <input
                                                                        type="number"
                                                                        value={editedExpense.amount ?? ""}
                                                                        onChange={(e) => setEditedExpense((prev) => ({ ...prev, amount: e.target.value }))}
                                                                        className="border rounded px-2 py-1 bg-white dark:bg-gray-700 w-full"
                                                                    />
                                                                ) : (
                                                                    source.amount !== null && source.amount !== undefined
                                                                    ? parseFloat(source.amount).toFixed(2): '0.00'
                                                                )}
                                                            </td>

                                                            <td className="border px-4 py-2">
                                                                {editingRowIdExpense === source.id ? (
                                                                    <select
                                                                        value={editedExpense.currency !== undefined ? editedExpense.currency : source.currency}
                                                                        onChange={(e) =>
                                                                            setEditedExpense((prev) => ({ ...prev, currency: e.target.value }))
                                                                        }
                                                                        className="border rounded px-2 py-1 bg-white dark:bg-gray-700 w-full"
                                                                    >
                                                                        <option value="EUR">Eiro €</option>
                                                                        <option value="USD">Dolāri $</option>
                                                                        <option value="GBP">Mārciņas £</option>
                                                                    </select>
                                                                ) : (
                                                                    currencies.find(c => c.code === source.currency)?.label || source.currency
                                                                )}
                                                            </td>

                                                            <td className="border px-4 py-2">
                                                                {editingRowIdExpense === source.id ? (
                                                                    <input
                                                                        type="date"
                                                                        value={editedExpense.updated_at ?? ""}
                                                                        onChange={(e) =>
                                                                            setEditedExpense((prev) => ({
                                                                                ...prev,
                                                                                updated_at: e.target.value,
                                                                            }))
                                                                        }
                                                                        className="border rounded px-2 py-1 bg-white dark:bg-gray-700 w-full"
                                                                    />
                                                                ) : (
                                                                    source.updated_at
                                                                        ? formatInTimeZone(new Date(source.updated_at), 'Europe/Riga', 'dd/MM/yyyy')
                                                                        : ""
                                                                )}
                                                            </td>

                                                            <td className="border px-4 py-2">
                                                                {editingRowIdExpense === source.id ? (
                                                                    <select
                                                                        value={editedExpense.category ?? source.category ?? ""}
                                                                        onChange={(e) =>
                                                                            setEditedExpense((prev) => ({
                                                                                ...prev,
                                                                                category: e.target.value,
                                                                            }))
                                                                        }
                                                                        className="border rounded px-2 py-1 bg-white dark:bg-gray-700 w-full"
                                                                    >
                                                                        <option value="Cits">Izvēlēties kategoriju</option>
                                                                        <option value="Pārtika">Pārtika</option>
                                                                        <option value="Transports">Transports</option>
                                                                        <option value="Rēķini">Rēķini</option>
                                                                        <option value="Neparedzēti izdevumi">Neparedzēti izdevumi</option>
                                                                        <option value="Dāvanas">Dāvanas</option>
                                                                        <option value="Sadzīves preces">Sadzīves preces</option>
                                                                    </select>
                                                                ) : (
                                                                    source.category || ""
                                                                )}
                                                            </td>

                                                            <td className="border px-4 py-2">
                                                                {editingRowIdExpense === source.id ? (
                                                                    <>
                                                                        <button
                                                                            onClick={() => saveEditedExpense(source.id)}
                                                                            className="text-white bg-green-600 hover:bg-green-700 px-3 py-1 rounded"
                                                                        >
                                                                            Saglabāt
                                                                        </button>
                                                                        <button
                                                                            onClick={() => setEditingRowIdExpense(null)}
                                                                            className="ml-2 text-white bg-gray-500 hover:bg-gray-600 px-3 py-1 rounded"
                                                                        >
                                                                            Atcelt
                                                                        </button>
                                                                    </>
                                                                ) : (
                                                                    <div className="flex gap-2">
                                                                        <button
                                                                            onClick={() => startEditingExpense(source)}
                                                                            className="flex items-center gap-1 text-white bg-blue-700 hover:bg-blue-800 rounded-lg text-sm px-4 py-2"
                                                                        >
                                                                            <VscEdit className="text-lg" /> Rediģēt
                                                                        </button>

                                                                        <button
                                                                            onClick={() => openModal(source.id, "expense")}
                                                                            className="flex items-center gap-1 text-white bg-red-700 hover:bg-red-800 rounded-lg text-sm px-4 py-2"
                                                                        >
                                                                            <VscTrash className="text-lg" /> Dzēst
                                                                        </button>

                                                                        <ConfirmDelete
                                                                            isOpen={isModalOpen}
                                                                            onClose={closeModal}
                                                                            onConfirm={confirmDelete}
                                                                            message="Vai tiešām vēlaties izdzēst?"
                                                                        />
                                                                    </div>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                            <div style={{ width: '60%', margin: '0 auto' }}>
                                                <Bar data={chartExpenseData} options={chartExpenseOptions} />
                                            </div>
                                            <p className="font-bold text-gray-900 dark:text-gray-200 mt-2">Kopā: {totalSumExpense.toFixed(2)}</p>
                                            <Pagination pageCount={pageCountExpense} onPageChange={handlePageChangeExpense} />
                                        </div>
                                        ):<div>
                                            <p className="my-10 text-center text-[25px] font-semibold">&#128181;<span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-400 to-indigo-800">Nav datu. Pievienojiet kādu izdevumu avotu!</span>&#128181;</p>
                                          </div>}
                                    </div>
                                </div>
                                
                                <div className="mt-5">
                                    <b className="text-gray-900 dark:text-gray-200">Balanss: {(totalSumIncome-totalSumExpense).toFixed(2)}</b>
                                    {totalSumIncome - totalSumExpense > 0 ? (
                                        <span className="text-green-500"> Ienākumi pārsniedz izdevumus</span>
                                    ) : totalSumIncome - totalSumExpense < 0 ? (
                                        <span className="text-red-500"> Izdevumi pārsniedz ienākumus</span>
                                    ) : (
                                        <span className="text-gray-700 dark:text-gray-400"> Ienākumi sakrīt ar izdevumiem</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}