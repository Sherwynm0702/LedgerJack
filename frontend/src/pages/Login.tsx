import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Wallet } from "lucide-react";

export function Login(){
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const {login} = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.SyntheticEvent)=>{
        e.preventDefault();
        try{
            await login(email, password);
            navigate('/dashboard');
        }
        catch(err){
            setError('Login failed. Check your credentials.');
        }
    };
    return (
        <div className="min-h-screen grid lg:grid-cols-2">
            {/* Branded panel */}
            <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-violet-600 via-indigo-600 to-blue-600 p-12 text-white">
                <div className="flex items-center gap-2">
                    <Wallet className="size-6" />
                    <span className="text-xl font-semibold tracking-tight">LedgerJack</span>
                </div>
                <div>
                    <h2 className="text-4xl font-semibold leading-tight tracking-tight">
                        Manage your team,<br />expenses & payroll<br />in one place.
                    </h2>
                    <p className="mt-4 text-white/70 max-w-md">
                        A simple, modern business management dashboard for tracking employees, expenses, and payroll.
                    </p>
                </div>
                <p className="text-sm text-white/60">© {new Date().getFullYear()} LedgerJack</p>
            </div>

            {/* Form column */}
            <div className="flex items-center justify-center px-4 py-12 bg-background">
                <Card className="w-full max-w-sm border-none shadow-none">
                    <CardHeader>
                        <CardTitle className="text-2xl">Welcome back</CardTitle>
                        <CardDescription>Sign in to your account</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {error && (
                            <div className="bg-destructive/10 text-destructive p-3 rounded-md mb-4 text-sm">{error}</div>
                        )}
                        <form onSubmit={handleSubmit} className="grid gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                            </div>
                            <Button type="submit" className="w-full">Login</Button>
                        </form>
                        <p className="mt-4 text-center text-sm text-muted-foreground">
                            Don't have an account? <Link to="/register" className="text-foreground underline underline-offset-4">Register</Link>
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
