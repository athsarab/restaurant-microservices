import React from 'react';

const CategoryFilter = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div>
      <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">Categories</h3>
      <div className="mt-4 space-y-2">
        <button
          onClick={() => onCategoryChange(null)}
          className={`w-full rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition ${
            activeCategory === null
              ? 'bg-primary-100 text-primary-800'
              : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
          }`}
        >
          All Dishes
        </button>
        {categories.map((category) => (
          <button
            key={category._id}
            onClick={() => onCategoryChange(category._id)}
            className={`w-full rounded-xl px-4 py-2.5 text-left text-sm font-semibold transition ${
              activeCategory === category._id
                ? 'bg-primary-100 text-primary-800'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
