import { useState, useEffect } from "react";
import api from "../services/api"

interface Employee{
        id:number;
        name:string;
        salary:number;
}
export function Employees(){
    const [employees,setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        salary: 0
    });


    const fetchEmployees = async()=>{
        try{
            const response = await api.get("/employees");
            setEmployees(response.data.employees);
        }
        catch(error:any){
            console.error("Error fetching employees:", error);
        }
        finally{
            setLoading(false);
        }
    }
    const handleAddEmployee = async()=>{
        try{
            await api.post('/employees', formData);
            setFormData({name: "", salary: 0});
            setShowAddForm(false);
            fetchEmployees();
        }
        catch(error){
            console.log('Failed adding employee:', error);
        }
        finally{
            setLoading(false);
        }
    }
    useEffect(()=>{
        const fetch = async()=>{
            await fetchEmployees();
        }
        fetch();
    },[]);
    
    return(
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Employees</h1>
            <button onClick={()=>setShowAddForm(!showAddForm)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition mb-6">
                {showAddForm ? "Cancel" : "Add Employee"}
            </button>
            {showAddForm && (
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">Add new employee</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                        <label className="block text-gray-700 mb-2">Name</label>
                        <input type="text" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter employee name" />
                    </div>
                    <div>
                        <label className="block text-gray-700 mb-2">Salary</label>
                        <input type="number" value={formData.salary} onChange={(e)=>setFormData({...formData, salary: Number(e.target.value)})} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter employee salary" />
                    </div>
                    </div>
                    <button onClick={handleAddEmployee} className="mt-4 bg-green-600 text-white px-4 py-2 hover:bg-green-700 transition">Save</button>
                </div>
            )}
            {employees.map((emp) => (
            <div key={emp.id} className="bg-white rounded-lg shadow p-4 mb-2">
                <p className="font-bold">{emp.name}</p>
                <p className="text-gray-600">R{emp.salary}</p>
            </div>
            ))}
        </div>
    );
}

