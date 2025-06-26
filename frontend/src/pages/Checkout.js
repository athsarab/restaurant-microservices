import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { orderService } from '../services/api';

const Checkout = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [subTotal, setSubTotal] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    paymentMethod: 'credit_card',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    deliveryNotes: ''
  });

  useEffect(() => {
    // Load cart items from localStorage
    const cart = localStorage.getItem('cart');
    if (!cart) {
      navigate('/cart');
      return;
    }

    const parsedCart = JSON.parse(cart);
    setCartItems(parsedCart);
    
    // Calculate subtotal
    const total = parsedCart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setSubTotal(total);

    // Pre-fill user information if available
    if (user) {
      setFormData({
        ...formData,
        name: user.name || '',
        phone: user.phone || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || ''
      });
    }

    setLoading(false);
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPlacing(true);
    setError('');

    try {
      // Map cart items to order items format
      const orderItems = cartItems.map(item => ({
        dish: item._id,
        quantity: item.quantity,
        price: item.price
      }));

      // Create order object
      const orderData = {
        items: orderItems,
        shippingAddress: {
          name: formData.name,
          phone: formData.phone,
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode
        },
        paymentMethod: formData.paymentMethod,
        deliveryNotes: formData.deliveryNotes,
        subTotal: subTotal,
        tax: parseFloat((subTotal * 0.08).toFixed(2)),
        deliveryFee: 3.99,
        total: parseFloat((subTotal + 3.99 + (subTotal * 0.08)).toFixed(2))
      };

      // Submit order
      const response = await orderService.createOrder(orderData);

      // Clear the cart
      localStorage.removeItem('cart');

      // Redirect to order confirmation
      navigate(`/orders/${response._id}`, { 
        state: { 
          success: true, 
          message: 'Your order has been placed successfully!' 
        }
      });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
      setPlacing(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* Checkout Form */}
        <div className="md:w-2/3">
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Delivery Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                    Full Name
                  </label>
                  <input
                    className="input"
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phone">
                    Phone Number
                  </label>
                  <input
                    className="input"
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="street">
                  Street Address
                </label>
                <input
                  className="input"
                  id="street"
                  name="street"
                  type="text"
                  value={formData.street}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
                    City
                  </label>
                  <input
                    className="input"
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="state">
                    State/Province
                  </label>
                  <input
                    className="input"
                    id="state"
                    name="state"
                    type="text"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="zipCode">
                    ZIP/Postal Code
                  </label>
                  <input
                    className="input"
                    id="zipCode"
                    name="zipCode"
                    type="text"
                    value={formData.zipCode}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
              
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <input
                    id="credit_card"
                    name="paymentMethod"
                    type="radio"
                    value="credit_card"
                    checked={formData.paymentMethod === 'credit_card'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="credit_card">Credit/Debit Card</label>
                </div>
                <div className="flex items-center mb-2">
                  <input
                    id="paypal"
                    name="paymentMethod"
                    type="radio"
                    value="paypal"
                    checked={formData.paymentMethod === 'paypal'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="paypal">PayPal</label>
                </div>
                <div className="flex items-center">
                  <input
                    id="cash"
                    name="paymentMethod"
                    type="radio"
                    value="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <label htmlFor="cash">Cash on Delivery</label>
                </div>
              </div>
              
              {formData.paymentMethod === 'credit_card' && (
                <div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cardNumber">
                      Card Number
                    </label>
                    <input
                      className="input"
                      id="cardNumber"
                      name="cardNumber"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      required={formData.paymentMethod === 'credit_card'}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cardExpiry">
                        Expiration Date (MM/YY)
                      </label>
                      <input
                        className="input"
                        id="cardExpiry"
                        name="cardExpiry"
                        type="text"
                        placeholder="MM/YY"
                        value={formData.cardExpiry}
                        onChange={handleChange}
                        required={formData.paymentMethod === 'credit_card'}
                      />
                    </div>
                    <div>
                      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cardCvv">
                        CVV
                      </label>
                      <input
                        className="input"
                        id="cardCvv"
                        name="cardCvv"
                        type="text"
                        placeholder="123"
                        value={formData.cardCvv}
                        onChange={handleChange}
                        required={formData.paymentMethod === 'credit_card'}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4">Additional Information</h2>
              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="deliveryNotes">
                  Delivery Notes
                </label>
                <textarea
                  className="input"
                  id="deliveryNotes"
                  name="deliveryNotes"
                  rows="3"
                  placeholder="Add any special delivery instructions here"
                  value={formData.deliveryNotes}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
          </form>
        </div>
        
        {/* Order Summary */}
        <div className="md:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="max-h-64 overflow-y-auto mb-4">
              {cartItems.map(item => (
                <div key={item._id} className="flex justify-between items-center py-2 border-b">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between py-2 border-b">
              <span>Subtotal</span>
              <span>${subTotal.toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between py-2 border-b">
              <span>Delivery Fee</span>
              <span>$3.99</span>
            </div>
            
            <div className="flex justify-between py-2 border-b">
              <span>Tax</span>
              <span>${(subTotal * 0.08).toFixed(2)}</span>
            </div>
            
            <div className="flex justify-between py-3 font-bold text-lg">
              <span>Total</span>
              <span>${(subTotal + 3.99 + (subTotal * 0.08)).toFixed(2)}</span>
            </div>
            
            <div className="mt-6">
              <button 
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleSubmit}
                disabled={placing}
              >
                {placing ? 'Placing Order...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
