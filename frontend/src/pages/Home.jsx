import { useState, useEffect } from 'react'
import { getProducts } from '../services/api'
import ProductCard from '../components/ProductCard'

const CATEGORIAS = ['todas', 'collares', 'aros', 'pulseras', 'anillos']

export default function Home() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [categoria, setCategoria] = useState('todas')

    useEffect(() => {
    setLoading(true)
    getProducts(categoria === 'todas' ? '' : categoria)
        .then(res => setProducts(res.data))
        .catch(console.error)
        .finally(() => setLoading(false))
    }, [categoria])

    return (
    <main>
      {/* Hero */}
        <section style={{
        background: 'linear-gradient(135deg, #FAF7F2 0%, #F0EAE0 100%)',
        padding: '80px 24px',
        textAlign: 'center',
        }}>
        <div className="container">
            <p style={{ fontSize: 11, letterSpacing: 4, color: 'var(--gold)', textTransform: 'uppercase', marginBottom: 16 }}>
            Colección 2025
            </p>
            <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(40px, 6vw, 72px)',
            fontWeight: 300,
            fontStyle: 'italic',
            color: 'var(--charcoal)',
            lineHeight: 1.1,
            marginBottom: 20,
            }}>
            Bijouterie fina<br />hecha con alma
            </h1>
            <p style={{ fontSize: 15, color: 'var(--gray)', maxWidth: 480, margin: '0 auto' }}>
            Piezas únicas diseñadas para realzar tu elegancia natural.
            </p>
        </div>
        </section>

      {/* Filtros */}
        <section style={{ padding: '40px 24px 0' }}>
        <div className="container" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
            {CATEGORIAS.map(cat => (
            <button
                key={cat}
                onClick={() => setCategoria(cat)}
                style={{
                padding: '8px 24px',
                borderRadius: 100,
                border: '1.5px solid',
                borderColor: categoria === cat ? 'var(--charcoal)' : '#E0DBD3',
                background: categoria === cat ? 'var(--charcoal)' : 'transparent',
                color: categoria === cat ? '#fff' : 'var(--gray)',
                fontSize: 12,
                letterSpacing: 1.5,
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.2s',
                }}
            >
                {cat}
            </button>
            ))}
        </div>
        </section>

      {/* Grid de productos */}
        <section style={{ padding: '48px 24px 80px' }}>
        <div className="container">
            {loading ? (
            <div className="loading">Cargando colección...</div>
            ) : products.length === 0 ? (
            <div className="loading">No hay productos en esta categoría</div>
            ) : (
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 28,
            }}>
                {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
            )}
        </div>
        </section>
    </main>
    )
}