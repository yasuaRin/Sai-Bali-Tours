import { supabase } from '../lib/supabaseClient';

// Minimal implementation WITHOUT type dependencies
export const companyService = {
  async getCompanyInfo() {
    const { data, error } = await supabase
      .from('company_info')
      .select('*')
      .single();
    if (error) throw error;
    return data;
  },

  async getFeaturedStaff() {
    const { data, error } = await supabase
      .from('staff')
      .select('id, name, role, bio, specialty, whatsapp_number, image_url, is_featured, created_at')
      .eq('is_featured', true)
      .eq('role', 'Concierge')
      .single();
    if (error) throw error;
    return data;
  }
};