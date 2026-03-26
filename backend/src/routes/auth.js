import express from 'express'
import { supabase } from '../config/supabase.js'

const router = express.Router()

// POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password } = req.body
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) return res.status(401).json({ error: 'Credenciales inválidas' })
    res.json({ token: data.session.access_token, user: data.user })
})

// POST /api/auth/logout
router.post('/logout', async (req, res) => {
    await supabase.auth.signOut()
    res.json({ message: 'Sesión cerrada' })
})

export default router