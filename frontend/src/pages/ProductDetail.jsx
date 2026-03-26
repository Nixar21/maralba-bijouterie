import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProduct } from '../services/api'
import { useCart } from '../context/CartContext'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=600&q=80'

export default function ProductDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { addToCart } = useCart()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [added, setAdded] = useState(false)

    useEffect(() => {
    getProduct(id)
        .then(res => setProduct(res.data))
        .catch(() => navigate('/'))
        .finally(() => setLoading(false))
    }, [id])

    const handleAdd = () => {
    addToCart(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
    }

    if (loading) return <div className="loading">Cargando...</div>
    if (!product) return null

    return (
    <main style={{ padding: '60px 24px' }}>
        <div className="container">
        <button onClick={() => navigate(-1)} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontSize: 13, letterSpacing: 1, textTransform: 'uppercase',
            color: 'var(--gray)', marginBottom: 40, display: 'flex', alignItems: 'center', gap: 8,
        }}>
            ← Volver
        </button>

        <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 60,
            alignItems: 'start',
        }}>
          {/* Imagen */}
            <div style={{ borderRadius: 16, overflow: 'hidden', background: 'var(--light-gray)' }}>
            <img
                src={product.imagen || PLACEHOLDER}
                alt={product.nombre}
                style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }}
            />
            </div>

          {/* Info */}
            <div>
            <span style={{ fontSize: 11, color: 'var(--gold)', letterSpacing: 3, textTransform: 'uppercase' }}>
                {product.categoria}
            </span>
            <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 42,
                fontWeight: 400,
                margin: '12px 0 20px',
                lineHeight: 1.1,
            }}>{product.nombre}</h1>

            <p style={{ fontSize: 15, color: 'var(--gray)', lineHeight: 1.8, marginBottom: 32 }}>
                {product.descripcion}
            </p>

            <div style={{ marginBottom: 32 }}>
                <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: 40,
                fontWeight: 600,
                }}>
                ${product.precio.toLocaleString('es-AR')}
                </span>
            </div>

            <p style={{ fontSize: 12, color: product.stock > 0 ? 'green' : 'var(--danger)', marginBottom: 24, letterSpacing: 1 }}>
                {product.stock > 0 ? `Stock disponible: ${product.stock} unidades` : 'Sin stock'}
            </p>

            <button
                className="btn-primary"
                style={{ width: '100%', padding: '18px', fontSize: 13, background: added ? 'var(--gold)' : undefined }}
                onClick={handleAdd}
                disabled={product.stock === 0}
            >
                {added ? '✓ Agregado al carrito' : 'Agregar al carrito'}
            </button>
            </div>
        </div>
        </div>
    </main>
    )
}