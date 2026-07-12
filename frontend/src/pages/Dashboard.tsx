import {useState, useEffect} from "react";
import api from "../services/api"
import { Navbar } from "../components/Navbar";
import {useNavigate} from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Wallet, FileText, UserPlus, ReceiptText, PlayCircle } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
    total: { label: "Amount (R)", color: "#6366f1" },
} satisfies ChartConfig;

export function Dashboard() {
    const [ employeeCount, setEmployeeCount ] = useState(0);
    const [expenseTotal, setExpenseTotal] = useState(0);
    const [payrollCount, setPayrollCount] = useState(0);
    const [categoryData, setCategoryData] = useState<{ category: string; total: number }[]>([]);
    const navigate = useNavigate();

    const loadStats = async()=>{
        try
        {
            const response = await api.get("/employees");
            setEmployeeCount(response.data.count);

            const expenseResponse = await api.get("/expenses");
            const expenses = expenseResponse.data.expenses;
            const total = expenses.reduce((sum: number, exp: { amount: number }) => sum + exp.amount, 0);
            setExpenseTotal(total);

            // Group expenses by category for the chart
            const byCategory: Record<string, number> = {};
            for (const exp of expenses) {
                byCategory[exp.category] = (byCategory[exp.category] || 0) + exp.amount;
            }
            setCategoryData(Object.entries(byCategory).map(([category, total]) => ({ category, total })));

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
    { label: "Total Employees", value: employeeCount, icon: Users, tint: "bg-blue-500/10 text-blue-600", accent: "border-t-blue-500" },
    { label: "Total Expenses", value: `R${expenseTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: Wallet, tint: "bg-emerald-500/10 text-emerald-600", accent: "border-t-emerald-500" },
    { label: "Payroll Records", value: payrollCount, icon: FileText, tint: "bg-violet-500/10 text-violet-600", accent: "border-t-violet-500" },
];

    const actions = [
        { title: "Add Employee", description: "Add a new employee", path: "/employees", icon: UserPlus, tint: "bg-blue-500/10 text-blue-600", openAdd: true },
        { title: "Log Expense", description: "Record a new expense", path: "/expenses", icon: ReceiptText, tint: "bg-emerald-500/10 text-emerald-600", openAdd: true },
        { title: "Run Payroll", description: "Process employee payroll", path: "/payroll", icon: PlayCircle, tint: "bg-violet-500/10 text-violet-600", openAdd: false },
    ];

    return (
        <div className="min-h-screen">
            <Navbar />
            <main className="max-w-5xl mx-auto px-4 py-6">
                <h1 className="text-3xl font-semibold tracking-tight mb-5">Dashboard</h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {stats.map((stat) => (
                        <Card key={stat.label} className={`border-t-4 ${stat.accent}`}>
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {actions.map((action) => (
                        <Card
                            key={action.path}
                            onClick={() => navigate(action.path, { state: { openAdd: action.openAdd } })}
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

                <Card>
                    <CardHeader>
                        <CardTitle>Expenses by Category</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {categoryData.length === 0 ? (
                            <p className="text-sm text-muted-foreground">No expense data yet.</p>
                        ) : (
                            <ChartContainer config={chartConfig} className="h-48 w-full">
                                <BarChart data={categoryData}>
                                    <CartesianGrid vertical={false} />
                                    <XAxis dataKey="category" tickLine={false} axisLine={false} tickMargin={8} />
                                    <ChartTooltip content={<ChartTooltipContent />} />
                                    <Bar dataKey="total" fill="var(--color-total)" radius={6} maxBarSize={72} />
                                </BarChart>
                            </ChartContainer>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
