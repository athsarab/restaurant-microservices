import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { menuService } from '../services/api';
import DishCard from '../components/menu/DishCard';
import CategoryFilter from '../components/menu/CategoryFilter';

const Menu = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [dishes, setDishes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || null);
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState({
    isVegetarian: false,
    isVegan: false,
    isGlutenFree: false,
    sortBy: 'name-asc'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch categories
        const categoriesData = await menuService.getCategories();
        setCategories(categoriesData);
        
        // Fetch dishes (filtered by category if needed)
        let dishesData;
        if (activeCategory) {
          dishesData = await menuService.getDishesByCategory(activeCategory);
        } else {
          dishesData = await menuService.getAllDishes();
        }
        setDishes(dishesData);
      } catch (error) {
        console.error('Error fetching menu data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [activeCategory]);

  const handleCategoryChange = (categoryId) => {
    setActiveCategory(categoryId);
    
    // Update URL query parameters
    if (categoryId) {
      setSearchParams({ category: categoryId });
    } else {
      setSearchParams({});
    }
  };

  const handleFilterChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFilterOptions(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Apply filters and sorting
  const filteredDishes = dishes.filter(dish => {
    if (filterOptions.isVegetarian && !dish.isVegetarian) return false;
    if (filterOptions.isVegan && !dish.isVegan) return false;
    if (filterOptions.isGlutenFree && !dish.isGlutenFree) return false;
    return true;
  });
  
  // Sort dishes
  const sortedDishes = [...filteredDishes].sort((a, b) => {
    switch (filterOptions.sortBy) {
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      default:
        return 0;
    }
  });

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Our Menu</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar with filters */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-8">
              <CategoryFilter 
                categories={categories} 
                activeCategory={activeCategory} 
                onCategoryChange={handleCategoryChange} 
              />
              
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      id="isVegetarian"
                      name="isVegetarian"
                      type="checkbox"
                      checked={filterOptions.isVegetarian}
                      onChange={handleFilterChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isVegetarian" className="ml-2 text-sm text-gray-700">
                      Vegetarian
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="isVegan"
                      name="isVegan"
                      type="checkbox"
                      checked={filterOptions.isVegan}
                      onChange={handleFilterChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isVegan" className="ml-2 text-sm text-gray-700">
                      Vegan
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="isGlutenFree"
                      name="isGlutenFree"
                      type="checkbox"
                      checked={filterOptions.isGlutenFree}
                      onChange={handleFilterChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="isGlutenFree" className="ml-2 text-sm text-gray-700">
                      Gluten Free
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-6 mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Sort By</h3>
                <select
                  id="sortBy"
                  name="sortBy"
                  value={filterOptions.sortBy}
                  onChange={handleFilterChange}
                  className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="name-asc">Name (A-Z)</option>
                  <option value="name-desc">Name (Z-A)</option>
                  <option value="price-asc">Price (Low to High)</option>
                  <option value="price-desc">Price (High to Low)</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Menu items grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="animate-pulse">
                      <div className="h-48 bg-gray-200 w-full"></div>
                      <div className="p-4">
                        <div className="h-5 bg-gray-200 rounded mb-2 w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-4 w-1/4"></div>
                        <div className="h-4 bg-gray-200 rounded mb-2 w-full"></div>
                        <div className="h-4 bg-gray-200 rounded mb-4 w-5/6"></div>
                        <div className="flex space-x-2">
                          <div className="h-9 bg-gray-200 rounded flex-1"></div>
                          <div className="h-9 bg-gray-200 rounded flex-1"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : sortedDishes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedDishes.map((dish) => (
                  <DishCard key={dish._id} dish={dish} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No dishes found</h3>
                <p className="mt-1 text-sm text-gray-500">Try changing your filters or selecting a different category.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;
