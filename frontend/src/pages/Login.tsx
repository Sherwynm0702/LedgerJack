import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

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
        <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg">
            <h1 className="text-2xl font-bold mb-6">Login</h1>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="email">Email:</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
                </div>
                <div className="mb-4">
                    <label htmlFor="password">Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required/>
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg">Login</button>
            </form>
            <p className="mt-4 text-center">Don't have an account? <a href="/register" className="text-blue-500">Register</a></p>
        </div>
    )

}
