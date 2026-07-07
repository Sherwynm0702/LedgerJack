import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
    { label: "Dashboard", path: "/dashboard" },
    { label: "Employees", path: "/employees" },
    { label: "Expenses", path: "/expenses" },
    { label: "Payroll", path: "/payroll" },
];

export function Navbar(){
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const handleLogout = () => {
        logout();
        navigate('/login');
    }
    return (
        <header className="border-b bg-card">
            <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <span className="font-semibold text-lg tracking-tight">LedgerJack</span>
                    <nav className="flex items-center gap-1">
                        {links.map((link) => (
                            <button
                                key={link.path}
                                onClick={() => navigate(link.path)}
                                className={cn(
                                    "px-3 py-1.5 rounded-md text-sm font-medium transition-colors",
                                    location.pathname === link.path
                                        ? "bg-secondary text-secondary-foreground"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                                )}
                            >
                                {link.label}
                            </button>
                        ))}
                    </nav>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground hidden sm:inline">{user?.email}</span>
                    <Button variant="outline" size="sm" onClick={handleLogout}>Logout</Button>
                </div>
            </div>
        </header>
    );
}
