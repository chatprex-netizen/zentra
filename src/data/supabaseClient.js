import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://jlcqufzstwagdnrfxwik.supabase.co'
const supabaseAnonKey = 'sb_publishable_0eqcRgl6HpTKWvwjhL58zQ_6IEWjPYC'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
