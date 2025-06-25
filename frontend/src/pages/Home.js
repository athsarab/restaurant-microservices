import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { menuService } from '../services/api';

const Home = () => {
  const [popularDishes, setPopularDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dishesResponse, categoriesResponse] = await Promise.all([
          menuService.getAllDishes(),
          menuService.getCategories()
        ]);
        
        // Simulate popular dishes by taking the first 4
        setPopularDishes(dishesResponse.slice(0, 4));
        setCategories(categoriesResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const heroVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      }
    }
  };

  const dishVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: i => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      }
    })
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-gray-900 to-gray-800 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1576866209830-589e1bfbaa4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80" 
            alt="Restaurant background"
            className="w-full h-full object-cover opacity-30" 
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
          <motion.div 
            className="text-center"
            initial="hidden"
            animate="visible"
            variants={heroVariants}
          >
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Delicious Food, Delivered to Your Door
            </h1>
            <p className="mt-6 text-xl max-w-3xl mx-auto">
              Experience the finest cuisine with our restaurant's signature dishes, prepared with fresh ingredients and delivered right to your doorstep.
            </p>
            <div className="mt-10 flex justify-center space-x-6">
              <Link
                to="/menu"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
              >
                View Menu
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gray-700 bg-opacity-60 hover:bg-opacity-70"
              >
                About Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Popular Dishes Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Most Popular Dishes
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-gray-500 sm:mt-4">
              Try our chef's recommended dishes that our customers love the most.
            </p>
          </div>

          {loading ? (
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="animate-pulse">
                    <div className="bg-gray-200 h-48 w-full"></div>
                    <div className="p-4">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                      <div className="mt-4 flex space-x-2">
                        <div className="h-10 bg-gray-200 rounded flex-1"></div>
                        <div className="h-10 bg-gray-200 rounded flex-1"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {popularDishes.map((dish, index) => (
                <motion.div
                  key={dish._id}
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={dishVariants}
                  className="bg-white rounded-lg shadow-md overflow-hidden transition-shadow hover:shadow-lg"
                >
                  <div className="relative h-48">
                    <img 
                      src={dish.image || `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60`} 
                      alt={dish.name}
                      className="w-full h-full object-cover" 
                    />
                    {dish.isVegetarian && (
                      <div className="absolute top-2 left-2 bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                        Vegetarian
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between">
                      <h3 className="font-medium text-gray-900">{dish.name}</h3>
                      <p className="font-medium text-primary-600">${dish.price.toFixed(2)}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{dish.description}</p>
                    <div className="mt-4 flex space-x-2">
                      <Link
                        to={`/menu/${dish._id}`}
                        className="flex-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-primary-700 bg-primary-50 hover:bg-primary-100"
                      >
                        View Details
                      </Link>
                      <button
                        type="button"
                        className="flex-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          <div className="mt-12 text-center">
            <Link
              to="/menu"
              className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              View Full Menu
              <svg className="ml-2 -mr-1 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Browse by Category
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-gray-500 sm:mt-4">
              Find your favorite meals by category
            </p>
          </div>

          {loading ? (
            <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="animate-pulse bg-white rounded-lg shadow-sm p-6">
                  <div className="h-24 w-24 mx-auto bg-gray-200 rounded-full mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mx-auto w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="mt-12 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {categories.map((category, index) => (
                <Link
                  key={category._id}
                  to={`/menu?category=${category._id}`}
                  className="group bg-white rounded-lg shadow-sm p-6 text-center transition-transform hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="h-24 w-24 mx-auto bg-primary-100 rounded-full flex items-center justify-center mb-4 group-hover:bg-primary-200">
                    <svg className="h-12 w-12 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary-600">
                    {category.name}
                  </h3>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Testimonials/Features */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Why Choose Us
            </h2>
            <p className="mt-3 max-w-2xl mx-auto text-gray-500 sm:mt-4">
              We pride ourselves on quality service and delicious food
            </p>
          </div>
          
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="bg-primary-100 rounded-full h-12 w-12 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Quality Ingredients</h3>
              <p className="text-gray-500">We source the freshest ingredients from local farmers to ensure quality and taste in every dish.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="bg-primary-100 rounded-full h-12 w-12 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-500">Our dedicated delivery team ensures your food arrives hot and fresh within 45 minutes or less.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="bg-primary-100 rounded-full h-12 w-12 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Easy Ordering</h3>
              <p className="text-gray-500">Our simple online ordering system makes it easy to customize and place your order in just a few clicks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative bg-primary-700">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8 relative z-10">
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            <span className="block">Hungry right now?</span>
            <span className="block">Order online for delivery or pickup.</span>
          </h2>
          <div className="mt-8 flex space-x-4">
            <Link
              to="/menu"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-700 bg-white hover:bg-gray-50"
            >
              Order Now
            </Link>
            <Link
              to="/contact"
              className="inline-flex items-center justify-center px-5 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-primary-800"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
