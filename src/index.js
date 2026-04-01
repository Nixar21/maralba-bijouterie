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