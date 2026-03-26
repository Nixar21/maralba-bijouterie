import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/api'

export default function Login() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: '', password: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
        const res = await login(form.email, form.password)
        localStorage.setItem('maralba_token', res.data.token)
        navigate('/admin')
    } catch {
        setError('Email o contraseña incorrectos')
    } finally {
        setLoading(false)
    }
    }

    return (
    <main style={{
        minHeight: 'calc(100vh - 72px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    }}>
        <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: '48px 40px',
        width: '100%',
        maxWidth: 400,
        boxShadow: 'var(--shadow)',
        }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 400, marginBottom: 8 }}>
            Panel Admin
        </h1>
        <p style={{ color: 'var(--gray)', fontSize: 14, marginBottom: 32 }}>
            Ingresá con tu cuenta de administrador
        </p>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
            <label style={{ fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--gray)', display: 'block', marginBottom: 6 }}>
                Email
            </label>
            <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="admin@maralba.com"
                required
            />
            </div>
            <div>
            <label style={{ fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--gray)', display: 'block', marginBottom: 6 }}>
                Contraseña
            </label>
            <input
                type="password"
                value={form.password}
                onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                required
            />
            </div>

            {error && (
            <p style={{ color: 'var(--danger)', fontSize: 13, textAlign: 'center' }}>{error}</p>
            )}

            <button className="btn-primary" type="submit" style={{ padding: '16px', marginTop: 8 }} disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
            </button>
        </form>
        </div>
    </main>
    )
}