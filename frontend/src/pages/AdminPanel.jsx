import { useState, useEffect } from 'react'
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/api'

const EMPTY_FORM = { nombre: '', descripcion: '', precio: '', stock: '', categoria: '', imagen: null }

export default function AdminPanel() {
    const [products, setProducts] = useState([])
    const [form, setForm] = useState(EMPTY_FORM)
    const [editId, setEditId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [msg, setMsg] = useState('')

    const fetchProducts = () => getProducts().then(r => setProducts(r.data))

    useEffect(() => { fetchProducts() }, [])

    const handleChange = e => {
    const { name, value, files } = e.target
    setForm(f => ({ ...f, [name]: files ? files[0] : value }))
    }

    const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    try {
        const fd = new FormData()
        Object.entries(form).forEach(([k, v]) => { if (v !== null && v !== '') fd.append(k, v) })

        if (editId) {
        await updateProduct(editId, fd)
        setMsg('✓ Producto actualizado')
        } else {
        await createProduct(fd)
        setMsg('✓ Producto creado')
        }
        setForm(EMPTY_FORM)
        setEditId(null)
        fetchProducts()
    } catch {
        setMsg('✗ Error al guardar')
    } finally {
        setLoading(false)
        setTimeout(() => setMsg(''), 3000)
    }
    }

    const handleEdit = (p) => {
    setEditId(p.id)
    setForm({ nombre: p.nombre, descripcion: p.descripcion, precio: p.precio, stock: p.stock, categoria: p.categoria, imagen: null })
    window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    const handleDelete = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return
    await deleteProduct(id)
    fetchProducts()
    }

    return (
    <main style={{ padding: '48px 24px 80px' }}>
        <div className="container" style={{ maxWidth: 900 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 40, fontWeight: 400, marginBottom: 8 }}>
            Panel de Administración
        </h1>
        <p style={{ color: 'var(--gray)', marginBottom: 48 }}>Gestioná los productos de Maralba</p>

        {/* Formulario */}
        <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: '36px',
            boxShadow: 'var(--shadow)',
            marginBottom: 48,
        }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 400, marginBottom: 24 }}>
            {editId ? 'Editar producto' : 'Nuevo producto'}
            </h2>

            <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--gray)', display: 'block', marginBottom: 6 }}>Nombre *</label>
                <input name="nombre" value={form.nombre} onChange={handleChange} required placeholder="Collar Perla Luna" />
            </div>

            <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--gray)', display: 'block', marginBottom: 6 }}>Descripción</label>
                <textarea name="descripcion" value={form.descripcion} onChange={handleChange} rows={3} placeholder="Descripción del producto..." />
            </div>

            <div>
              <label style={{ fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--gray)', display: 'block', marginBottom: 6 }}>Precio (ARS) *</label>
                <input name="precio" type="number" value={form.precio} onChange={handleChange} required placeholder="1500" />
            </div>

            <div>
              <label style={{ fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--gray)', display: 'block', marginBottom: 6 }}>Stock *</label>
                <input name="stock" type="number" value={form.stock} onChange={handleChange} required placeholder="10" />
            </div>

            <div>
                <label style={{ fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--gray)', display: 'block', marginBottom: 6 }}>Categoría</label>
                <select name="categoria" value={form.categoria} onChange={handleChange}>
                <option value="">Seleccionar...</option>
                <option value="collares">Collares</option>
                <option value="aros">Aros</option>
                <option value="pulseras">Pulseras</option>
                <option value="anillos">Anillos</option>
                </select>
            </div>

            <div>
                <label style={{ fontSize: 12, letterSpacing: 1, textTransform: 'uppercase', color: 'var(--gray)', display: 'block', marginBottom: 6 }}>Imagen</label>
                <input name="imagen" type="file" accept="image/*" onChange={handleChange} style={{ padding: '8px 0', border: 'none', background: 'none' }} />
            </div>

            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 12, alignItems: 'center', marginTop: 8 }}>
                <button className="btn-primary" type="submit" style={{ padding: '14px 32px' }} disabled={loading}>
                {loading ? 'Guardando...' : editId ? 'Actualizar' : 'Crear producto'}
                </button>
                {editId && (
                <button type="button" className="btn-outline" onClick={() => { setEditId(null); setForm(EMPTY_FORM) }}>
                    Cancelar
                </button>
                )}
                {msg && <span style={{ color: msg.startsWith('✓') ? 'green' : 'var(--danger)', fontSize: 14 }}>{msg}</span>}
            </div>
            </form>
        </div>

        {/* Lista de productos */}
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 28, fontWeight: 400, marginBottom: 24 }}>
            Productos ({products.length})
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {products.map(p => (
            <div key={p.id} style={{
                background: '#fff',
                borderRadius: 12,
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                boxShadow: 'var(--shadow)',
            }}>
                <img
                src={p.imagen || 'https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=80&q=60'}
                alt={p.nombre}
                style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, background: 'var(--light-gray)' }}
                />
                <div style={{ flex: 1 }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 18 }}>{p.nombre}</p>
                <p style={{ fontSize: 12, color: 'var(--gray)' }}>{p.categoria} · Stock: {p.stock}</p>
                </div>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 20 }}>
                ${Number(p.precio).toLocaleString('es-AR')}
                </span>
                <button className="btn-outline" style={{ padding: '8px 18px', fontSize: 12 }} onClick={() => handleEdit(p)}>
                Editar
                </button>
                <button className="btn-danger" onClick={() => handleDelete(p.id)}>
                Eliminar
                </button>
            </div>
            ))}
        </div>
        </div>
    </main>
    )
}