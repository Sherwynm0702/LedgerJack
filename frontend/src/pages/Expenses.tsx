import {useState, useEffect} from "react";
import api from "../services/api"
import { Navbar } from "../components/Navbar";
interface Expense{
    id:number;
    amount:number;
    category:string;
}
export function Expenses(){
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        amount: 0,
        category: ""
    });
    const [editingId, setEditingId] = useState<number | null>(null);
    const loadExpenses = async()=>{
        try{
            const response = await api.get("/expenses");
            setExpenses(response.data.expenses);
            setError("");
        }
        catch(error){
            setError("Failed to load expenses. Please try again.");
        }
        finally{
            setLoading(false);
        }
    }
    const handleAddExpense=async()=>{
        try{
            await api.post("/expenses", formData);
            setFormData({amount: 0, category: ""});
            setShowAddForm(false);
            loadExpenses();
        }
        catch(error){
            console.log("Failed adding expense:", error);
        }
    }
    const handleDelete = async(id:number)=>{
        try{
            await api.delete(`/expenses/${id}`);
            loadExpenses();
        }
        catch(error){
            console.log("Failed deleting expense:", error);
        }
    }
    const handleUpdateExpense = async(id:number)=>{
        try{ 
            await api.put(`/expenses/${id}`, formData);
            setFormData({ amount: 0, category: "" });
            setEditingId(null);
            loadExpenses();
        }
        catch(error){
            console.log("Failed updating expense:", error);
        }
    }
    useEffect(()=>{
        const load=async()=>{
            await loadExpenses();
        }
        load();
    },[]);
return(
    <>
    <Navbar />
    <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-8">Expenses</h1>
        <button onClick={() => setShowAddForm(!showAddForm)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition mb-6">
            {showAddForm ? "Cancel" : "Add Expense"}
        </button>

{showAddForm && (
    <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Add New Expense</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-gray-700 mb-2">Amount (R)</label>
                <input
                    type="number"
                    placeholder="Amount"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
            <div>
                <label className="block text-gray-700 mb-2">Category</label>
                <input
                    type="text"
                    placeholder="Category"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>
        <button onClick={handleAddExpense} className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">Save Expense</button>
    </div>
)}
        {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">{error}</div>
        )}
        {loading ? (
            <p className="text-gray-500">Loading expenses...</p>
        ) : expenses.length === 0 ? (
            <p className="text-gray-500">No expenses yet. Add one to get started.</p>
        ) : (
            expenses.map((exp) => (
            <div key={exp.id} className="bg-white rounded-lg shadow p-4 mb-2 flex justify-between items-center">
                <p className="font-bold text-gray-800">{exp.category}</p>
                <p className=" text-gray-800">R{exp.amount}</p>
                <button onClick={()=> handleDelete(exp.id)} className="bg-red-500 text-white rounded-lg hover:bg-red-600 transition px-4 py-2">Delete</button>
                <button onClick={()=>{setEditingId(exp.id); setFormData({amount: exp.amount, category: exp.category})}} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">Edit</button>
            </div>
            ))
        )}
        {editingId !== null && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow p-6 w-full max-w-md">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Edit Expense</h3>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-gray-700 mb-2">Amount (R)</label>
                            <input type="number" value={formData.amount} onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-2">Category</label>
                            <input type="text" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                    </div>
                    <button onClick={() => handleUpdateExpense(editingId)} className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition">Save Changes</button>
                    <button onClick={() => setEditingId(null)} className="mt-4 ml-2 bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-500 transition">Cancel</button>
                </div>
            </div>
    )}
    </div>
    </>
);
}