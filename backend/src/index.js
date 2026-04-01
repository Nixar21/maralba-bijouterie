import express from 'express'
import cors from 'cors'
import productsRouter from './routes/products.js'
import authRouter from './routes/auth.js'
import ordersRouter from './routes/orders.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
    origin: function(origin, callback) {
    if (!origin ||
        origin.includes('vercel.app') ||
        origin.includes('localhost')) {
        callback(null, true)
    } else {
        callback(new Error('No permitido por CORS'))
    }
    },
    credentials: true
}))

app.use(express.json())

app.get('/', (req, res) => res.json({ message: 'API Maralba Bijouterie 💎' }))
app.use('/api/products', productsRouter)
app.use('/api/auth', authRouter)
app.use('/api/orders', ordersRouter)

app.listen(PORT, () => console.log(`🚀 Servidor en puerto ${PORT}`))