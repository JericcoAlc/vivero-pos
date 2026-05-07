
import { createClient } from '@supabase/supabase-js' 
const supabaseUrl = 'https://chknwmcfzduixcctftug.supabase.co' 
const supabaseKey = 'sb_publishable_otK0d13w5M28S3dNYln88Q_ZUTDZ6VM' 
export const supabase = createClient( supabaseUrl, supabaseKey )