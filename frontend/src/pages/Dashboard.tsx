import {useState, useEffect} from "react";
import api from "../services/api"
import { Navbar } from "../components/Navbar";
import {useNavigate} from "react-router-dom";

export function Dashboard() {
    const [ employeeCount, setEmployeeCount ] = useState(0);
    const [expenseTotal, setExpenseTotal] = useState(0);
    const [payrollCount, setPayrollCount] = useState(0);
    const navigate = useNavigate();

    const loadStats = async()=>{
        try
        {
            const response = await api.get("/employees");
            setEmployeeCount(response.data.count);

            const expenseResponse = await api.get("/expenses");
            const total = expenseResponse.data.expenses.reduce((sum: number, exp: { amount: number }) => sum + exp.amount, 0);
            setExpenseTotal(total);

            const payrollResponse = await api.get("/payroll/records");
            setPayrollCount(payrollResponse.data.count);
        }
        catch(error){
            console.log("Failed fetching stats:", error);
        }
    }
    useEffect(()=>{
        const load=async()=>{
            await loadStats();
        }
        load();
    }, []);
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar />
            <main className="max-w-7xl mx-auto px-4 py-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-8">Dashboard Overview</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Employees</p>
                            <p className="text-3xl font-bold text-gray-800">{employeeCount}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Total Expenses</p>
                            <p className="text-3xl font-bold text-gray-800">R{expenseTotal.toFixed(2)}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between">
                        <div>
                            <p className="text-gray-600 text-sm">Payroll Records</p>
                            <p className="text-3xl font-bold text-gray-800">{payrollCount}</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-full">
                            <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                            </svg>
                        </div>
                        </div>
                    </div>
                    </div>
            <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button className="bg-blue-500 text-white rounded-lg shadow p-6 hover:bg-blue-600 transition" onClick={()=>navigate('/employees')}>
                <p>Add Employee</p>
                <p>Add a new employee</p>
            </button>
            <button className="bg-green-500 text-white rounded-lg shadow p-6 hover:bg-green-600 transition" onClick={()=>navigate('/expenses')}>
                <p>Log Expense</p>
                <p>Record a new expense</p>
            </button>
            <button className="bg-purple-500 text-white rounded-lg shadow p-6 hover:bg-purple-600 transition" onClick={()=>navigate('/payroll')}>
                <p>Calculate payroll</p>
                <p>Process employee payroll</p>
            </button>
            </div>
            </div>
            </main>
        </div>
    );
}