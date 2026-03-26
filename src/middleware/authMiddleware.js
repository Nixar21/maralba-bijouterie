import { supabase } from '../config/supabase.js'

export async function requireAuth(req, res, next) {
    const token = req.headers.authorization?.split('Bearer ')[1]
    if (!token) return res.status(401).json({ error: 'Token requerido' })

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return res.status(401).json({ error: 'No autorizado' })

    req.user = user
    next()
}