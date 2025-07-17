
import Navigation from "@/components/Navigation";
import DonationForm from "@/components/DonationForm";

const Donate = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-royal-blue to-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Make a Difference Today</h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Your generosity helps us create lasting change in communities worldwide
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">500K+</div>
                <div className="text-blue-100">People Helped</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">50+</div>
                <div className="text-blue-100">Countries Served</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <div className="text-3xl font-bold mb-2">95%</div>
                <div className="text-blue-100">Goes to Programs</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Form Section */}
      <section className="py-16 bg-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DonationForm />
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gsdo-black mb-8">Trusted by Thousands</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-4xl mb-4">🏆</div>
              <h3 className="font-semibold mb-2">Charity Navigator 4-Star Rating</h3>
              <p className="text-gray-600 text-sm">Top-rated for accountability and transparency</p>
            </div>
            <div>
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="font-semibold mb-2">Secure Donations</h3>
              <p className="text-gray-600 text-sm">Bank-level security for all transactions</p>
            </div>
            <div>
              <div className="text-4xl mb-4">📊</div>
              <h3 className="font-semibold mb-2">Full Transparency</h3>
              <p className="text-gray-600 text-sm">Regular reports on fund usage and impact</p>
            </div>
            <div>
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="font-semibold mb-2">Global Impact</h3>
              <p className="text-gray-600 text-sm">Direct support to communities in need</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Donate;
