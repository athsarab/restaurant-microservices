import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Taste of Heaven</h2>
            <p className="text-gray-300 mb-4">
              Delicious food, delivered to your doorstep. Explore our menu of fresh, chef-prepared dishes and order with ease.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465.675.258 1.246.627 1.811 1.192.566.566.934 1.136 1.192 1.811.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427-.258.675-.627 1.246-1.192 1.811-.566.566-1.136.934-1.811 1.192-.636.247-1.363.416-2.427.465-1.056.048-1.4.06-4.123.06-2.724 0-3.067-.012-4.123-.06-1.064-.049-1.791-.218-2.427-.465-.675-.258-1.246-.627-1.811-1.192-.566-.566-.934-1.136-1.192-1.811-.247-.636-.416-1.363-.465-2.427-.048-1.056-.06-1.4-.06-4.123 0-2.724.012-3.067.06-4.123.049-1.064.218-1.791.465-2.427.258-.675.627-1.246 1.192-1.811.566-.566 1.136-.934 1.811-1.192.636-.247 1.363-.416 2.427-.465.061-.003.12-.005.18-.008.26.015.52.021.78.021h2.868c2.724 0 3.067.012 4.123.06 1.064.049 1.791.218 2.427.465.675.258 1.246.627 1.811 1.192.566.566.934 1.136 1.192 1.811.247.636.416 1.363.465 2.427.048 1.056.06 1.4.06 4.123 0 2.724-.012 3.067-.06 4.123-.049 1.064-.218 1.791-.465 2.427-.258.675-.627 1.246-1.192 1.811-.566.566-1.136.934-1.811 1.192-.636.247-1.363.416-2.427.465-1.056.048-1.4.06-4.123.06-2.722 0-3.065-.012-4.121-.06-1.064-.049-1.789-.218-2.425-.465-.675-.258-1.246-.627-1.811-1.192-.566-.566-.934-1.136-1.192-1.811-.247-.636-.416-1.363-.465-2.428C2.013 15.056 2.001 14.713 2 12c0-2.722.013-3.065.06-4.121.049-1.064.218-1.789.465-2.425.258-.675.627-1.246 1.192-1.81.566-.567 1.136-.935 1.811-1.193.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63z" clipRule="evenodd" />
                  <path d="M12 15.316a3.316 3.316 0 100-6.632 3.316 3.316 0 000 6.632zm0-8.42a5.105 5.105 0 110 10.21 5.105 5.105 0 010-10.21z" />
                  <path d="M17.824 6.995a1.2 1.2 0 100-2.4 1.2 1.2 0 000 2.4z" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-300 hover:text-white">Home</Link></li>
              <li><Link to="/menu" className="text-gray-300 hover:text-white">Menu</Link></li>
              <li><Link to="/about" className="text-gray-300 hover:text-white">About</Link></li>
              <li><Link to="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Contact Us</h3>
            <address className="text-gray-300 not-italic space-y-2">
              <p>123 Restaurant Street</p>
              <p>Colombo, Sri Lanka</p>
              <p>Email: info@restaurant.com</p>
              <p>Phone: +94 11 234 5678</p>
            </address>
          </div>
        </div>
        
        <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between">
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} Taste of Heaven. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-gray-400">
            <Link to="/terms" className="hover:text-white">Terms of Service</Link>
            <Link to="/privacy" className="hover:text-white">Privacy Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
