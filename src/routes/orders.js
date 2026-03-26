import express from 'express'
import { supabase } from '../config/supabase.js'
import { requireAuth } from '../middleware/authMiddleware.js'
import { MercadoPagoConfig, Preference } from 'mercadopago'

const router = express.Router()

const mp = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN
})

// POST /api/orders — crear pedido y preferencia de MP
router.post('/', requireAuth, async (req, res) => {
    const {
    nombre_completo, direccion, ciudad,
    provincia, codigo_postal, telefono, productos, total
    } = req.body

    try {
    // 1. Crear preferencia en Mercado Pago
    const preference = new Preference(mp)
    const mpData = await preference.create({
        body: {
        items: productos.map(p => ({
            title: p.nombre,
            unit_price: Number(p.precio),
            quantity: Number(p.qty),
            currency_id: 'ARS'
        })),
        payer: { email: req.user.email },
        back_urls: {
            success: `${process.env.FRONTEND_URL}/pedido/exito`,
            failure: `${process.env.FRONTEND_URL}/pedido/error`,
            pending: `${process.env.FRONTEND_URL}/pedido/pendiente`
        },
        auto_return: 'approved',
        notification_url: `${process.env.BACKEND_URL}/api/orders/webhook`
        }
    })

    // 2. Guardar pedido en Supabase
    const { data, error } = await supabase
        .from('pedidos')
        .insert([{
        usuario_id: req.user.id,
        usuario_email: req.user.email,
        nombre_completo,
        direccion,
        ciudad,
        provincia,
        codigo_postal,
        telefono,
        productos,
        total,
        estado: 'pendiente',
        mp_preference_id: mpData.id
        }])
        .select()
        .single()

    if (error) throw error

    res.json({
        pedido: data,
      mp_init_point: mpData.init_point  // URL de pago de MP
    })
    } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error creando el pedido' })
    }
})

// POST /api/orders/webhook — Mercado Pago notifica el pago
router.post('/webhook', async (req, res) => {
    const { type, data } = req.body
    if (type === 'payment') {
    await supabase
        .from('pedidos')
        .update({ estado: 'pagado' })
        .eq('mp_preference_id', data.id)
    }
    res.sendStatus(200)
})

// GET /api/orders — admin ve todos los pedidos
router.get('/', requireAuth, async (req, res) => {
    const { data, error } = await supabase
    .from('pedidos')
    .select('*')
    .order('creado_en', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    res.json(data)
})

export default router