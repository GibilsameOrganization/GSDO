import Navigation from "@/components/Navigation";
import ContactForm from "@/components/ContactForm";
import NewsletterSignup from "@/components/NewsletterSignup";

const Contact = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-royal-blue to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl md:text-2xl text-blue-100">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-16 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactForm />
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Office Info */}
            <div className="text-center">
              <div className="w-16 h-16 bg-royal-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">📍</span>
              </div>
              <h3 className="text-xl font-semibold text-gsdo-black mb-2">Visit Our Office</h3>
              <p className="text-gray-600">
                J957+WMM, ERG, SNG, SL<br />
                Gibilsame NGO
              </p>
            </div>

            {/* Phone */}
            <div className="text-center">
              <div className="w-16 h-16 bg-royal-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">📞</span>
              </div>
              <h3 className="text-xl font-semibold text-gsdo-black mb-2">Call Us</h3>
              <p className="text-gray-600">
                +252-637779273<br />
                +252-657043360
              </p>
            </div>

            {/* Email */}
            <div className="text-center">
              <div className="w-16 h-16 bg-royal-blue rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl">✉️</span>
              </div>
              <h3 className="text-xl font-semibold text-gsdo-black mb-2">Email Us</h3>
              <p className="text-gray-600">
                info@gibilsame.org<br />
                We'll respond within 24 hours
              </p>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="mt-16 max-w-2xl mx-auto">
            <NewsletterSignup variant="card" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
