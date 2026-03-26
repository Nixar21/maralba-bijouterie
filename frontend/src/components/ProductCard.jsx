import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'

const PLACEHOLDER = 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=400&q=80'

export default function ProductCard({ product }) {
    const { addToCart } = useCart()

    return (
    <div style={{
        background: '#fff',
        borderRadius: 'var(--radius)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow)',
        transition: 'box-shadow var(--transition), transform var(--transition)',
        display: 'flex',
        flexDirection: 'column',
    }}
    onMouseEnter={e => { e.currentTarget.style.boxShadow = 'var(--shadow-hover)'; e.currentTarget.style.transform = 'translateY(-4px)' }}
    onMouseLeave={e => { e.currentTarget.style.boxShadow = 'var(--shadow)'; e.currentTarget.style.transform = 'translateY(0)' }}
    >
        <Link to={`/producto/${product.id}`}>
        <div style={{ height: 240, overflow: 'hidden', background: 'var(--light-gray)' }}>
            <img
            src={product.imagen || PLACEHOLDER}
            alt={product.nombre}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
            />
        </div>
        </Link>

        <div style={{ padding: '16px 20px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: 10, color: 'var(--gold)', letterSpacing: 2, textTransform: 'uppercase' }}>
            {product.categoria}
        </span>
        <Link to={`/producto/${product.id}`}>
            <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 20,
            fontWeight: 400,
            margin: '4px 0 8px',
            color: 'var(--charcoal)',
            }}>{product.nombre}</h3>
        </Link>
        <p style={{ fontSize: 13, color: 'var(--gray)', flex: 1, marginBottom: 16, lineHeight: 1.5 }}>
            {product.descripcion?.slice(0, 60)}...
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: 22,
            fontWeight: 600,
            color: 'var(--charcoal)',
            }}>
            ${product.precio.toLocaleString('es-AR')}
            </span>
            <button
            className="btn-primary"
            style={{ padding: '10px 18px', fontSize: 11 }}
            onClick={() => addToCart(product)}
            disabled={product.stock === 0}
            >
            {product.stock === 0 ? 'Agotado' : 'Agregar'}
            </button>
        </div>
        </div>
    </div>
    )
}