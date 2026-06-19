import {BrowserRouter ,Routes, Route} from 'react-router-dom';
import {AuthProvider} from './contexts/AuthContext';
import {Login} from './pages/Login';
import {Register} from './pages/Register';
import { ProtectedRoute } from './components/ProtectedRoute';
import {Dashboard} from './pages/Dashboard';
import {Employees} from './pages/Employees';
import {Expenses} from './pages/Expenses';
import {Payroll} from './pages/Payroll';
 

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={ <ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/employees" element={ <ProtectedRoute><Employees /></ProtectedRoute>} />
          <Route path="/expenses" element={ <ProtectedRoute><Expenses /></ProtectedRoute>}/>
          <Route path="/payroll" element={ <ProtectedRoute><Payroll /></ProtectedRoute>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;