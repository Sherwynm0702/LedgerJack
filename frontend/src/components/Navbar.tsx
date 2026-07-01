import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function Navbar(){
    const navigate = useNavigate();
    const location = useLocation();
    const { user,logout } = useAuth(); 
    const handleLogout = () => {
        logout();
        navigate('/login');
    }
    return (
        <div>
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">LedgerJack</h1>
                    <div className="flex items-center gap-4">
                        <p className="text-gray-600">Welcome, {user?.email}</p>
                        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition">Logout</button>
                    </div>
                </div>
            </header>
        <nav className="bg-white border-b shadow-sm">
            <div className="max-w-7xl mx-auto px-4 flex gap-8">
                <button onClick={() => navigate('/dashboard')} className={`py-4 px-2 transition border-b-2 ${location.pathname === '/dashboard' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600'}`}>Dashboard</button>
                <button onClick={() => navigate('/employees')} className={`py-4 px-2 transition border-b-2 ${location.pathname === '/employees' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600'}`}>Employees</button>
                <button onClick={() => navigate('/expenses')} className={`py-4 px-2 transition border-b-2 ${location.pathname === '/expenses' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600'}`}>Expenses</button>
                <button onClick={() => navigate('/payroll')} className={`py-4 px-2 transition border-b-2 ${location.pathname === '/payroll' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-600 hover:text-blue-600'}`}>Payroll</button>
            </div>
        </nav>
        </div>
    );

}