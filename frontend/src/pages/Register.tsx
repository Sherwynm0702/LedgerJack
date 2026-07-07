import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Wallet } from "lucide-react";

export function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      await register(email, password);
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      const errorMessage = err?.response?.data?.error || err?.message || "Registration failed. Try again.";
      setError(errorMessage);
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
            Start managing<br />your business<br />in minutes.
          </h2>
          <p className="mt-4 text-white/70 max-w-md">
            Create an account to track employees, expenses, and payroll — all in one simple dashboard.
          </p>
        </div>
        <p className="text-sm text-white/60">© {new Date().getFullYear()} LedgerJack</p>
      </div>

      {/* Form column */}
      <div className="flex items-center justify-center px-4 py-12 bg-background">
        <Card className="w-full max-w-sm border-none shadow-none">
          <CardHeader>
            <CardTitle className="text-2xl">Create account</CardTitle>
            <CardDescription>Get started with LedgerJack</CardDescription>
          </CardHeader>
          <CardContent>
            {success && (
              <div className="bg-emerald-500/10 text-emerald-600 p-3 rounded-md mb-4 text-sm">
                Registration successful! Redirecting to login...
              </div>
            )}
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
              <Button type="submit" className="w-full">Register</Button>
            </form>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Already have an account? <Link to="/login" className="text-foreground underline underline-offset-4">Login</Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
