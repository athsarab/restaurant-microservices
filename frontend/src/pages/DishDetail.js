import React, { useState, useContext, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { menuService, reviewService } from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const DishDetail = () => {
  const { id } = useParams();
  const { isAuthenticated } = useContext(AuthContext);
  const [dish, setDish] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviewText, setReviewText] = useState('');
  const [rating, setRating] = useState(5); 
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [relatedDishes, setRelatedDishes] = useState([]); 

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch dish details
        const dishData = await menuService.getDishById(id);
        setDish(dishData);
        
        // Fetch reviews for this dish
        try {
          const reviewsData = await reviewService.getDishReviews(id);
          setReviews(reviewsData);
        } catch (err) {
          console.error('Error fetching reviews:', err);
          // Don't fail the whole page if reviews fail to load
          setReviews([]);
        }
        
        // Fetch related dishes from the same category
        if (dishData.category) {
          try {
            const categoryDishes = await menuService.getDishesByCategory(dishData.category._id);
            // Filter out the current dish and limit to 3
            const related = categoryDishes
              .filter(d => d._id !== id)
              .slice(0, 3);
            setRelatedDishes(related);
          } catch (err) {
            console.error('Error fetching related dishes:', err);
            setRelatedDishes([]);
          }
        }
      } catch (error) {
        console.error('Error fetching dish details:', error);
        toast.error('Failed to load dish details');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    // Reset state when dish ID changes
    return () => {
      setDish(null);
      setReviews([]);
      setQuantity(1);
    };
  }, [id]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const addToCart = () => {
    // Add to cart implementation
    toast.success(`Added ${quantity} ${dish.name} to cart`);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('You must be logged in to leave a review');
      return;
    }
    
    if (!reviewText.trim()) {
      toast.error('Please enter a review');
      return;
    }

    try {
      setReviewSubmitting(true);
      await reviewService.createReview({
        dish: id,
        rating,
        comment: reviewText
      });
      
      // Refresh reviews
      const updatedReviews = await reviewService.getDishReviews(id);
      setReviews(updatedReviews);
      
      // Reset form
      setReviewText('');
      setRating(5);
      toast.success('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Generate stars for ratings
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <svg 
          key={i} 
          className={`h-5 w-5 ${i <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-200 h-96 rounded-lg"></div>
            <div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
              
              <div className="h-10 bg-gray-200 rounded w-1/3 mb-6"></div>
              
              <div className="flex space-x-4 mb-8">
                <div className="h-12 bg-gray-200 rounded w-32"></div>
                <div className="h-12 bg-gray-200 rounded flex-1"></div>
              </div>
              
              <div className="h-24 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!dish) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900">Dish not found</h2>
        <p className="mt-2 text-gray-600">The dish you're looking for doesn't exist or has been removed.</p>
        <Link to="/menu" className="mt-6 inline-block btn-primary">
          Return to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex mb-8" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <Link to="/menu" className="ml-2 text-gray-500 hover:text-gray-700">Menu</Link>
            </li>
            <li className="flex items-center">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
              <span className="ml-2 text-gray-900 font-medium">{dish.name}</span>
            </li>
          </ol>
        </nav>
      
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Dish Image */}
          <div className="aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden">
            <img 
              src={dish.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'} 
              alt={dish.name} 
              className="w-full h-full object-center object-cover" 
            />
          </div>
          
          {/* Dish Details */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{dish.name}</h1>
            <p className="text-xl text-primary-600 font-medium mt-2">${dish.price.toFixed(2)}</p>
            
            <div className="mt-6">
              <h3 className="text-lg font-medium text-gray-900">Description</h3>
              <p className="mt-2 text-gray-600">{dish.description}</p>
            </div>
            
            <div className="mt-6">
              <div className="flex items-center">
                <div className="flex items-center">
                  {renderStars(4.5)}
                </div>
                <p className="ml-3 text-sm text-gray-500">{reviews.length} reviews</p>
              </div>
            </div>
            
            <div className="mt-6 flex items-center">
              {dish.isVegetarian && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                  Vegetarian
                </span>
              )}
              {dish.isVegan && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mr-2">
                  Vegan
                </span>
              )}
              {dish.isGlutenFree && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                  Gluten-Free
                </span>
              )}
              {dish.spicyLevel > 0 && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Spicy Level: {dish.spicyLevel}/3
                </span>
              )}
            </div>
            
            <div className="mt-8">
              <div className="flex items-center">
                <label htmlFor="quantity" className="mr-4 text-gray-700">Quantity:</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  min="1"
                  value={quantity}
                  onChange={handleQuantityChange}
                  className="block w-20 h-10 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
                <span className="ml-4 text-gray-500">
                  Preparation time: {dish.preparationTime} mins
                </span>
              </div>
              
              <div className="mt-6">
                <button
                  type="button"
                  onClick={addToCart}
                  className="w-full bg-primary-600 py-3 px-8 rounded-md text-white font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Add to Cart - ${(dish.price * quantity).toFixed(2)}
                </button>
              </div>
            </div>
            
            {dish.ingredients && dish.ingredients.length > 0 && (
              <div className="mt-8 border-t border-gray-200 pt-8">
                <h3 className="text-lg font-medium text-gray-900">Ingredients</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {dish.ingredients.map((ingredient, index) => (
                    <span 
                      key={index} 
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Reviews Section */}
        <div className="mt-16 border-t border-gray-200 pt-10">
          <h2 className="text-2xl font-bold text-gray-900">Customer Reviews</h2>
          
          {reviews.length > 0 ? (
            <div className="mt-6 space-y-10">
              {reviews.map((review) => (
                <div key={review._id} className="border-b border-gray-200 pb-8">
                  <div className="flex items-center mb-4">
                    <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 uppercase font-semibold">
                      {review.user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="ml-4">
                      <h4 className="text-sm font-medium text-gray-900">{review.user?.name || 'Anonymous'}</h4>
                      <div className="mt-1 flex items-center">
                        <div className="flex">
                          {renderStars(review.rating)}
                        </div>
                        <span className="ml-2 text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-gray-500">No reviews yet. Be the first to review this dish!</p>
          )}
          
          {/* Add a Review Form */}
          {isAuthenticated ? (
            <form onSubmit={handleReviewSubmit} className="mt-8">
              <h3 className="text-lg font-medium text-gray-900">Leave a Review</h3>
              <div className="mt-4">
                <label htmlFor="rating" className="block text-sm font-medium text-gray-700">Rating</label>
                <div className="mt-1 flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="mr-1 focus:outline-none"
                    >
                      <svg 
                        className={`h-6 w-6 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-500">{rating} out of 5 stars</span>
                </div>
              </div>
              <div className="mt-4">
                <label htmlFor="review" className="block text-sm font-medium text-gray-700">Review</label>
                <div className="mt-1">
                  <textarea
                    id="review"
                    name="review"
                    rows={4}
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    required
                    className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Share your thoughts on this dish..."
                  ></textarea>
                </div>
              </div>
              <div className="mt-4">
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                >
                  {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-8 bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-700">
                Please <Link to="/login" className="text-primary-600 font-medium hover:text-primary-500">sign in</Link> to leave a review.
              </p>
            </div>
          )}
        </div>
        
        {/* Related Dishes */}
        {relatedDishes.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900">You May Also Like</h2>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
              {relatedDishes.map((relatedDish) => (
                <Link 
                  key={relatedDish._id} 
                  to={`/menu/${relatedDish._id}`}
                  className="group"
                >
                  <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={relatedDish.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'}
                      alt={relatedDish.name}
                      className="object-center object-cover group-hover:opacity-75"
                    />
                  </div>
                  <h3 className="mt-4 text-sm text-gray-700">{relatedDish.name}</h3>
                  <p className="mt-1 text-lg font-medium text-gray-900">${relatedDish.price.toFixed(2)}</p>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DishDetail;
