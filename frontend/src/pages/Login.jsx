import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
)

const ADMIN_EMAIL = 'nicolas.agustin.y@gmail.com' // ← cambiá esto por tu email

export default function Login() {
    const navigate = useNavigate()
  const [modo, setModo] = useState('login') // 'login' o 'registro'
    const [form, setForm] = useState({ email: '', password: '', nombre: '' })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
        if (modo === 'registro') {
        // Crear cuenta nueva
        const { error } = await supabase.auth.signUp({
            email: form.email,
            password: form.password,
            options: { data: { nombre: form.nombre } }
        })
        if (error) throw error
        alert('¡Cuenta creada! Ya podés iniciar sesión.')
        setModo('login')
        } else {
        // Login
        const { data, error } = await supabase.auth.signInWithPassword({
            email: form.email,
            password: form.password
        })
        if (error) throw error

        // Guardar token
        localStorage.setItem('maralba_token', data.session.access_token)
        localStorage.setItem('maralba_user', JSON.stringify(data.user))

        // Si es admin → panel admin, si no → tienda
        if (form.email === ADMIN_EMAIL) {
            navigate('/admin')
        } else {
            navigate('/')
        }
        }
    } catch (err) {
        setError(err.message || 'Error al iniciar sesión')
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
        maxWidth: 420,
        boxShadow: 'var(--shadow)',
        }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 600, letterSpacing: 3 }}>
            MARALBA
            </h1>
            <span style={{ fontSize: 10, letterSpacing: 4, color: 'var(--gold)', textTransform: 'uppercase' }}>
            Bijouterie
            </span>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', marginBottom: 32, borderBottom: '1px solid #EDE8E0' }}>
            {['login', 'registro'].map(m => (
            <button key={m} onClick={() => setModo(m)} style={{
                flex: 1,
                background: 'none',
                border: 'none',
                padding: '12px',
                fontSize: 13,
                letterSpacing: 1,
                textTransform: 'uppercase',
                cursor: 'pointer',
                color: modo === m ? 'var(--charcoal)' : 'var(--gray)',
                borderBottom: modo === m ? '2px solid var(--charcoal)' : '2px solid transparent',
                marginBottom: -1,
                transition: 'all 0.2s',
            }}>
                {m === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
            </button>
            ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {modo === 'registro' && (
            <div>
                <label style={{ fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--gray)', display: 'block', marginBottom: 6 }}>
                Nombre completo
                </label>
                <input
                type="text"
                value={form.nombre}
                onChange={e => setForm({ ...form, nombre: e.target.value })}
                placeholder="María García"
                required
                />
            </div>
            )}

            <div>
            <label style={{ fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--gray)', display: 'block', marginBottom: 6 }}>
                Email
            </label>
            <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="tu@email.com"
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
                minLength={6}
            />
            </div>

            {error && (
            <p style={{ color: 'var(--danger)', fontSize: 13, textAlign: 'center', background: '#FEF2F2', padding: '10px', borderRadius: 8 }}>
                {error}
            </p>
            )}

            <button className="btn-primary" type="submit" style={{ padding: '16px', marginTop: 8 }} disabled={loading}>
            {loading ? 'Cargando...' : modo === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
            </button>
        </form>
        </div>
    </main>
    )
}