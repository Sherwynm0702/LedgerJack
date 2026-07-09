import {useState, useEffect} from "react";
import api from "../services/api"
import { Navbar } from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {toast} from "sonner";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

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
            toast.success("Expense added");
        }
        catch(error){
            toast.error("Failed to add expense");
        }
    }
    const handleDelete = async(id:number)=>{
        try{
            await api.delete(`/expenses/${id}`);
            loadExpenses();
            toast.success("Expense deleted");
        }
        catch(error){
            toast.error("Failed to delete expense");
        }
    }
    const handleUpdateExpense = async(id:number)=>{
        try{
            await api.put(`/expenses/${id}`, formData);
            setFormData({ amount: 0, category: "" });
            setEditingId(null);
            loadExpenses();
            toast.success("Expense updated");
        }
        catch(error){
            toast.error("Failed to update expense");
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
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-semibold tracking-tight">Expenses</h1>
                <Button onClick={()=>{ setFormData({amount:0, category:""}); setShowAddForm(true); }}>Add Expense</Button>
            </div>

            {error && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-4 text-sm">{error}</div>
            )}

            <Card>
                <CardContent className="p-0">
                    {loading ? (
                        <p className="text-muted-foreground p-6 text-sm">Loading expenses...</p>
                    ) : expenses.length === 0 ? (
                        <p className="text-muted-foreground p-6 text-sm">No expenses yet. Add one to get started.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Category</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {expenses.map((exp) => (
                                    <TableRow key={exp.id}>
                                        <TableCell className="font-medium">{exp.category}</TableCell>
                                        <TableCell>R{exp.amount.toLocaleString()}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="outline" size="sm" onClick={()=>{ setEditingId(exp.id); setFormData({amount: exp.amount, category: exp.category}); }}>Edit</Button>
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="destructive" size="sm">Delete</Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle>Delete this expense?</AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This will permanently remove the "{exp.category}" expense. This can't be undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                        <AlertDialogAction onClick={()=>handleDelete(exp.id)}>Delete</AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Add expense dialog */}
            <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Expense</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div className="grid gap-2">
                            <Label htmlFor="add-amount">Amount (R)</Label>
                            <Input id="add-amount" type="number" value={formData.amount} onChange={(e)=>setFormData({...formData, amount: Number(e.target.value)})} placeholder="Enter amount" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="add-category">Category</Label>
                            <Input id="add-category" value={formData.category} onChange={(e)=>setFormData({...formData, category: e.target.value})} placeholder="Enter category" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleAddExpense}>Save Expense</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit expense dialog */}
            <Dialog open={editingId !== null} onOpenChange={(open)=>{ if(!open) setEditingId(null); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Expense</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-amount">Amount (R)</Label>
                            <Input id="edit-amount" type="number" value={formData.amount} onChange={(e)=>setFormData({...formData, amount: Number(e.target.value)})} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-category">Category</Label>
                            <Input id="edit-category" value={formData.category} onChange={(e)=>setFormData({...formData, category: e.target.value})} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={()=>{ if(editingId !== null) handleUpdateExpense(editingId); }}>Save Changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
        </>
    );
}
