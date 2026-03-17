import React from 'react';
import { useNavigate } from 'react-router-dom'; 

const PaymentCanceled: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/cart');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <img
        src="https://img.freepik.com/premium-photo/futuristic-symbol-red-plus-sign-white_965427-1457.jpg"
        alt="Canceled Sign"
        className="w-32 h-32 mb-4"
      />
      <h1 className="text-3xl font-semibold mb-2">Payment Canceled</h1>
      <p className="text-gray-600 mb-6">Your payment has been canceled. Please try again.</p>
      <button
        onClick={handleBack}
        className="bg-gradient-to-br from-red-600 to-red-400 text-white py-2 px-6 rounded-md hover:bg-red-500"
      >
        Back
      </button>
    </div>
  );
};

export default PaymentCanceled;
