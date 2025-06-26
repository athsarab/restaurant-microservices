import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { orderService } from '../services/api';

const OrderDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Check if there's a success message from checkout
    if (location.state?.success) {
      setSuccessMessage(location.state.message);
    }

    const fetchOrder = async () => {
      try {
        const data = await orderService.getOrderById(id);
        setOrder(data);
        setLoading(false);
      } catch (error) {
        setError('Failed to load order details. Please try again.');
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, location.state]);

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Helper function to get status badge color
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'out_for_delivery':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Helper function to get status steps
  const getStatusSteps = (status) => {
    const steps = [
      { name: 'Pending', status: 'pending' },
      { name: 'Processing', status: 'processing' },
      { name: 'Out for Delivery', status: 'out_for_delivery' },
      { name: 'Delivered', status: 'delivered' }
    ];
    
    const statusIndex = steps.findIndex(step => step.status === status);
    
    return steps.map((step, index) => ({
      ...step,
      state: index < statusIndex ? 'complete' : index === statusIndex ? 'current' : 'upcoming'
    }));
  };

  const handleCancelOrder = async () => {
    try {
      await orderService.cancelOrder(id);
      setOrder({ ...order, status: 'cancelled' });
      setSuccessMessage('Order cancelled successfully.');
    } catch (error) {
      setError('Failed to cancel the order. Please try again.');
    }
  };

  if (loading) {
    return <div className="text-center py-12">Loading order details...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
        <Link to="/orders" className="btn-primary">
          Back to Orders
        </Link>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-xl mb-4">Order not found.</p>
          <Link to="/orders" className="btn-primary">
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
          {successMessage}
        </div>
      )}
      
      <div className="flex flex-col sm:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-3xl font-bold">Order Details</h1>
          <p className="text-gray-600">Order #{order._id.substr(-8)}</p>
          <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
            {order.status.replace('_', ' ')}
          </span>
          
          {order.status === 'pending' && (
            <button
              onClick={handleCancelOrder}
              className="ml-3 bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-3 rounded focus:outline-none focus:shadow-outline"
            >
              Cancel Order
            </button>
          )}
        </div>
      </div>
      
      {order.status !== 'cancelled' && order.status !== 'delivered' && (
        <div className="mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Order Status</h2>
            
            <div className="relative">
              <div className="overflow-hidden h-2 mb-4 flex rounded bg-gray-200">
                {order.status === 'pending' && (
                  <div className="w-1/4 bg-primary-500"></div>
                )}
                {order.status === 'processing' && (
                  <div className="w-2/4 bg-primary-500"></div>
                )}
                {order.status === 'out_for_delivery' && (
                  <div className="w-3/4 bg-primary-500"></div>
                )}
                {order.status === 'delivered' && (
                  <div className="w-full bg-primary-500"></div>
                )}
              </div>
              
              <div className="flex justify-between">
                {getStatusSteps(order.status).map((step) => (
                  <div key={step.name} className="text-center">
                    <div className={`
                      w-6 h-6 mx-auto rounded-full flex items-center justify-center
                      ${step.state === 'complete' || step.state === 'current' ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-400'}
                    `}>
                      {step.state === 'complete' ? '✓' : ''}
                    </div>
                    <div className="text-xs mt-1">{step.name}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {order.estimatedDeliveryTime && (
              <p className="mt-4 text-center text-sm">
                Estimated delivery by {formatDate(order.estimatedDeliveryTime)}
              </p>
            )}
          </div>
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <h2 className="px-6 py-4 bg-gray-50 border-b font-semibold">Order Items</h2>
            <div className="divide-y">
              {order.items.map((item, index) => (
                <div key={index} className="px-6 py-4 flex justify-between items-center">
                  <div className="flex items-center">
                    {item.dish.image && (
                      <img 
                        src={item.dish.image} 
                        alt={item.dish.name} 
                        className="w-16 h-16 object-cover rounded mr-4" 
                      />
                    )}
                    <div>
                      <h3 className="font-medium">{item.dish.name}</h3>
                      <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <p className="font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <h2 className="px-6 py-4 bg-gray-50 border-b font-semibold">Shipping Address</h2>
              <div className="p-6">
                <p className="font-medium">{order.shippingAddress.name}</p>
                <p>{order.shippingAddress.street}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                </p>
                <p className="mt-2">{order.shippingAddress.phone}</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <h2 className="px-6 py-4 bg-gray-50 border-b font-semibold">Payment Information</h2>
              <div className="p-6">
                <p>
                  <span className="font-medium">Method: </span>
                  {order.paymentMethod.replace('_', ' ')}
                </p>
                <p>
                  <span className="font-medium">Status: </span>
                  {order.paymentStatus || 'Pending'}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="lg:w-1/3">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <h2 className="px-6 py-4 bg-gray-50 border-b font-semibold">Order Summary</h2>
            <div className="p-6">
              <div className="flex justify-between py-2 border-b">
                <span>Subtotal</span>
                <span>${order.subTotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b">
                <span>Delivery Fee</span>
                <span>${order.deliveryFee.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between py-2 border-b">
                <span>Tax</span>
                <span>${order.tax.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between py-3 font-bold text-lg">
                <span>Total</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Link 
              to="/orders" 
              className="block text-center bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Back to Orders
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
