import { useState, useEffect } from "react";
import api from "../services/api"
import { Navbar } from "../components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

interface Employee{
    id:number;
    name:string;
    salary:number;
}

export function Employees(){
    const [employees,setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        salary: 0
    });
    const [editingId, setEditingId] = useState<number | null>(null);

    const fetchEmployees = async()=>{
        try{
            const response = await api.get("/employees");
            setEmployees(response.data.employees);
            setError("");
        }
        catch(error){
            setError("Failed to load employees. Please try again.");
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
    }
    const handleDeleteEmployee = async(id:number)=>{
        try{
            await api.delete(`/employees/${id}`);
            fetchEmployees();
        }
        catch(error){
            console.log('Failed deleting employee:', error);
        }
    }
    const handleUpdateEmployee = async(id:number)=>{
        try{
            await api.put(`/employees/${id}`, formData);
            setFormData({name: "", salary: 0});
            setEditingId(null);
            fetchEmployees();
        }
        catch(error){
            console.log('Failed updating employee:', error);
        }
    }
    useEffect(()=>{
        const fetch = async()=>{
            await fetchEmployees();
        }
        fetch();
    },[]);

    return(
        <>
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-semibold tracking-tight">Employees</h1>
                <Button onClick={()=>{ setFormData({name:"", salary:0}); setShowAddForm(true); }}>Add Employee</Button>
            </div>

            {error && (
                <div className="bg-destructive/10 text-destructive p-4 rounded-lg mb-4 text-sm">{error}</div>
            )}

            <Card>
                <CardContent className="p-0">
                    {loading ? (
                        <p className="text-muted-foreground p-6 text-sm">Loading employees...</p>
                    ) : employees.length === 0 ? (
                        <p className="text-muted-foreground p-6 text-sm">No employees yet. Add one to get started.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Salary</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {employees.map((emp) => (
                                    <TableRow key={emp.id}>
                                        <TableCell className="font-medium">{emp.name}</TableCell>
                                        <TableCell>R{emp.salary.toLocaleString()}</TableCell>
                                        <TableCell className="text-right space-x-2">
                                            <Button variant="outline" size="sm" onClick={()=>{ setEditingId(emp.id); setFormData({name: emp.name, salary: emp.salary}); }}>Edit</Button>
                                            <Button variant="destructive" size="sm" onClick={()=>handleDeleteEmployee(emp.id)}>Delete</Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {/* Add employee dialog */}
            <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add Employee</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div className="grid gap-2">
                            <Label htmlFor="add-name">Name</Label>
                            <Input id="add-name" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} placeholder="Enter employee name" />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="add-salary">Salary</Label>
                            <Input id="add-salary" type="number" value={formData.salary} onChange={(e)=>setFormData({...formData, salary: Number(e.target.value)})} placeholder="Enter salary" />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleAddEmployee}>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit employee dialog */}
            <Dialog open={editingId !== null} onOpenChange={(open)=>{ if(!open) setEditingId(null); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Employee</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-2">
                        <div className="grid gap-2">
                            <Label htmlFor="edit-name">Name</Label>
                            <Input id="edit-name" value={formData.name} onChange={(e)=>setFormData({...formData, name: e.target.value})} />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="edit-salary">Salary</Label>
                            <Input id="edit-salary" type="number" value={formData.salary} onChange={(e)=>setFormData({...formData, salary: Number(e.target.value)})} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={()=>{ if(editingId !== null) handleUpdateEmployee(editingId); }}>Update</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
        </>
    );
}
