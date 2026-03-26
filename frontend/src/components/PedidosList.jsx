import { useState, useEffect } from 'react'
import { getOrders } from '../services/api'

const ESTADO_COLOR = {
    pendiente: '#F59E0B',
    pagado: '#10B981',
    enviado: '#3B82F6',
    cancelado: '#EF4444',
}

export default function PedidosList() {
    const [pedidos, setPedidos] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
    getOrders()
        .then(r => setPedidos(r.data))
        .catch(console.error)
        .finally(() => setLoading(false))
    }, [])

    if (loading) return <p style={{ color: 'var(--gray)' }}>Cargando pedidos...</p>
    if (pedidos.length === 0) return <p style={{ color: 'var(--gray)' }}>No hay pedidos todavía.</p>

    return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {pedidos.map(p => (
        <div key={p.id} style={{
            background: '#fff', borderRadius: 12,
            padding: '20px 24px', boxShadow: 'var(--shadow)',
        }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <div>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>{p.nombre_completo}</p>
                <p style={{ fontSize: 13, color: 'var(--gray)' }}>{p.usuario_email}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
                <span style={{
                background: ESTADO_COLOR[p.estado] + '20',
                color: ESTADO_COLOR[p.estado],
                padding: '4px 12px', borderRadius: 100,
                fontSize: 12, fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1,
                }}>
                {p.estado}
                </span>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginTop: 4 }}>
                ${Number(p.total).toLocaleString('es-AR')}
                </p>
            </div>
            </div>

          {/* Dirección */}
            <div style={{
            background: 'var(--light-gray)', borderRadius: 8,
            padding: '10px 14px', marginBottom: 12,
            fontSize: 13, color: 'var(--charcoal)', lineHeight: 1.7,
            }}>
            📍 {p.direccion}, {p.ciudad}, {p.provincia} ({p.codigo_postal})<br />
            📱 {p.telefono}
            </div>

          {/* Productos */}
            <div style={{ fontSize: 13, color: 'var(--gray)' }}>
            {p.productos.map((item, i) => (
                <span key={i}>
                {item.nombre} × {item.qty}
                {i < p.productos.length - 1 ? ' · ' : ''}
                </span>
            ))}
            </div>

            <p style={{ fontSize: 11, color: 'var(--gray)', marginTop: 10, letterSpacing: 1 }}>
            {new Date(p.creado_en).toLocaleDateString('es-AR', {
                day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
            })}
            </p>
        </div>
        ))}
    </div>
    )
}