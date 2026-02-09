import { supabase } from '../lib/supabaseClient';
import { CompanyInfo, Staff } from '../types/index';

export const companyService = {
  async getCompanyInfo(): Promise<CompanyInfo> {
    const { data, error } = await supabase
      .from('company_info')
      .select('*')
      .single();
    if (error) throw error;
    return data;
  },

  async getFeaturedStaff(): Promise<Staff> {
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