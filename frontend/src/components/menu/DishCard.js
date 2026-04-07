import React from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { addItemToCart } from '../../utils/cart';

const DishCard = ({ dish }) => {
  const { _id, name, price, description, image, isVegetarian, isVegan, spicyLevel } = dish;

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=70'}
          alt={name}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          {isVegetarian && <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800">Vegetarian</span>}
          {isVegan && <span className="rounded-full bg-teal-100 px-2 py-1 text-xs font-semibold text-teal-800">Vegan</span>}
        </div>
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
          <span className="rounded-full bg-primary-50 px-3 py-1 text-sm font-bold text-primary-700">${price.toFixed(2)}</span>
        </div>

        <p className="line-clamp-2 text-sm text-slate-600">{description}</p>

        {spicyLevel > 0 && (
          <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-red-600">
            Spice level: {spicyLevel}/3
          </p>
        )}

        <div className="mt-4 flex gap-2">
          <Link to={`/menu/${_id}`} className="btn-outline flex-1 text-center text-xs">View</Link>
          <button
            className="btn-primary flex-1 text-xs"
            onClick={() => {
              addItemToCart(dish, 1);
              toast.success(`${name} added to cart`);
            }}
          >
            Add to cart
          </button>
        </div>
      </div>
    </article>
  );
};

export default DishCard;
