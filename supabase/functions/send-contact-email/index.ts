
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  type: 'contact' | 'newsletter';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message, type }: ContactEmailRequest = await req.json();

    console.log(`Processing ${type} email for:`, { name, email, subject });

    if (type === 'newsletter') {
      // Send newsletter confirmation email
      const emailResponse = await resend.emails.send({
        from: "GSDO <noreply@resend.dev>",
        to: [email],
        subject: "Welcome to GSDO Newsletter!",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1e40af;">Welcome to GSDO, ${name}!</h1>
            <p>Thank you for subscribing to our newsletter. You'll receive updates about our sustainable development work and impact around the world.</p>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #374151;">What to expect:</h2>
              <ul style="color: #6b7280;">
                <li>Monthly updates on our projects</li>
                <li>Impact stories from communities we serve</li>
                <li>Opportunities to get involved</li>
                <li>News about sustainable development</li>
              </ul>
            </div>
            <p style="color: #6b7280;">If you have any questions, feel free to contact us at info@gsdo.org</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #9ca3af; font-size: 14px;">
              Gibilsame Sustainable Development Organization<br>
              Empowering communities worldwide through sustainable development
            </p>
          </div>
        `,
      });

      // Also send notification to admin
      await resend.emails.send({
        from: "GSDO Newsletter <noreply@resend.dev>",
        to: ["admin@gsdo.org"], // Replace with actual admin email
        subject: "New Newsletter Subscription",
        html: `
          <h2>New Newsletter Subscription</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        `,
      });

      console.log("Newsletter subscription email sent successfully:", emailResponse);
    } else {
      // Send contact form email to admin
      const emailResponse = await resend.emails.send({
        from: "GSDO Contact <noreply@resend.dev>",
        to: ["admin@gsdo.org"], // Replace with actual admin email
        subject: `Contact Form: ${subject}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1e40af;">New Contact Form Submission</h1>
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Subject:</strong> ${subject}</p>
              <p><strong>Message:</strong></p>
              <div style="background-color: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
            <p style="color: #6b7280; font-size: 14px;">
              Submitted on: ${new Date().toLocaleString()}
            </p>
          </div>
        `,
        replyTo: email,
      });

      // Send confirmation email to user
      await resend.emails.send({
        from: "GSDO <noreply@resend.dev>",
        to: [email],
        subject: "Thank you for contacting GSDO",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1e40af;">Thank you for contacting us, ${name}!</h1>
            <p>We have received your message and will get back to you as soon as possible.</p>
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151;">Your message:</h3>
              <p style="color: #6b7280;"><strong>Subject:</strong> ${subject}</p>
              <div style="background-color: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
                ${message.replace(/\n/g, '<br>')}
              </div>
            </div>
            <p>Our team typically responds within 24-48 hours during business days.</p>
            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
            <p style="color: #9ca3af; font-size: 14px;">
              Best regards,<br>
              The GSDO Team<br>
              Gibilsame Sustainable Development Organization
            </p>
          </div>
        `,
      });

      console.log("Contact form email sent successfully:", emailResponse);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-contact-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
