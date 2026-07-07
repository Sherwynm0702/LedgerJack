import {useState, useEffect} from "react";
import api from "../services/api"
import { Navbar } from "../components/Navbar";
import {useNavigate} from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Wallet, FileText, UserPlus, ReceiptText, PlayCircle } from "lucide-react";

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

    const stats = [
        { label: "Total Employees", value: employeeCount, icon: Users, tint: "bg-blue-500/10 text-blue-600" },
        { label: "Total Expenses", value: `R${expenseTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: Wallet, tint: "bg-emerald-500/10 text-emerald-600" },
        { label: "Payroll Records", value: payrollCount, icon: FileText, tint: "bg-violet-500/10 text-violet-600" },
    ];

    const actions = [
        { title: "Add Employee", description: "Add a new employee", path: "/employees", icon: UserPlus, tint: "bg-blue-500/10 text-blue-600" },
        { title: "Log Expense", description: "Record a new expense", path: "/expenses", icon: ReceiptText, tint: "bg-emerald-500/10 text-emerald-600" },
        { title: "Run Payroll", description: "Process employee payroll", path: "/payroll", icon: PlayCircle, tint: "bg-violet-500/10 text-violet-600" },
    ];

    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="max-w-5xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-semibold tracking-tight mb-6">Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    {stats.map((stat) => (
                        <Card key={stat.label} className="relative overflow-hidden">
                            <CardContent className="flex items-center justify-between p-6">
                                <div>
                                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                                    <p className="text-3xl font-semibold mt-1">{stat.value}</p>
                                </div>
                                <div className={`rounded-xl p-3 ${stat.tint}`}>
                                    <stat.icon className="size-6" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <h2 className="text-xl font-semibold tracking-tight mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {actions.map((action) => (
                        <Card
                            key={action.path}
                            onClick={() => navigate(action.path)}
                            className="cursor-pointer transition-colors hover:bg-muted/50"
                        >
                            <CardContent className="flex items-center gap-4 p-6">
                                <div className={`rounded-xl p-3 ${action.tint}`}>
                                    <action.icon className="size-6" />
                                </div>
                                <div>
                                    <p className="font-medium">{action.title}</p>
                                    <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
