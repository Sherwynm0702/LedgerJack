import {useState, useEffect} from "react";
import api from "../services/api"
import { Navbar } from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const loadEmployees = async()=>{
        try{
            const response = await api.get("/employees");
            setEmployees(response.data.employees);
        }
        catch(error){
            setError("Failed to load payroll data. Please try again.");
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
            await api.post('/payroll/calculate', {employeeId});
            toast.success("Payroll processed");
            loadPayrollRecords();
        }
        catch(error){
            toast.error("Failed to run payroll");
        }
    }
    useEffect(()=>{
        const load=async()=>{
            await loadEmployees();
            await loadPayrollRecords();
            setLoading(false);
        }
        load();
    }, []);

    return (
        <>
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-semibold tracking-tight mb-6">Payroll</h1>

            {error && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-4 text-sm">{error}</div>
            )}

            <Card className="mb-8">
                <CardContent className="p-0">
                    {loading ? (
                        <p className="text-muted-foreground p-6 text-sm">Loading payroll...</p>
                    ) : employees.length === 0 ? (
                        <p className="text-muted-foreground p-6 text-sm">No employees yet. Add employees before running payroll.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Salary</TableHead>
                                    <TableHead className="text-right">Action</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {employees.map((emp)=>(
                                    <TableRow key={emp.id}>
                                        <TableCell className="font-medium">{emp.name}</TableCell>
                                        <TableCell>R{emp.salary.toLocaleString()}</TableCell>
                                        <TableCell className="text-right">
                                            <Button size="sm" onClick={() => handleRunPayroll(emp.id)}>Run Payroll</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            <h2 className="text-xl font-semibold tracking-tight mb-4">Payroll Records</h2>
            <Card>
                <CardContent className="p-0">
                    {!loading && payrollRecords.length === 0 ? (
                        <p className="text-muted-foreground p-6 text-sm">No payroll records yet.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Employee</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead className="text-right">Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payrollRecords.map((record)=>(
                                    <TableRow key={record.id}>
                                        <TableCell className="font-medium">{record.employee.name}</TableCell>
                                        <TableCell>R{record.amount.toLocaleString()}</TableCell>
                                        <TableCell className="text-right text-muted-foreground">{new Date(record.date).toLocaleDateString()}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
        </>
    );
}
