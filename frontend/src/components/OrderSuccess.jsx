import React from 'react';
import { useNavigate } from 'react-router-dom';

const OrderSuccess = () => {
  const navigate = useNavigate();  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center p-8">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl p-12 lg:p-16 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Order Placed Successfully!
          </h1>
          <p className="text-gray-600 mb-6">
            Thank you for your order. We're preparing your delicious meal and it will be delivered soon!
          </p>

          {/* Order Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-2">What's Next?</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>• Your order is being prepared</li>
              <li>• Estimated delivery: 30-45 minutes</li>
              <li>• You'll receive updates via SMS</li>
              <li>• Payment: Cash on Delivery</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={() => navigate('/home')}
              className="w-full btn-primary"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => navigate('/orders')}
              className="w-full btn-secondary"
            >
              View Order History
            </button>
          </div>

          {/* Additional Info */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              For any issues with your order, please contact our support team.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
