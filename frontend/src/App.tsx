import {BrowserRouter ,Routes, Route} from 'react-router-dom';
import {AuthProvider} from './contexts/AuthContext';
import {Login} from './pages/Login';
import {Register} from './pages/Register';
import { ProtectedRoute } from './components/ProtectedRoute';
import {Dashboard} from './pages/Dashboard';
 

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={ <ProtectedRoute><Dashboard /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;