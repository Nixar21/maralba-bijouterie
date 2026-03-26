import express from 'express'
import { supabase } from '../config/supabase.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = express.Router()

router.post('/', requireAuth, async (req, res) => {
    const {
    nombre_completo, direccion, ciudad,
    provincia, codigo_postal, telefono, productos, total
    } = req.body

    try {
    console.log('Creando pedido para:', req.user.email)
    console.log('Productos:', productos)

    // Crear preferencia en Mercado Pago
    let mpPreferenceId = null
    let mpInitPoint = null

    try {
        const { MercadoPagoConfig, Preference } = await import('mercadopago')
        const mp = new MercadoPagoConfig({
        accessToken: process.env.MP_ACCESS_TOKEN
        })

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
            auto_return: 'approved'
        }
        })

        mpPreferenceId = mpData.id
        mpInitPoint = mpData.init_point
        console.log('Preferencia MP creada:', mpPreferenceId)

    } catch (mpError) {
        console.error('Error con Mercado Pago:', mpError.message)
      // Continuamos sin MP para guardar el pedido igual
    }

    // Guardar pedido en Supabase
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
        mp_preference_id: mpPreferenceId
        }])
        .select()
        .single()

    if (error) {
        console.error('Error guardando pedido en Supabase:', error)
        return res.status(500).json({ error: error.message })
    }

    console.log('Pedido guardado:', data.id)

    res.json({
        pedido: data,
        mp_init_point: mpInitPoint
    })

    } catch (err) {
    console.error('Error general en orders:', err)
    res.status(500).json({ error: err.message })
    }
})

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

router.get('/', requireAuth, async (req, res) => {
    const { data, error } = await supabase
    .from('pedidos')
    .select('*')
    .order('creado_en', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    res.json(data)
})

export default router