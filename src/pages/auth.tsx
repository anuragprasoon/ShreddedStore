import React, { useState } from 'react';
import { useRouter } from 'next/router';
import DesktopNavbar from '@/components/topnav';
import Footer from '@/components/footer';
import { toast } from 'react-hot-toast';

const AuthPage = () => {
  const [identifier, setIdentifier] = useState(''); // email or phone
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { redirect } = router.query;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsOtpSent(true);
        toast.success('OTP sent successfully!');
      } else {
        toast.error(data.message || 'Failed to send OTP');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, otp }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Successfully logged in!');
        router.push(typeof redirect === 'string' ? redirect : '/');
      } else {
        toast.error(data.message || 'Invalid OTP');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <DesktopNavbar />
      <div className="min-h-screen bg-white font-['Urbanist'] py-8">
        <div className="max-w-md mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome to Shredded Store
            </h1>
            <p className="text-gray-600 mt-2">
              {isOtpSent
                ? 'Enter the OTP sent to your email/phone'
                : 'Enter your email or phone number to continue'}
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-6">
            {!isOtpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
                    Email or Phone Number
                  </label>
                  <input
                    type="text"
                    id="identifier"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="Enter email or phone number"
                    required
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    We&apos;ll send you a one-time password
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-black text-white py-3 rounded-lg font-semibold transition ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
                  }`}
                >
                  {isLoading ? 'Sending OTP...' : 'Send OTP'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    id="otp"
                    value={otp}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                      setOtp(value);
                    }}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    placeholder="Enter 6-digit OTP"
                    required
                    maxLength={6}
                    pattern="\d{6}"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full bg-black text-white py-3 rounded-lg font-semibold transition ${
                    isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'
                  }`}
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setIsOtpSent(false);
                    setOtp('');
                  }}
                  className="w-full text-gray-600 text-sm hover:text-black"
                >
                  Change Email/Phone Number
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AuthPage;