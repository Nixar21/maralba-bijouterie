import { createClient } from '@supabase/supabase-js'

let _supabase = null

export function getSupabase() {
    if (!_supabase) {
    _supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_KEY,
        {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
        }
    )
    }
    return _supabase
}

export const supabase = new Proxy({}, {
    get(_, prop) {
    return getSupabase()[prop]
    }
})