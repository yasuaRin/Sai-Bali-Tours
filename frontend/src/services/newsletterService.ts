// src/services/newsletterService.ts
import { supabase } from '../lib/supabaseClient';
import mailchimp from '@mailchimp/mailchimp_marketing';

// Get environment variables from import.meta.env (Vite)
const MAILCHIMP_API_KEY = import.meta.env.VITE_MAILCHIMP_API_KEY;
const MAILCHIMP_SERVER_PREFIX = import.meta.env.VITE_MAILCHIMP_SERVER_PREFIX;
const MAILCHIMP_LIST_ID = import.meta.env.VITE_MAILCHIMP_LIST_ID;

// Initialize Mailchimp with environment variables (only if keys exist)
if (MAILCHIMP_API_KEY && MAILCHIMP_SERVER_PREFIX) {
  mailchimp.setConfig({
    apiKey: MAILCHIMP_API_KEY,
    server: MAILCHIMP_SERVER_PREFIX
  });
}

export const newsletterService = {
  async subscribe(email: string, source: string = 'blog') {
    // Save to Supabase first
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email, source, status: 'active' }])
      .select()
      .single();
    
    if (error) {
      // Handle duplicate email error (PostgreSQL code 23505 = unique violation)
      if (error.code === '23505') {
        throw new Error('This email is already subscribed');
      }
      throw error;
    }
    
    // Also add to Mailchimp (optional - won't break if fails)
    try {
      if (MAILCHIMP_LIST_ID && MAILCHIMP_API_KEY) {
        await mailchimp.lists.addListMember(MAILCHIMP_LIST_ID, {
          email_address: email,
          status: 'subscribed',
          tags: [source]
        });
      }
    } catch (mailchimpError) {
      console.error('Mailchimp error:', mailchimpError);
      // Don't throw - still saved in your DB
    }
    
    return data;
  },
  
  async unsubscribe(email: string) {
    // Update status in Supabase
    const { error } = await supabase
      .from('newsletter_subscribers')
      .update({ status: 'unsubscribed' })
      .eq('email', email);
    
    if (error) throw error;
    
    // Optional: Also unsubscribe from Mailchimp
    try {
      if (MAILCHIMP_LIST_ID && MAILCHIMP_API_KEY) {
        // Mailchimp requires MD5 hash of lowercase email
        // Use Web Crypto API instead of Node's crypto
        const encoder = new TextEncoder();
        const data = encoder.encode(email.toLowerCase());
        const hashBuffer = await crypto.subtle.digest('MD5', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const subscriberHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        // Update status in Mailchimp
        await mailchimp.lists.updateListMember(
          MAILCHIMP_LIST_ID,
          subscriberHash,
          { status: 'unsubscribed' }
        );
      }
    } catch (mailchimpError) {
      console.error('Mailchimp unsubscribe error:', mailchimpError);
      // Don't throw - still updated in your DB
    }
  },
  
  async getSubscribers() {
    // Get all active subscribers from Supabase
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('status', 'active')
      .order('subscribed_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },
  
  async getSubscriberCount() {
    // Get count of active subscribers
    const { count, error } = await supabase
      .from('newsletter_subscribers')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');
    
    if (error) throw error;
    return count || 0;
  }
};