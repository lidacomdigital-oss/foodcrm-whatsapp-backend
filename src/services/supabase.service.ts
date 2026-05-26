import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

export class SupabaseService {
  static async saveCustomer(phone: string, name?: string) {
    const { data, error } = await supabase
      .from('customers')
      .upsert({ phone, name, updated_at: new Date() }, { onConflict: 'phone' })
      .select()
      .single();
      
    if (error) console.error('Error saving customer:', error);
    return data;
  }

  static async saveChat(phone: string, status: string = 'active') {
    const { data, error } = await supabase
      .from('chats')
      .upsert({ phone, status, updated_at: new Date() }, { onConflict: 'phone' })
      .select()
      .single();
      
    if (error) console.error('Error saving chat:', error);
    return data;
  }

  static async saveMessage(messageData: any) {
    const { data, error } = await supabase
      .from('messages')
      .insert([messageData])
      .select()
      .single();
      
    if (error) console.error('Error saving message:', error);
    return data;
  }

  static async saveMedia(mediaData: any) {
    const { data, error } = await supabase
      .from('media')
      .insert([mediaData])
      .select()
      .single();

    if (error) console.error('Error saving media:', error);
    return data;
  }
}
