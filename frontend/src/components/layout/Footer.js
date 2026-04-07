import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-slate-950 text-slate-200">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="lg:col-span-2">
          <h2 className="font-display text-2xl text-white">Taste of Heaven</h2>
          <p className="mt-4 max-w-xl text-sm leading-7 text-slate-300">
            Freshly prepared dishes, crafted by chefs, delivered fast. Built for easy ordering and a smooth dining experience from menu to checkout.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-xs uppercase tracking-wider text-slate-400">
            <span className="rounded-full border border-slate-700 px-3 py-1">45 min delivery</span>
            <span className="rounded-full border border-slate-700 px-3 py-1">Live order status</span>
            <span className="rounded-full border border-slate-700 px-3 py-1">Fresh ingredients</span>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-slate-100">Explore</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            <li><Link to="/" className="hover:text-white">Home</Link></li>
            <li><Link to="/menu" className="hover:text-white">Menu</Link></li>
            <li><Link to="/cart" className="hover:text-white">Cart</Link></li>
            <li><Link to="/orders" className="hover:text-white">Orders</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-[0.15em] text-slate-100">Contact</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <p>12 Cinnamon Garden Road, Colombo</p>
            <p>+94 11 245 9090</p>
            <p>hello@tasteofheaven.lk</p>
            <p>Open daily: 10:00 AM - 11:00 PM</p>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>&copy; {new Date().getFullYear()} Taste of Heaven. All rights reserved.</p>
          <p>Designed for a smoother, friendlier ordering experience.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
