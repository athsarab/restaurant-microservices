import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { menuService } from '../services/api';
import { addItemToCart } from '../utils/cart';
import { toast } from 'react-toastify';

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

        setPopularDishes(dishesResponse.slice(0, 6));
        setCategories(categoriesResponse.slice(0, 6));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = useMemo(() => ([
    { label: 'Avg delivery', value: '45 min' },
    { label: 'Chef-curated dishes', value: '120+' },
    { label: 'Happy diners', value: '8.5k' }
  ]), []);

  return (
    <div className="space-y-14 pb-10">
      <section className="relative overflow-hidden rounded-3xl border border-white/60 bg-slate-900 text-white shadow-2xl">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1800&q=80"
            alt="Restaurant ambiance"
            className="h-full w-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 to-slate-800/35" />
        </div>

        <div className="relative grid gap-10 px-6 py-14 sm:px-10 lg:grid-cols-2 lg:items-end lg:px-14 lg:py-20">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="text-xs uppercase tracking-[0.25em] text-secondary-300">Fine Dining At Home</p>
            <h1 className="mt-4 font-display text-4xl leading-tight sm:text-5xl">
              Elevated flavors,
              <br />
              delivered beautifully.
            </h1>
            <p className="mt-5 max-w-lg text-sm text-slate-200 sm:text-base">
              Discover signature mains, comforting bowls, and handcrafted desserts with a smooth, modern ordering flow from menu to doorstep.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/menu" className="btn-secondary">Explore Menu</Link>
              <Link to="/cart" className="btn border border-white/40 bg-white/10 text-white hover:bg-white/20">Open Cart</Link>
            </div>
          </motion.div>

          <div className="grid grid-cols-3 gap-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-white/20 bg-white/10 p-4 text-center backdrop-blur">
                <p className="font-display text-2xl text-secondary-300">{stat.value}</p>
                <p className="mt-1 text-xs text-slate-200">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-shell p-6 sm:p-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl">Guest Favorites</h2>
            <p className="mt-2 text-sm text-slate-600">Most loved dishes this week, picked by our diners.</p>
          </div>
          <Link to="/menu" className="btn-outline">See full menu</Link>
        </div>

        {loading ? (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-72 animate-pulse rounded-2xl bg-slate-100" />
            ))}
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {popularDishes.map((dish, index) => (
              <motion.article
                key={dish._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="group overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={dish.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=70'}
                    alt={dish.name}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                  <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-primary-700">
                    ${dish.price.toFixed(2)}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-slate-900">{dish.name}</h3>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-600">{dish.description}</p>
                  <div className="mt-4 flex gap-2">
                    <Link to={`/menu/${dish._id}`} className="btn-outline flex-1 text-center text-xs">Details</Link>
                    <button
                      onClick={() => {
                        addItemToCart(dish, 1);
                        toast.success(`${dish.name} added to cart`);
                      }}
                      className="btn-primary flex-1 text-xs"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        {categories.map((category) => (
          <Link
            key={category._id}
            to={`/menu?category=${category._id}`}
            className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-primary-300 hover:shadow-lg"
          >
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Category</p>
            <h3 className="mt-2 font-display text-2xl text-slate-900 group-hover:text-primary-700">{category.name}</h3>
            <p className="mt-2 text-sm text-slate-600 line-clamp-2">{category.description || 'Discover handpicked dishes prepared fresh for this category.'}</p>
            <span className="mt-5 inline-flex text-sm font-semibold text-primary-700">Browse now</span>
          </Link>
        ))}
      </section>
    </div>
  );
};

export default Home;
