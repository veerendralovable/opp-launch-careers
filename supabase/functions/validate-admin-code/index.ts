
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ValidateCodeRequest {
  accessCode: string;
  role: 'admin' | 'moderator';
}

serve(async (req) => {
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

    const { accessCode, role }: ValidateCodeRequest = await req.json();

    if (!accessCode || !role) {
      return new Response(
        JSON.stringify({ success: false, error: "Access code and role are required" }),
        { 
          status: 400, 
          headers: { "Content-Type": "application/json", ...corsHeaders } 
        }
      );
    }

    // Get the secure admin access code from Supabase secrets
    const expectedCode = Deno.env.get("ADMIN_ACCESS_CODE") || "secure-admin-code-2024";
    
    // Validate the access code
    const isValid = accessCode === expectedCode;

    // Log security event
    if (isValid) {
      await supabase.rpc('log_security_event', {
        _event_type: 'admin_code_validation_success',
        _details: { role, timestamp: new Date().toISOString() },
        _severity: 'info'
      });
    } else {
      await supabase.rpc('log_security_event', {
        _event_type: 'admin_code_validation_failed',
        _details: { role, timestamp: new Date().toISOString() },
        _severity: 'warning'
      });
    }

    return new Response(
      JSON.stringify({ 
        success: isValid,
        error: isValid ? null : "Invalid access code"
      }),
      {
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error validating admin code:", error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: "Validation failed" 
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
});
