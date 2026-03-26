import { supabase } from '../config/supabase.js'

export async function requireAuth(req, res, next) {
    try {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ error: 'Token requerido' })

    const token = authHeader.replace('Bearer ', '').trim()
    if (!token) return res.status(401).json({ error: 'Token requerido' })

    console.log('Token recibido:', token.substring(0, 20) + '...')

    const { data: { user }, error } = await supabase.auth.getUser(token)

    if (error) {
        console.error('Error verificando token:', error.message)
        return res.status(401).json({ error: 'No autorizado: ' + error.message })
    }

    if (!user) return res.status(401).json({ error: 'Usuario no encontrado' })

    console.log('Usuario autenticado:', user.email)
    req.user = user
    next()
    } catch (err) {
    console.error('Error en auth middleware:', err)
    res.status(401).json({ error: 'Error de autenticación' })
    }
}