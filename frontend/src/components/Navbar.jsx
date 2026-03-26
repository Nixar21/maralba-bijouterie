import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import Cart from './Cart'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    import.meta.env.VITE_SUPABASE_URL,
    import.meta.env.VITE_SUPABASE_ANON_KEY
)

const ADMIN_EMAIL = 'nicolas.agustin.y@gmail.com' // ← mismo email que en Login.jsx

export default function Navbar() {
    const { count } = useCart()
    const [cartOpen, setCartOpen] = useState(false)
    const navigate = useNavigate()

    const token = localStorage.getItem('maralba_token')
    const user = JSON.parse(localStorage.getItem('maralba_user') || 'null')
    const isAdmin = user?.email === ADMIN_EMAIL

    const handleLogout = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('maralba_token')
    localStorage.removeItem('maralba_user')
    navigate('/')
    window.location.reload()
    }

    return (
    <>
        <nav style={{
        background: '#fff',
        borderBottom: '1px solid #EDE8E0',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        padding: '0 24px',
        }}>
        <div style={{
            maxWidth: 1200,
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: 72,
        }}>
          {/* Logo */}
            <Link to="/" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 28,
                fontWeight: 600,
                letterSpacing: 3,
                color: 'var(--charcoal)',
            }}>MARALBA</span>
            <span style={{
                fontSize: 10,
                letterSpacing: 4,
                color: 'var(--gold)',
                textTransform: 'uppercase',
                marginTop: 2,
            }}>Bijouterie</span>
            </Link>

          {/* Nav links */}
            <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
            <Link to="/" style={{ fontSize: 13, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--gray)' }}>
                Tienda
            </Link>

            {token ? (
                <>
                {isAdmin && (
                    <Link to="/admin" style={{ fontSize: 13, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--gold)' }}>
                    Panel
                    </Link>
                )}
                <span style={{ fontSize: 13, color: 'var(--gray)' }}>
                    {user?.user_metadata?.nombre || user?.email}
                </span>
                <button onClick={handleLogout} style={{
                    background: 'none', border: 'none', fontSize: 13,
                    letterSpacing: 1, textTransform: 'uppercase',
                    color: 'var(--gray)', cursor: 'pointer'
                }}>Salir</button>
                </>
            ) : (
                <Link to="/login" style={{
                fontSize: 13, letterSpacing: 1,
                textTransform: 'uppercase', color: 'var(--charcoal)',
                border: '1.5px solid var(--charcoal)',
                padding: '8px 18px', borderRadius: 6,
                }}>
                Iniciar sesión
                </Link>
            )}

            {/* Carrito */}
            <button onClick={() => setCartOpen(true)} style={{
                background: 'none', border: 'none', position: 'relative',
                display: 'flex', alignItems: 'center', gap: 6,
                fontSize: 13, letterSpacing: 1, cursor: 'pointer',
            }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <path d="M16 10a4 4 0 01-8 0"/>
                </svg>
                {count > 0 && (
                <span style={{
                    position: 'absolute', top: -8, right: -8,
                    background: 'var(--gold)', color: '#fff',
                    borderRadius: '50%', width: 18, height: 18,
                    fontSize: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{count}</span>
                )}
            </button>
            </div>
        </div>
        </nav>

        <Cart isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
    )
}