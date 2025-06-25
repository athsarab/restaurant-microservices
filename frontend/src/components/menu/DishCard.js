import React from 'react';
import { Link } from 'react-router-dom';

const DishCard = ({ dish }) => {
  const { _id, name, price, description, image, isVegetarian, spicyLevel } = dish;
  
  // Generate spice indicators based on spicy level
  const renderSpiceLevel = (level) => {
    const spiceIcons = [];
    for (let i = 0; i < level; i++) {
      spiceIcons.push(
        <svg 
          key={i} 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-4 w-4 text-red-500" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
        </svg>
      );
    }
    return spiceIcons;
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60'}
          alt={name} 
          className="w-full h-full object-cover"
        />
        {isVegetarian && (
          <div className="absolute top-2 left-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium">
            Vegetarian
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
          <span className="font-medium text-primary-600">${price.toFixed(2)}</span>
        </div>
        <p className="text-gray-600 text-sm line-clamp-2 mb-4">{description}</p>
        {spicyLevel > 0 && (
          <div className="flex items-center mb-4">
            <span className="text-xs text-gray-500 mr-2">Spice level:</span>
            <div className="flex space-x-1">
              {renderSpiceLevel(spicyLevel)}
            </div>
          </div>
        )}
        <div className="flex space-x-2">
          <Link 
            to={`/menu/${_id}`}
            className="btn-outline text-xs py-1.5 flex-1"
          >
            View Details
          </Link>
          <button
            className="btn-primary text-xs py-1.5 flex-1"
            onClick={() => console.log('Add to cart:', dish)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default DishCard;
