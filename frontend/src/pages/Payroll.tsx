import {useState, useEffect} from "react";
import api from "../services/api"

interface Employee{
    id:number;
    name:string;
    salary:number;  
}

export function Payroll(){
    const [employees, setEmployees] = useState<Employee[]>([]);
    const loadEmployees = async()=>{
        try{
            const response = await api.get("/employees");
            setEmployees(response.data.employees);
        }
        catch(error){
            console.log("Failed fetching employees:", error);
        }
    }
    const handleRunPayroll=async(employeeId:number)=>{
        try{
            const response = await api.post('payroll/calculate', {employeeId});
            console.log(response.data);
            alert(response.data.message);
        }
        catch(error){
            console.log("Failed running payroll:", error);
        }
    }
    useEffect(()=>{
        const load=async()=>{
            await loadEmployees();
        }
        load();
    }, []);

    return (
        <div>
            <h1>Payroll</h1>
            {employees.map((emp)=>{
                return (
                    <div key={emp.id}>
                        <p>{emp.name} - ${emp.salary}</p>
                        <button onClick={() => handleRunPayroll(emp.id)}>Run Payroll</button>
                    </div>
                );
            })}
        </div>
    );
}