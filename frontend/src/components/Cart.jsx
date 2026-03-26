import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { createOrder } from '../services/api'
import { useNavigate } from 'react-router-dom'

const EMPTY_FORM = {
    nombre_completo: '', direccion: '', ciudad: '',
    provincia: '', codigo_postal: '', telefono: ''
}

export default function Cart({ isOpen, onClose }) {
    const { items, total, removeFromCart, updateQty, clearCart } = useCart()
  const [paso, setPaso] = useState('carrito') // 'carrito' | 'envio' | 'loading'
    const [form, setForm] = useState(EMPTY_FORM)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const token = localStorage.getItem('maralba_token')

    const handleCheckout = () => {
    if (!token) {
        onClose()
        navigate('/login')
        return
    }
    setPaso('envio')
    }

    const handlePagar = async (e) => {
    e.preventDefault()
    setPaso('loading')
    setError('')
    try {
        const res = await createOrder({
        ...form,
        productos: items.map(i => ({
            id: i.id, nombre: i.nombre,
            precio: i.precio, qty: i.qty
        })),
        total
        })
        clearCart()
      // Redirigir a Mercado Pago
        window.location.href = res.data.mp_init_point
    } catch {
        setError('Error al procesar el pedido. Intentá de nuevo.')
        setPaso('envio')
    }
    }

    const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

    if (!isOpen) return null

    return (
    <>
        <div onClick={onClose} style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.4)',
        zIndex: 200, backdropFilter: 'blur(2px)',
        }} />

        <div style={{
        position: 'fixed', right: 0, top: 0, bottom: 0,
        width: 'min(480px, 100vw)',
        background: '#fff', zIndex: 201,
        display: 'flex', flexDirection: 'column',
        boxShadow: '-8px 0 32px rgba(0,0,0,0.12)',
        }}>
        {/* Header */}
        <div style={{
            padding: '24px 28px',
            borderBottom: '1px solid #EDE8E0',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {paso === 'envio' && (
                <button onClick={() => setPaso('carrito')} style={{
                background: 'none', border: 'none', cursor: 'pointer',
                fontSize: 20, color: 'var(--gray)'
                }}>←</button>
            )}
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400 }}>
                {paso === 'carrito' ? 'Tu carrito' : 'Datos de envío'}
            </h2>
            </div>
            <button onClick={onClose} style={{
            background: 'none', border: 'none',
            fontSize: 24, cursor: 'pointer', color: 'var(--gray)'
            }}>×</button>
        </div>

        {/* PASO: CARRITO */}
        {paso === 'carrito' && (
            <>
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 28px' }}>
                {items.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'var(--gray)', marginTop: 60 }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>💎</div>
                    <p style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>Tu carrito está vacío</p>
                </div>
                ) : (
                items.map(item => (
                    <div key={item.id} style={{
                    display: 'flex', gap: 16, marginBottom: 20,
                    paddingBottom: 20, borderBottom: '1px solid #F0EDE8',
                    }}>
                    <img
                        src={item.imagen || 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=100&q=80'}
                        alt={item.nombre}
                        style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8 }}
                    />
                    <div style={{ flex: 1 }}>
                        <p style={{ fontFamily: 'var(--font-display)', fontSize: 16, marginBottom: 4 }}>{item.nombre}</p>
                        <p style={{ color: 'var(--gold)', fontFamily: 'var(--font-display)', fontSize: 16 }}>
                        ${item.precio.toLocaleString('es-AR')}
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 8 }}>
                        <button onClick={() => updateQty(item.id, Math.max(1, item.qty - 1))}
                            style={{ background: 'var(--light-gray)', border: 'none', width: 28, height: 28, borderRadius: 4, cursor: 'pointer', fontSize: 16 }}>−</button>
                        <span style={{ fontSize: 14, minWidth: 20, textAlign: 'center' }}>{item.qty}</span>
                        <button onClick={() => updateQty(item.id, item.qty + 1)}
                            style={{ background: 'var(--light-gray)', border: 'none', width: 28, height: 28, borderRadius: 4, cursor: 'pointer', fontSize: 16 }}>+</button>
                        <button onClick={() => removeFromCart(item.id)}
                            style={{ background: 'none', border: 'none', color: 'var(--gray)', cursor: 'pointer', marginLeft: 8, fontSize: 12 }}>
                            Quitar
                        </button>
                        </div>
                    </div>
                    </div>
                ))
                )}
            </div>

            {items.length > 0 && (
                <div style={{ padding: '24px 28px', borderTop: '1px solid #EDE8E0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                    <span style={{ fontSize: 14, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: 1 }}>Total</span>
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600 }}>
                    ${total.toLocaleString('es-AR')}
                    </span>
                </div>
                <button className="btn-primary" style={{ width: '100%', padding: 16 }} onClick={handleCheckout}>
                    {token ? 'Continuar con el envío' : 'Iniciar sesión para comprar'}
                </button>
                <button onClick={clearCart} style={{
                    background: 'none', border: 'none', width: '100%', marginTop: 12,
                    fontSize: 12, color: 'var(--gray)', letterSpacing: 1,
                    textTransform: 'uppercase', cursor: 'pointer'
                }}>
                    Vaciar carrito
                </button>
                </div>
            )}
            </>
        )}

        {/* PASO: DATOS DE ENVÍO */}
        {paso === 'envio' && (
            <form onSubmit={handlePagar} style={{
            flex: 1, overflowY: 'auto',
            padding: '24px 28px',
            display: 'flex', flexDirection: 'column', gap: 14,
            }}>
            <p style={{ fontSize: 13, color: 'var(--gray)', marginBottom: 8 }}>
                Completá tus datos para recibir tu pedido
            </p>

            {[
                { name: 'nombre_completo', label: 'Nombre completo', placeholder: 'María García', type: 'text' },
                { name: 'telefono', label: 'Teléfono / WhatsApp', placeholder: '+54 9 11 1234 5678', type: 'tel' },
                { name: 'direccion', label: 'Dirección', placeholder: 'Av. Corrientes 1234, Piso 2', type: 'text' },
                { name: 'ciudad', label: 'Ciudad', placeholder: 'Buenos Aires', type: 'text' },
                { name: 'provincia', label: 'Provincia', placeholder: 'Buenos Aires', type: 'text' },
                { name: 'codigo_postal', label: 'Código postal', placeholder: '1043', type: 'text' },
            ].map(field => (
                <div key={field.name}>
                <label style={{ fontSize: 11, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--gray)', display: 'block', marginBottom: 5 }}>
                    {field.label}
                </label>
                <input
                    name={field.name}
                    type={field.type}
                    value={form[field.name]}
                    onChange={handleChange}
                    placeholder={field.placeholder}
                    required
                />
                </div>
            ))}

            {/* Resumen */}
            <div style={{
                background: 'var(--light-gray)', borderRadius: 10,
                padding: '16px', marginTop: 8
            }}>
                <p style={{ fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--gray)', marginBottom: 8 }}>
                Resumen
                </p>
                {items.map(i => (
                <div key={i.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                    <span>{i.nombre} × {i.qty}</span>
                  <span>${(i.precio * i.qty).toLocaleString('es-AR')}</span>
                </div>
                ))}
                <div style={{ borderTop: '1px solid #DDD8D0', marginTop: 10, paddingTop: 10, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 500 }}>Total</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>${total.toLocaleString('es-AR')}</span>
                </div>
            </div>

            {error && (
                <p style={{ color: 'var(--danger)', fontSize: 13, textAlign: 'center' }}>{error}</p>
            )}

            <button className="btn-gold" type="submit" style={{ padding: 16, marginTop: 4, fontSize: 14 }}>
                💳 Pagar con Mercado Pago
            </button>
            </form>
        )}

        {/* PASO: LOADING */}
        {paso === 'loading' && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
            <div style={{ fontSize: 48 }}>💎</div>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>Procesando tu pedido...</p>
            <p style={{ fontSize: 13, color: 'var(--gray)' }}>Te redirigimos a Mercado Pago</p>
            </div>
        )}
        </div>
    </>
    )
}