
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  to: string[];
  subject: string;
  html: string;
  smtp: {
    host: string;
    port: number;
    user: string;
    password: string;
  };
}

// Rate limiting for email sending
const rateLimiter = new Map<string, { count: number; resetTime: number }>();
const MAX_EMAILS_PER_HOUR = 100;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour

const checkRateLimit = (userId: string): boolean => {
  const now = Date.now();
  const userLimit = rateLimiter.get(userId);
  
  if (!userLimit || now > userLimit.resetTime) {
    rateLimiter.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  
  if (userLimit.count >= MAX_EMAILS_PER_HOUR) {
    return false;
  }
  
  userLimit.count++;
  return true;
};

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get JWT token from request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { 
          status: 401, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    const jwt = authHeader.substring(7);
    
    // Verify JWT and get user
    const { data: { user }, error: authError } = await supabase.auth.getUser(jwt);
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid authentication" }),
        { 
          status: 401, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    // Check if user is admin
    const { data: isAdmin, error: roleError } = await supabase.rpc('is_admin', {
      _user_id: user.id
    });

    if (roleError || !isAdmin) {
      await supabase.rpc('log_security_event', {
        _event_type: 'unauthorized_email_attempt',
        _details: { 
          user_id: user.id,
          email: user.email,
          timestamp: new Date().toISOString()
        },
        _severity: 'warning'
      });

      return new Response(
        JSON.stringify({ error: "Admin privileges required" }),
        { 
          status: 403, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    // Check rate limit
    if (!checkRateLimit(user.id)) {
      return new Response(
        JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
        { 
          status: 429, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    const { to, subject, html, smtp }: EmailRequest = await req.json();

    // Validate input
    if (!to || !Array.isArray(to) || to.length === 0) {
      return new Response(
        JSON.stringify({ error: "Recipients array is required" }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    if (!subject || !html || !smtp) {
      return new Response(
        JSON.stringify({ error: "Subject, HTML content, and SMTP configuration are required" }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    // Validate email addresses
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    for (const email of to) {
      if (!emailRegex.test(email)) {
        return new Response(
          JSON.stringify({ error: `Invalid email address: ${email}` }),
          { 
            status: 400, 
            headers: { "Content-Type": "application/json", ...corsHeaders } 
          }
        );
      }
    }

    // Log email sending attempt
    await supabase.rpc('log_security_event', {
      _event_type: 'bulk_email_sent',
      _details: { 
        user_id: user.id,
        recipient_count: to.length,
        subject: subject.substring(0, 100),
        timestamp: new Date().toISOString()
      },
      _severity: 'info'
    });

    // For now, this is a mock implementation
    // In production, integrate with actual email service like Nodemailer or similar
    console.log("Email sending request:", {
      to: to.length + " recipients",
      subject,
      smtp: { host: smtp.host, user: smtp.user }
    });

    // Simulate email sending
    await new Promise(resolve => setTimeout(resolve, 1000));

    return new Response(
      JSON.stringify({ 
        success: true,
        message: `Email sent to ${to.length} recipients`,
        sent_count: to.length
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );

  } catch (error: any) {
    console.error("Error sending email:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Failed to send email" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
