import express from 'express'
import multer from 'multer'
import { supabase } from '../config/supabase.js'
import { requireAuth } from '../middleware/authMiddleware.js'

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

router.get('/', async (req, res) => {
    const { categoria } = req.query
    let query = supabase.from('productos').select('*').order('creado_en', { ascending: false })
    if (categoria) query = query.eq('categoria', categoria)
    const { data, error } = await query
    if (error) return res.status(500).json({ error: error.message })
    res.json(data)
})

router.get('/:id', async (req, res) => {
    const { data, error } = await supabase
    .from('productos').select('*').eq('id', req.params.id).single()
    if (error) return res.status(404).json({ error: 'Producto no encontrado' })
    res.json(data)
})

router.post('/', requireAuth, upload.single('imagen'), async (req, res) => {
    try {
    console.log('Body recibido:', req.body)
    console.log('Archivo recibido:', req.file?.originalname)

    const { nombre, descripcion, precio, stock, categoria } = req.body
    let imagenUrl = null

    if (req.file) {
        const fileName = `${Date.now()}-${req.file.originalname.replace(/\s/g, '-')}`
        console.log('Subiendo imagen:', fileName)

        const { error: uploadError } = await supabase.storage
        .from('productos-imgs')
        .upload(fileName, req.file.buffer, { contentType: req.file.mimetype })

        if (uploadError) {
        console.error('Error subiendo imagen:', uploadError)
        return res.status(500).json({ error: 'Error subiendo imagen: ' + uploadError.message })
        }

        const { data: urlData } = supabase.storage
        .from('productos-imgs').getPublicUrl(fileName)
        imagenUrl = urlData.publicUrl
        console.log('Imagen subida:', imagenUrl)
    }

    const { data, error } = await supabase
        .from('productos')
        .insert([{ nombre, descripcion, precio: Number(precio), stock: Number(stock), categoria, imagen: imagenUrl }])
        .select().single()

    if (error) {
        console.error('Error insertando producto:', error)
        return res.status(500).json({ error: error.message })
    }

    console.log('Producto creado:', data)
    res.status(201).json(data)

    } catch (err) {
    console.error('Error general:', err)
    res.status(500).json({ error: err.message })
    }
})

router.put('/:id', requireAuth, upload.single('imagen'), async (req, res) => {
    const { nombre, descripcion, precio, stock, categoria } = req.body
    const updates = { nombre, descripcion, precio: Number(precio), stock: Number(stock), categoria }
    if (req.file) {
    const fileName = `${Date.now()}-${req.file.originalname.replace(/\s/g, '-')}`
    await supabase.storage.from('productos-imgs').upload(fileName, req.file.buffer, { contentType: req.file.mimetype })
    const { data: urlData } = supabase.storage.from('productos-imgs').getPublicUrl(fileName)
    updates.imagen = urlData.publicUrl
    }
    const { data, error } = await supabase
    .from('productos').update(updates).eq('id', req.params.id).select().single()
    if (error) return res.status(500).json({ error: error.message })
    res.json(data)
})

router.delete('/:id', requireAuth, async (req, res) => {
    const { error } = await supabase.from('productos').delete().eq('id', req.params.id)
    if (error) return res.status(500).json({ error: error.message })
    res.json({ message: 'Producto eliminado' })
})

export default router