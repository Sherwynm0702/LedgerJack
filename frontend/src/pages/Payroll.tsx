import {useState, useEffect} from "react";
import api from "../services/api"
import { Navbar } from "../components/Navbar";

interface Employee{
    id:number;
    name:string;
    salary:number;  
}
interface PayrollRecord{
    id:number;
    amount:number;
    date:string;
    employee: {name:string};
}

export function Payroll(){
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([]);
    const loadEmployees = async()=>{
        try{
            const response = await api.get("/employees");
            setEmployees(response.data.employees);
        }
        catch(error){
            console.log("Failed fetching employees:", error);
        }
    }
        const loadPayrollRecords = async()=>{
        try{
            const response = await api.get('/payroll/records');
            setPayrollRecords(response.data.payrollRecords);
        }
        catch(error)
        {
            console.log("Failed fetching payroll records:", error); 
        }
    }
    const handleRunPayroll=async(employeeId:number)=>{
        try{
            const response = await api.post('/payroll/calculate', {employeeId});
            console.log(response.data);
            alert(response.data.message);
            loadPayrollRecords();
        }
        catch(error){
            console.log("Failed running payroll:", error);
        }
    }
    useEffect(()=>{
        const load=async()=>{
            await loadEmployees();
            await loadPayrollRecords();
        }
        load();
    }, []);

    return (
        <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-4  py-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">Payroll</h1>
            {employees.map((emp)=>{
                return (
                    <div key={emp.id} className='bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-center'>
                        <p className="font-bold">{emp.name} - R{emp.salary}</p>
                        <button onClick={() => handleRunPayroll(emp.id)} className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition">Run Payroll</button>
                    </div>
                );
            })}
            <h2 className="text-xl font-semibold text-gray-800 mt-8 mb-4">Payroll Records</h2>
            {payrollRecords.map((record)=>{
                return (
                    <div key={record.id} className="bg-white rounded-lg shadow p-4 mb-2">
                        <p className="text-gray-800">{record.employee.name} - R{record.amount} - <span className="text-gray-500 text-sm">{new Date(record.date).toLocaleDateString()}</span></p>
                    </div>
                );
            })}
        </div>
        </>
    );
}