import { useState, useEffect } from "react";
import api from "../services/api"

export function Employees(){
    const [employees,setEmployees] = useState<[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        salary: 0
    });

    const fetchEmployees = async()=>{
        try{
            const response = await api.get("/employees");
            setEmployees(response.data);
        }
        catch(error:any){
            console.error("Error fetching employees:", error);
        }
        finally{
            setLoading(false);
        }
    }
    
    useEffect(()=>{
        fetchEmployees();
    },[]);
    
    return(
        <div className="max-w-7xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Employees</h1>
        </div>
    );

}
