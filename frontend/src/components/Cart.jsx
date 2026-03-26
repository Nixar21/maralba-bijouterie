import { useCart } from '../context/CartContext'

export default function Cart({ isOpen, onClose }) {
    const { items, total, removeFromCart, updateQty, clearCart } = useCart()

    const handleCheckout = () => {
    alert('¡Gracias por tu compra! 💎\nEn breve nos comunicamos para coordinar el pago y envío.')
    clearCart()
    onClose()
    }

    if (!isOpen) return null

    return (
    <>
      {/* Overlay */}
        <div onClick={onClose} style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.4)',
        zIndex: 200,
        backdropFilter: 'blur(2px)',
        }} />

      {/* Panel */}
        <div style={{
        position: 'fixed', right: 0, top: 0, bottom: 0,
        width: 'min(420px, 100vw)',
        background: '#fff',
        zIndex: 201,
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '-8px 0 32px rgba(0,0,0,0.12)',
        }}>
        {/* Header */}
        <div style={{
            padding: '24px 28px',
            borderBottom: '1px solid #EDE8E0',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400 }}>
            Tu carrito
            </h2>
            <button onClick={onClose} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', color: 'var(--gray)' }}>
            ×
            </button>
        </div>

        {/* Items */}
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
                    style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8, background: 'var(--light-gray)' }}
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
                        style={{ background: 'none', border: 'none', color: 'var(--gray)', cursor: 'pointer', marginLeft: 8, fontSize: 12, letterSpacing: 1 }}>
                        Quitar
                    </button>
                    </div>
                </div>
                </div>
            ))
            )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
            <div style={{ padding: '24px 28px', borderTop: '1px solid #EDE8E0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
                <span style={{ fontSize: 14, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: 1 }}>Total</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600 }}>
                ${total.toLocaleString('es-AR')}
                </span>
            </div>
            <button className="btn-primary" style={{ width: '100%', padding: '16px', fontSize: 13 }} onClick={handleCheckout}>
                Realizar pedido
            </button>
            <button onClick={clearCart} style={{
                background: 'none', border: 'none', width: '100%', marginTop: 12,
                fontSize: 12, color: 'var(--gray)', letterSpacing: 1, textTransform: 'uppercase', cursor: 'pointer'
            }}>
                Vaciar carrito
            </button>
            </div>
        )}
        </div>
    </>
    )
}