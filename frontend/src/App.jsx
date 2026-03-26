import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import ProductDetail from './pages/ProductDetail'
import AdminPanel from './pages/AdminPanel'
import Login from './pages/Login'
import ProtectedRoute from './components/ProtectedRoute'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/producto/:id" element={<ProductDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={
          <ProtectedRoute>
            <AdminPanel />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  )
}