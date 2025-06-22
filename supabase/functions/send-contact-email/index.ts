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
  subject?: string;
  message?: string;
  phone?: string;
  amount?: string;
  donationType?: string;
  type: 'contact' | 'newsletter' | 'donation';
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, subject, message, phone, amount, donationType, type }: ContactEmailRequest = await req.json();

    console.log(`Processing ${type} email for:`, { name, email, subject });

    if (type === 'donation') {
      // Send donation instructions email to donor
      const emailResponse = await resend.emails.send({
        from: "GSDO Donations <donations@support.gibilsame.org>",
        to: [email],
        subject: "Thank You for Your Donation - Bank Transfer Details",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px;">Thank You, ${name}!</h1>
              <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">Your generosity helps change lives</p>
            </div>
            
            <div style="padding: 30px; background-color: #f8fafc;">
              <div style="background: white; padding: 25px; border-radius: 10px; margin-bottom: 20px;">
                <h2 style="color: #1e40af; margin-top: 0;">Donation Details</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Amount:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">$${amount} USD</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Type:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${donationType || 'One-time'} Donation</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;"><strong>Reference:</strong></td>
                    <td style="padding: 8px 0;">GSDO-${Date.now()}</td>
                  </tr>
                </table>
              </div>

              <div style="background: white; padding: 25px; border-radius: 10px; margin-bottom: 20px;">
                <h2 style="color: #1e40af; margin-top: 0;">Bank Transfer Details</h2>
                <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; border-left: 4px solid #1e40af;">
                  <p style="margin: 0 0 15px 0;"><strong>Bank Name:</strong> Global Development Bank</p>
                  <p style="margin: 0 0 15px 0;"><strong>Account Name:</strong> Gibilsame Sustainable Development Organization</p>
                  <p style="margin: 0 0 15px 0;"><strong>Account Number:</strong> 1234567890</p>
                  <p style="margin: 0 0 15px 0;"><strong>Routing Number:</strong> 021000021</p>
                  <p style="margin: 0 0 15px 0;"><strong>SWIFT Code:</strong> GDBKUS33</p>
                  <p style="margin: 0;"><strong>Reference:</strong> GSDO-${Date.now()}</p>
                </div>
                <p style="color: #dc2626; font-weight: bold; margin-top: 15px;">
                  ⚠️ Please include the reference number in your transfer to ensure proper allocation.
                </p>
              </div>

              <div style="background: white; padding: 25px; border-radius: 10px;">
                <h3 style="color: #1e40af; margin-top: 0;">What Happens Next?</h3>
                <ol style="color: #374151; line-height: 1.6;">
                  <li>Transfer the amount using the bank details above</li>
                  <li>Include the reference number in your transfer</li>
                  <li>We'll send you a confirmation email once we receive your donation</li>
                  <li>You'll receive a tax-deductible receipt within 48 hours</li>
                  <li>Regular updates on how your donation is making an impact</li>
                </ol>
              </div>
            </div>

            ${message ? `
            <div style="background: #fef3c7; padding: 20px; margin: 20px 30px; border-radius: 8px;">
              <h4 style="margin-top: 0; color: #92400e;">Your Message:</h4>
              <p style="color: #92400e; margin-bottom: 0;">"${message}"</p>
            </div>
            ` : ''}

            <div style="background: #1e40af; color: white; padding: 20px 30px; text-align: center;">
              <p style="margin: 0 0 10px 0;">Questions about your donation?</p>
              <p style="margin: 0; opacity: 0.9;">Contact us at donations@gsdo.org or +1 (555) 123-4567</p>
            </div>

            <div style="padding: 20px 30px; background: #f8fafc; text-align: center;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Gibilsame Sustainable Development Organization<br>
                Tax ID: 12-3456789 | Registered Charity
              </p>
            </div>
          </div>
        `,
      });

      // Send notification to admin about new donation intent
      await resend.emails.send({
        from: "GSDO Donations <donations@support.gibilsame.org>",
        to: ["yasin.osman@gibilsame.org"],
        subject: `New Donation Intent: $${amount} from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #1e40af;">New Donation Intent Received</h1>
            <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151;">Donor Information</h3>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
              <p><strong>Amount:</strong> $${amount} USD</p>
              <p><strong>Type:</strong> ${donationType || 'One-time'} Donation</p>
              <p><strong>Reference:</strong> GSDO-${Date.now()}</p>
              ${message ? `<p><strong>Message:</strong> ${message}</p>` : ''}
            </div>
            <p style="color: #6b7280; font-size: 14px;">
              Submitted on: ${new Date().toLocaleString()}<br>
              Bank details have been sent to the donor.
            </p>
          </div>
        `,
      });

      console.log("Donation email sent successfully:", emailResponse);
    } else if (type === 'newsletter') {
      // Send newsletter confirmation email
      const emailResponse = await resend.emails.send({
        from: "GSDO Newsletter <newsletter@support.gibilsame.org>",
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
        from: "GSDO Newsletter <newsletter@support.gibilsame.org>",
        to: ["yasin.osman@gibilsame.org"],
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
        from: "GSDO Contact <contact@support.gibilsame.org>",
        to: ["yasin.osman@gibilsame.org"],
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
                ${message?.replace(/\n/g, '<br>')}
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
        from: "GSDO Contact <contact@support.gibilsame.org>",
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
                ${message?.replace(/\n/g, '<br>')}
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
