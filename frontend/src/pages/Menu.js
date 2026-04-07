import React, { useEffect, useMemo, useState } from 'react';
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
        const categoriesData = await menuService.getCategories();
        setCategories(categoriesData);

        const dishesData = activeCategory
          ? await menuService.getDishesByCategory(activeCategory)
          : await menuService.getAllDishes();

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
    if (categoryId) {
      setSearchParams({ category: categoryId });
    } else {
      setSearchParams({});
    }
  };

  const handleFilterChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFilterOptions((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const sortedDishes = useMemo(() => {
    const filtered = dishes.filter((dish) => {
      if (filterOptions.isVegetarian && !dish.isVegetarian) return false;
      if (filterOptions.isVegan && !dish.isVegan) return false;
      if (filterOptions.isGlutenFree && !dish.isGlutenFree) return false;
      return true;
    });

    return [...filtered].sort((a, b) => {
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
  }, [dishes, filterOptions]);

  return (
    <div className="space-y-8 pb-10">
      <section className="page-shell p-6 sm:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Menu</p>
            <h1 className="mt-2 text-4xl">Find your next favorite meal</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Filter by dietary preference, browse categories, and add items quickly with a mobile-friendly experience.
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm">
            <span className="font-semibold text-slate-900">{sortedDishes.length}</span>
            <span className="ml-1 text-slate-600">dishes available</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <aside className="space-y-4 lg:col-span-1">
          <div className="page-shell p-5 lg:sticky lg:top-24">
            <CategoryFilter
              categories={categories}
              activeCategory={activeCategory}
              onCategoryChange={handleCategoryChange}
            />

            <div className="mt-6 border-t border-slate-200 pt-6">
              <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">Diet</h3>
              <div className="mt-3 space-y-3 text-sm">
                <label className="flex items-center gap-2">
                  <input id="isVegetarian" name="isVegetarian" type="checkbox" checked={filterOptions.isVegetarian} onChange={handleFilterChange} />
                  Vegetarian
                </label>
                <label className="flex items-center gap-2">
                  <input id="isVegan" name="isVegan" type="checkbox" checked={filterOptions.isVegan} onChange={handleFilterChange} />
                  Vegan
                </label>
                <label className="flex items-center gap-2">
                  <input id="isGlutenFree" name="isGlutenFree" type="checkbox" checked={filterOptions.isGlutenFree} onChange={handleFilterChange} />
                  Gluten free
                </label>
              </div>
            </div>

            <div className="mt-6 border-t border-slate-200 pt-6">
              <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">Sort by</h3>
              <select
                id="sortBy"
                name="sortBy"
                value={filterOptions.sortBy}
                onChange={handleFilterChange}
                className="input mt-3"
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
              </select>
            </div>
          </div>
        </aside>

        <section className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {[...Array(9)].map((_, i) => (
                <div key={i} className="h-72 animate-pulse rounded-2xl bg-slate-100" />
              ))}
            </div>
          ) : sortedDishes.length > 0 ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {sortedDishes.map((dish) => (
                <DishCard key={dish._id} dish={dish} />
              ))}
            </div>
          ) : (
            <div className="page-shell p-12 text-center">
              <h3 className="text-2xl">No dishes found</h3>
              <p className="mt-2 text-sm text-slate-600">Try changing filters or selecting another category.</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default Menu;
