import express from 'express'
import cors from 'cors'
import productsRouter from './routes/products.js'
import authRouter from './routes/auth.js'
import ordersRouter from './routes/orders.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
    origin: [
    'http://localhost:5173',
    'https://maralba-bijouterie-accesorios.vercel.app'
    ]
}))
app.use(express.json())

app.get('/', (req, res) => res.json({ message: 'API Maralba Bijouterie 💎' }))
app.use('/api/products', productsRouter)
app.use('/api/auth', authRouter)
app.use('/api/orders', ordersRouter)

app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`))

app.get('/debug', (req, res) => {
    res.json({
    supabaseUrl: process.env.SUPABASE_URL ? 'OK' : 'FALTA',
    serviceKey: process.env.SUPABASE_SERVICE_KEY ? 'OK' : 'FALTA',
    port: process.env.PORT || 'no definido'
    })
})

app.get('/debug-supabase', async (req, res) => {
    try {
    const { createClient } = await import('@supabase/supabase-js')
    const client = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY
    )
    const { data, error } = await client.from('productos').select('count')
    if (error) return res.json({ error: error.message, code: error.code })
    res.json({ ok: true, data })
    } catch (err) {
    res.json({ error: err.message, stack: err.stack?.split('\n')[0] })
    }
})