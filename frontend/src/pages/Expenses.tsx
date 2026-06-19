import {useState, useEffect} from "react";
import api from "../services/api"
interface Expense{
    id:number;
    amount:number;
    category:string;
}
export function Expenses(){
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        amount: 0,
        category: ""
    });
    const loadExpenses = async()=>{
        try{
            const response = await api.get("/expenses");
            setExpenses(response.data.expenses);
        }
        catch(error){
            console.log("Failed fetching expenses:", error);
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
    useEffect(()=>{
        const load=async()=>{
            await loadExpenses();
        }
        load();
    },[]);
return(
    <div>
        <h1>Expenses</h1>
        <button onClick={() => setShowAddForm(!showAddForm)}>
            {showAddForm ? "Cancel" : "Add Expense"}
        </button>

        {showAddForm && (
            <div>
                <input
                    type="number"
                    placeholder="Amount"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: Number(e.target.value)})}
                />
                <input
                    type="text"
                    placeholder="Category"
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                />
                <button onClick={handleAddExpense}>Save</button>
            </div>
        )}
        {expenses.map((exp) => (
            <div key={exp.id}>
                <p>{exp.category}</p>
                <p>R{exp.amount}</p>
                <button onClick={()=> handleDelete(exp.id)}>Delete</button>
            </div>
        ))}
    </div>
);
}