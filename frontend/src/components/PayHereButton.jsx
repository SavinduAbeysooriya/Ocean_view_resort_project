import React from 'react';
import axios from 'axios';
import { API_URL } from '../config/api';

const PayHereButton = ({ reservation, onSuccess, onError }) => {

  const handlePayment = () => {
    const merchant_id = "1231474";
    const merchant_secret = "NDIwOTI5NjgxODI5NzExNzI2NTczNDU2MjIzMTI0MTg2NjkxNTc3NQ==";
    const order_id = reservation.id;
    const amount = reservation.totalCost.toFixed(2);
    const currency = "LKR";

    // Calculate Hash: Upper(MD5(merchant_id + order_id + amount + currency + Upper(MD5(merchant_secret))))
    // Note: md5 function is available globally from the script we added in index.html
    const hashedSecret = window.md5(merchant_secret).toUpperCase();
    const amountFormatted = amount;
    const hash = window.md5(merchant_id + order_id + amountFormatted + currency + hashedSecret).toUpperCase();

    // PayHere payment configuration
    const payment = {
      sandbox: true,
      merchant_id: merchant_id,
      return_url: `${window.location.origin}/profile`,
      cancel_url: `${window.location.origin}/profile`,
      notify_url: `${API_URL}/payments/notify`,
      order_id: order_id,
      items: `Room Booking #${reservation.reservationNumber || reservation.id.substring(0, 8)}`,
      amount: amount,
      currency: currency,
      hash: hash,
      first_name: "Customer",
      last_name: "Name",
      email: "customer@gmail.com",
      phone: "0771234567",
      address: "123, Main Road",
      city: "Colombo",
      country: "Sri Lanka",
    };

    // Show PayHere payment window
    window.payhere.onCompleted = async function onCompleted(orderId) {
      console.log("Payment completed. OrderID:" + orderId);
      try {
        const token = localStorage.getItem('token');
        await axios.post(`${API_URL}/payments/success`, {
          reservationId: reservation.id,
          payhereId: orderId,
          amount: reservation.totalCost,
          currency: currency
        }, { 
          headers: { Authorization: `Bearer ${token}` } 
        });
        
        if (onSuccess) onSuccess();
      } catch (err) {
        console.error("Error updating payment status:", err);
        if (onError) onError("Payment successful but failed to update status on server.");
      }
    };

    window.payhere.onDismissed = function onDismissed() {
      console.log("Payment dismissed");
    };

    window.payhere.onError = function onError(error) {
      console.log("Error:" + error);
      if (onError) onError(error);
    };

    window.payhere.startPayment(payment);
  };

  return (
    <button
      onClick={handlePayment}
      className="px-4 py-2 bg-luxury-gold text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:shadow-lg shadow-luxury-gold/20 transition-all flex items-center justify-center space-x-2"
    >
      <span>Pay with PayHere</span>
    </button>
  );
};

export default PayHereButton;
