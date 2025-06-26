import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subTotal, setSubTotal] = useState(0);
  const { isAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    // Fetch cart items from localStorage
    const fetchCartItems = () => {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        setCartItems(parsedCart);

        // Calculate subtotal
        const total = parsedCart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        setSubTotal(total);
      }
    };

    fetchCartItems();
  }, []);

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    const updatedItems = cartItems.map(item => 
      item._id === id ? { ...item, quantity: newQuantity } : item
    );
    
    setCartItems(updatedItems);
    localStorage.setItem('cart', JSON.stringify(updatedItems));

    // Recalculate subtotal
    const total = updatedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setSubTotal(total);
  };

  const removeFromCart = (id) => {
    const updatedItems = cartItems.filter(item => item._id !== id);
    setCartItems(updatedItems);
    
    if (updatedItems.length === 0) {
      localStorage.removeItem('cart');
    } else {
      localStorage.setItem('cart', JSON.stringify(updatedItems));
    }

    // Recalculate subtotal
    const total = updatedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setSubTotal(total);
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <p className="text-xl mb-4">Your cart is empty</p>
            <Link to="/menu" className="btn-primary">
              Browse Our Menu
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Cart Items */}
        <div className="md:w-2/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2">Item</th>
                  <th className="text-right py-2">Price</th>
                  <th className="text-center py-2">Quantity</th>
                  <th className="text-right py-2">Total</th>
                  <th className="py-2"></th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => (
                  <tr key={item._id} className="border-b">
                    <td className="py-4">
                      <div className="flex items-center">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-16 h-16 object-cover rounded mr-4" 
                          />
                        )}
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          {item.options && (
                            <p className="text-sm text-gray-500">
                              {Object.entries(item.options)
                                .map(([key, value]) => `${key}: ${value}`)
                                .join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="text-right py-4">${item.price.toFixed(2)}</td>
                    <td className="py-4">
                      <div className="flex items-center justify-center">
                        <button 
                          className="px-2 py-1 border rounded-l"
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        >
                          -
                        </button>
                        <span className="px-4">{item.quantity}</span>
                        <button 
                          className="px-2 py-1 border rounded-r"
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="text-right py-4 font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="text-right py-4">
                      <button 
                        className="text-red-500 hover:text-red-700"
                        onClick={() => removeFromCart(item._id)}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="md:w-1/3">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
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
              {isAuthenticated ? (
                <Link 
                  to="/checkout" 
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline block text-center"
                >
                  Proceed to Checkout
                </Link>
              ) : (
                <Link 
                  to="/login" 
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline block text-center"
                >
                  Login to Checkout
                </Link>
              )}
              
              <Link 
                to="/menu" 
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded focus:outline-none focus:shadow-outline block text-center mt-4"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
