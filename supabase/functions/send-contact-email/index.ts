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
        subject: "Thank You for Your Generosity",
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          'X-Mailer': 'GSDO Email System',
          'X-Auto-Response-Suppress': 'OOF, DR, RN, NRN, AutoReply'
        },
        text: `Thank You for Your Generosity, ${name}!

Your donation details have been received and we've prepared your account information.

Donation Amount: $${amount} USD
Type: ${donationType || 'One-time'}
Reference: GSDO-${Date.now()}

Donation Instructions (USD):

PRIMARY CONTACT INFORMATION:
- Organization: GIBIL SAME SUSTAINABLE DEVELOPMENT ORG
- Reference Number: 130611503001
- Location: Premier Bank Limited, Mogadiscio, Somalia
- International Code: PBSMSOSM

ROUTING INFORMATION:
- Via: Premier Bank Kenya Limited, Nairobi
- Route Code: IFCBKENA
- Final Destination: Standard Chartered New York, USD
- Code: SCBLUS33

IMPORTANT NOTES:
- Currency: USD only
- Reference: GSDO-${Date.now()} (Please include this reference)
- Processing: 3-5 business days
- Service charges may apply

What Happens Next:
1. Make your donation using the information above
2. Include the reference: GSDO-${Date.now()}
3. We'll send you a confirmation once received
4. You'll receive a donation receipt within 48 hours
5. Regular updates on your impact

${message ? `Your Message: "${message}"` : ''}

Questions or need confirmation?
Contact us at info@gibilsame.org

Best regards,
The GSDO Team
Gibilsame Sustainable Development Organization`,
        html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Thank You for Your Generosity</title>
          </head>
          <body style="margin: 0; padding: 0; background-color: #f8fafc;">
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px; color: #ffffff;">Thank You, ${name}!</h1>
              <p style="margin: 10px 0 0 0; font-size: 18px; color: #e0f2fe;">Your generosity helps change lives</p>
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
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${donationType || 'One-time'}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;"><strong>Reference:</strong></td>
                    <td style="padding: 8px 0;">GSDO-${Date.now()}</td>
                  </tr>
                </table>
              </div>

              <div style="background: white; padding: 25px; border-radius: 10px; margin-bottom: 20px;">
                <h2 style="color: #1e40af; margin-top: 0;">Donation Instructions (USD)</h2>
                
                <div style="background: #f0f9ff; border-left: 4px solid #0284c7; padding: 20px; border-radius: 8px; margin: 15px 0;">
                  <h3 style="color: #0369a1; margin-top: 0; font-size: 16px;">Primary Contact Information</h3>
                  <p style="margin: 8px 0; color: #374151;"><strong>Organization:</strong> GIBIL SAME SUSTAINABLE DEVELOPMENT ORG</p>
                  <p style="margin: 8px 0; color: #374151;"><strong>Reference Number:</strong> 130611503001</p>
                  <p style="margin: 8px 0; color: #374151;"><strong>Location:</strong> Premier Bank Limited, Mogadiscio, Somalia</p>
                  <p style="margin: 8px 0; color: #374151;"><strong>International Code:</strong> PBSMSOSM</p>
                </div>

                <div style="background: #f0f9ff; border-left: 4px solid #0284c7; padding: 20px; border-radius: 8px; margin: 15px 0;">
                  <h3 style="color: #0369a1; margin-top: 0; font-size: 16px;">Routing Information</h3>
                  <p style="margin: 8px 0; color: #374151;"><strong>Via:</strong> Premier Bank Kenya Limited, Nairobi</p>
                  <p style="margin: 8px 0; color: #374151;"><strong>Route Code:</strong> IFCBKENA</p>
                  <p style="margin: 8px 0; color: #374151;"><strong>Final Destination:</strong> Standard Chartered New York, USD</p>
                  <p style="margin: 8px 0; color: #374151;"><strong>Code:</strong> SCBLUS33</p>
                </div>

                <div style="background: #fef3c7; border: 1px solid #f59e0b; padding: 15px; border-radius: 8px; margin: 15px 0;">
                  <h4 style="color: #92400e; margin-top: 0; font-size: 14px;">📋 Important Notes</h4>
                  <ul style="color: #92400e; margin: 10px 0; padding-left: 20px;">
                    <li>Currency: USD only</li>
                    <li>Reference: GSDO-${Date.now()} (Please include)</li>
                    <li>Processing: 3-5 business days</li>
                    <li>Service charges may apply</li>
                  </ul>
                </div>
              </div>

              <div style="background: white; padding: 25px; border-radius: 10px;">
                <h3 style="color: #1e40af; margin-top: 0;">What Happens Next?</h3>
                <ol style="color: #374151; line-height: 1.6;">
                  <li>Make your donation using the information above</li>
                  <li>Include the reference: GSDO-${Date.now()}</li>
                  <li>We'll send you a confirmation once received</li>
                  <li>You'll receive a donation receipt within 48 hours</li>
                  <li>Regular updates on your impact</li>
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
              <p style="margin: 0 0 10px 0;">Questions or need confirmation of receipt?</p>
              <p style="margin: 0; opacity: 0.9;">Contact us at info@gibilsame.org</p>
            </div>

            <div style="padding: 20px 30px; background: #f8fafc; text-align: center;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Gibilsame Sustainable Development Organization
              </p>
            </div>
          </div>
          </body>
          </html>
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
        subject: `Contact Form: ${subject} - From ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); color: white; padding: 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 24px;">🔔 New Contact Form Submission</h1>
              <p style="margin: 10px 0 0 0; opacity: 0.9;">Requires Response</p>
            </div>
            
            <div style="padding: 25px; background-color: #f8fafc;">
              <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h2 style="color: #dc2626; margin-top: 0;">Contact Details</h2>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb; width: 120px;"><strong>Name:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Email:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${email}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Subject:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${subject}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Submitted:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${new Date().toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;"><strong>Reference:</strong></td>
                    <td style="padding: 8px 0;">GSDO-CONTACT-${Date.now()}</td>
                  </tr>
                </table>
              </div>

              <div style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
                <h3 style="color: #dc2626; margin-top: 0;">Message Content</h3>
                <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; border-left: 4px solid #dc2626;">
                  <p style="color: #374151; margin: 0; line-height: 1.6; white-space: pre-wrap;">${message?.replace(/\n/g, '<br>')}</p>
                </div>
              </div>

              <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 20px; border-radius: 10px;">
                <h3 style="color: #dc2626; margin-top: 0;">📬 Reply Instructions</h3>
                <p style="color: #374151; margin-bottom: 15px;">
                  <strong>To reply directly:</strong> Simply hit "Reply" to this email - it will go directly to ${email}
                </p>
                <p style="color: #374151; margin-bottom: 15px;">
                  <strong>Expected response time:</strong> Within 24-48 hours (already communicated to sender)
                </p>
                <p style="color: #374151; margin: 0;">
                  <strong>Confirmation sent:</strong> User has been automatically notified that their message was received
                </p>
              </div>
            </div>
          </div>
        `,
        replyTo: email,
      });

      // Send confirmation email to user
      await resend.emails.send({
        from: "GSDO Contact <contact@support.gibilsame.org>",
        to: [email],
        subject: "Thank you for contacting GSDO",
        headers: {
          'X-Priority': '1',
          'X-MSMail-Priority': 'High',
          'X-Mailer': 'GSDO Email System',
          'X-Auto-Response-Suppress': 'OOF, DR, RN, NRN, AutoReply'
        },
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 30px; text-align: center;">
              <h1 style="margin: 0; font-size: 28px;">Thank You, ${name}!</h1>
              <p style="margin: 10px 0 0 0; font-size: 18px; opacity: 0.9;">We've received your message</p>
            </div>
            
            <div style="padding: 30px; background-color: #f8fafc;">
              <div style="background: white; padding: 25px; border-radius: 10px; margin-bottom: 20px;">
                <h2 style="color: #1e40af; margin-top: 0;">Message Confirmation</h2>
                <p style="color: #374151; line-height: 1.6;">
                  Thank you for reaching out to us. We have successfully received your message and will respond as soon as possible.
                </p>
                <p style="color: #374151; line-height: 1.6;">
                  <strong>Expected Response Time:</strong> Within 24-48 hours during business days (Monday-Friday)
                </p>
              </div>

              <div style="background: white; padding: 25px; border-radius: 10px; margin-bottom: 20px;">
                <h3 style="color: #1e40af; margin-top: 0;">Your Message Details</h3>
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Subject:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${subject}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;"><strong>Submitted:</strong></td>
                    <td style="padding: 8px 0; border-bottom: 1px solid #e5e7eb;">${new Date().toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0;"><strong>Reference:</strong></td>
                    <td style="padding: 8px 0;">GSDO-CONTACT-${Date.now()}</td>
                  </tr>
                </table>
                <div style="background: #f1f5f9; padding: 20px; border-radius: 8px; margin-top: 15px;">
                  <h4 style="margin-top: 0; color: #374151;">Your Message:</h4>
                  <p style="color: #374151; margin-bottom: 0; line-height: 1.6;">
                    ${message?.replace(/\n/g, '<br>')}
                  </p>
                </div>
              </div>

              <div style="background: white; padding: 25px; border-radius: 10px;">
                <h3 style="color: #1e40af; margin-top: 0;">What Happens Next?</h3>
                <ol style="color: #374151; line-height: 1.6;">
                  <li>Make your donation using the information above</li>
                  <li>Include the reference: GSDO-${Date.now()}</li>
                  <li>We'll send you a confirmation once received</li>
                  <li>You'll receive a donation receipt within 48 hours</li>
                  <li>Regular updates on your impact</li>
                </ol>
              </div>
            </div>

            <div style="background: #1e40af; color: white; padding: 20px 30px; text-align: center;">
              <p style="margin: 0 0 10px 0;">Need immediate assistance?</p>
              <p style="margin: 0; opacity: 0.9;">Email: contact@support.gibilsame.org | Phone: +1 (555) 123-4567</p>
            </div>

            <div style="padding: 20px 30px; background: #f8fafc; text-align: center;">
              <p style="color: #6b7280; font-size: 14px; margin: 0;">
                Best regards,<br>
                The GSDO Team<br>
                Gibilsame Sustainable Development Organization
              </p>
            </div>
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
