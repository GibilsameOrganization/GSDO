import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Mail, AlertCircle, Copy, Check, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';

const DonationConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [copiedField, setCopiedField] = useState('');
  const { toast } = useToast();

  // Get data from navigation state
  const { donationReference, donorName, donorEmail, amount, donationType } = location.state || {};

  useEffect(() => {
    // If no state data, redirect to donate page
    if (!donationReference) {
      console.log('No donation reference found, redirecting to donate page');
      navigate('/donate');
    } else {
      console.log('DonationConfirmation mounted with state:', {
        donationReference,
        donorName,
        donorEmail,
        amount,
        donationType
      });
    }
  }, [donationReference, navigate]);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(''), 2000);
      toast({
        title: "Copied!",
        description: "Information copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Copy failed",
        description: "Please copy the information manually",
        variant: "destructive",
      });
    }
  };

  if (!donationReference) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-royal-blue text-white p-8 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Heart className="mr-4" size={32} />
              <div>
                <h1 className="text-3xl font-bold">Thank You for Your Generosity!</h1>
                <p className="text-blue-100 mt-2">Your donation details are ready, {donorName}</p>
              </div>
            </div>
            <Button
              onClick={() => navigate('/donate')}
              variant="ghost"
              className="text-white hover:bg-blue-600"
            >
              <ArrowLeft className="mr-2" size={20} />
              Back to Donate
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-b-lg shadow-lg p-8 space-y-8">
          {/* Donation Summary */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-4">Donation Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <span className="text-sm font-medium text-blue-600">Amount:</span>
                <p className="text-lg font-bold text-blue-900">${amount || 'N/A'} USD</p>
              </div>
              <div>
                <span className="text-sm font-medium text-blue-600">Type:</span>
                <p className="text-lg font-bold text-blue-900">{donationType || 'One-time'}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-blue-600">Reference:</span>
                <p className="text-lg font-bold text-blue-900">{donationReference || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Email Notification */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <Mail className="text-green-600 mt-1" size={24} />
              <div>
                <h3 className="text-lg font-semibold text-green-800">Email Sent Successfully!</h3>
                <p className="text-green-700 mt-2">
                  We've sent detailed donation instructions to <strong>{donorEmail || 'your email'}</strong>.
                  <br />
                  <strong>Please check your spam/junk folder</strong> if you don't see it in your inbox within a few minutes.
                </p>
              </div>
            </div>
          </div>

          {/* Warning for institutional emails */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <div className="flex items-start space-x-4">
              <AlertCircle className="text-amber-600 mt-1" size={24} />
              <div>
                <h3 className="text-lg font-semibold text-amber-800">Email Not Received?</h3>
                <p className="text-amber-700 mt-2">
                  Some institutions block external emails. If you haven't received our email or can't access it, 
                  use the information below to complete your donation.
                </p>
              </div>
            </div>
          </div>

          {/* Banking Details */}
          <div className="border rounded-lg p-6 bg-gray-50">
            <h2 className="text-2xl font-bold text-gsdo-black mb-6">Send Your Donation in USD</h2>
            <p className="text-gray-700 mb-6">Give the following to your bank or money transfer service:</p>
            
            <div className="space-y-6">
              {/* Beneficiary Bank */}
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-royal-blue">Beneficiary Bank:</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Beneficiary Bank:</span>
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-sm font-semibold">Premier Bank Limited Mogadiscio, Somalia</span>
                      <button
                        onClick={() => copyToClipboard('Premier Bank Limited Mogadiscio, Somalia', 'beneficiaryBank')}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded"
                        title="Copy to clipboard"
                      >
                        {copiedField === 'beneficiaryBank' ? <Check size={18} /> : <Copy size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">SWIFT Code:</span>
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-lg text-royal-blue font-bold">PBSMSOSM</span>
                      <button
                        onClick={() => copyToClipboard('PBSMSOSM', 'beneficiarySwift')}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded"
                        title="Copy to clipboard"
                      >
                        {copiedField === 'beneficiarySwift' ? <Check size={18} /> : <Copy size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Account Number:</span>
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-lg text-royal-blue font-bold">130611503001</span>
                      <button
                        onClick={() => copyToClipboard('130611503001', 'accountNumber')}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded"
                        title="Copy to clipboard"
                      >
                        {copiedField === 'accountNumber' ? <Check size={18} /> : <Copy size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Account Name:</span>
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-sm font-semibold">GIBIL SAME SUSTAINABLE DEVELOPMENT ORG</span>
                      <button
                        onClick={() => copyToClipboard('GIBIL SAME SUSTAINABLE DEVELOPMENT ORG', 'accountName')}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded"
                        title="Copy to clipboard"
                      >
                        {copiedField === 'accountName' ? <Check size={18} /> : <Copy size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Intermediary Bank */}
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-orange-600">➡ Intermediary Bank:</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Intermediary Bank:</span>
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-sm">Premier Bank Kenya Limited, Nairobi</span>
                      <button
                        onClick={() => copyToClipboard('Premier Bank Kenya Limited, Nairobi', 'intermediaryBank')}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded"
                        title="Copy to clipboard"
                      >
                        {copiedField === 'intermediaryBank' ? <Check size={18} /> : <Copy size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">SWIFT Code:</span>
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-lg font-bold text-orange-600">IFCBKENA</span>
                      <button
                        onClick={() => copyToClipboard('IFCBKENA', 'intermediarySwift')}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded"
                        title="Copy to clipboard"
                      >
                        {copiedField === 'intermediarySwift' ? <Check size={18} /> : <Copy size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Correspondent Bank */}
              <div className="bg-white p-6 rounded-lg border shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-green-600">➡ Correspondent Bank:</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">Correspondent Bank:</span>
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-sm">Standard Chartered Bank New York, USD</span>
                      <button
                        onClick={() => copyToClipboard('Standard Chartered Bank New York, USD', 'correspondentBank')}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded"
                        title="Copy to clipboard"
                      >
                        {copiedField === 'correspondentBank' ? <Check size={18} /> : <Copy size={18} />}
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-700">SWIFT Code:</span>
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-lg font-bold text-green-600">SCBLUS33</span>
                      <button
                        onClick={() => copyToClipboard('SCBLUS33', 'correspondentSwift')}
                        className="text-blue-600 hover:text-blue-800 p-1 rounded"
                        title="Copy to clipboard"
                      >
                        {copiedField === 'correspondentSwift' ? <Check size={18} /> : <Copy size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Notes */}
              <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                <h3 className="text-lg font-semibold text-yellow-800 mb-4">Important Notes:</h3>
                <ul className="space-y-2 text-yellow-700">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-600 rounded-full mr-3"></span>
                    <strong>Currency:</strong> USD only
                  </li>
                  <li className="flex items-start">
                    <span className="w-2 h-2 bg-yellow-600 rounded-full mr-3 mt-2"></span>
                    <span><strong>Reference:</strong> <span className="font-mono font-bold text-yellow-900">{donationReference || 'N/A'}</span> (Please include this reference in your transfer)</span>
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-600 rounded-full mr-3"></span>
                    <strong>Processing time:</strong> 3-5 business days
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-yellow-600 rounded-full mr-3"></span>
                    <strong>Fees:</strong> Bank transfer fees may apply
                  </li>
                </ul>
              </div>

              {/* What Happens Next */}
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">What Happens Next?</h3>
                <ol className="space-y-2 text-blue-700">
                  <li className="flex">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</span>
                    Make your donation using the information above
                  </li>
                  <li className="flex">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</span>
                    Include the reference: <span className="font-mono font-bold">{donationReference}</span>
                  </li>
                  <li className="flex">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</span>
                    We'll send you a confirmation once received
                  </li>
                  <li className="flex">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">4</span>
                    You'll receive a donation receipt within 48 hours
                  </li>
                  <li className="flex">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold mr-3 mt-0.5">5</span>
                    Regular updates on your impact
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-green-800 mb-3">Need Help or Have Questions?</h3>
            <p className="text-green-700">
              For any issues or inquiries regarding your donation, please contact us at{' '}
              <a href="mailto:info@gibilsame.org" className="font-medium underline hover:text-green-900">
                info@gibilsame.org
              </a>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Button
              onClick={() => navigate('/')}
              className="bg-royal-blue hover:bg-blue-700 px-8"
            >
              Return to Home
            </Button>
            <Button
              onClick={() => navigate('/donate')}
              variant="outline"
              className="px-8"
            >
              Make Another Donation
            </Button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default DonationConfirmation; 