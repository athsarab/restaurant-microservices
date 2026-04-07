import React, { useContext, useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon, ShoppingBagIcon } from '@heroicons/react/24/outline';
import { getCartCount } from '../../utils/cart';

const Header = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Menu', href: '/menu' },
    { name: 'Orders', href: '/orders', protected: true }
  ];

  useEffect(() => {
    const syncCount = () => setCartCount(getCartCount());
    syncCount();
    window.addEventListener('cart-updated', syncCount);
    window.addEventListener('storage', syncCount);

    return () => {
      window.removeEventListener('cart-updated', syncCount);
      window.removeEventListener('storage', syncCount);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const linkClasses = ({ isActive }) => (
    `${isActive ? 'text-primary-700' : 'text-slate-600 hover:text-primary-600'} text-sm font-semibold transition-colors`
  );

  return (
    <Disclosure as="header" className="sticky top-0 z-50 border-b border-white/60 bg-white/85 backdrop-blur-md">
      {({ open }) => (
        <>
          <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-8">
              <Link to="/" className="group flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-700 to-secondary-500 text-white shadow-lg shadow-secondary-200/60">
                  T
                </div>
                <div>
                  <p className="font-display text-xl leading-5 text-slate-900">Taste of Heaven</p>
                  <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Craft Kitchen</p>
                </div>
              </Link>

              <nav className="hidden items-center gap-6 md:flex">
                {navigation.filter((item) => !item.protected || isAuthenticated).map((item) => (
                  <NavLink key={item.name} to={item.href} className={linkClasses}>
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <Link
                to="/cart"
                className="relative inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-primary-200 hover:text-primary-700"
              >
                <ShoppingBagIcon className="h-5 w-5" />
                Cart
                {cartCount > 0 && (
                  <span className="absolute -right-2 -top-2 inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-secondary-500 px-1 text-xs font-bold text-white">
                    {cartCount}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <Menu as="div" className="relative">
                  <Menu.Button className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 text-left hover:border-primary-200">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 font-bold uppercase text-primary-700">
                      {user?.name?.charAt(0) || 'U'}
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{user?.name || 'Account'}</span>
                  </Menu.Button>
                  <Transition
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-slate-100 bg-white shadow-xl">
                      <Menu.Item>
                        {({ active }) => (
                          <Link className={`${active ? 'bg-slate-50' : ''} block px-4 py-3 text-sm`} to="/profile">Profile</Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Link className={`${active ? 'bg-slate-50' : ''} block px-4 py-3 text-sm`} to="/orders">My Orders</Link>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={handleLogout}
                            className={`${active ? 'bg-slate-50' : ''} block w-full px-4 py-3 text-left text-sm text-red-600`}
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              ) : (
                <>
                  <Link to="/login" className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Sign in</Link>
                  <Link to="/register" className="rounded-xl bg-primary-700 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-primary-800">Create account</Link>
                </>
              )}
            </div>

            <div className="md:hidden">
              <Disclosure.Button className="rounded-lg p-2 text-slate-700 hover:bg-slate-100">
                {open ? <XMarkIcon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
              </Disclosure.Button>
            </div>
          </div>

          <Disclosure.Panel className="border-t border-slate-100 bg-white px-4 pb-4 pt-2 md:hidden">
            <div className="space-y-2">
              {navigation.filter((item) => !item.protected || isAuthenticated).map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as={NavLink}
                  to={item.href}
                  className={({ isActive }) => `${isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-700'} block rounded-lg px-3 py-2 text-sm font-medium`}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
              <Disclosure.Button as={NavLink} to="/cart" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700">
                Cart ({cartCount})
              </Disclosure.Button>
              {isAuthenticated ? (
                <>
                  <Disclosure.Button as={NavLink} to="/profile" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700">Profile</Disclosure.Button>
                  <Disclosure.Button onClick={handleLogout} className="block rounded-lg px-3 py-2 text-left text-sm font-medium text-red-600">Sign out</Disclosure.Button>
                </>
              ) : (
                <>
                  <Disclosure.Button as={NavLink} to="/login" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700">Sign in</Disclosure.Button>
                  <Disclosure.Button as={NavLink} to="/register" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-700">Create account</Disclosure.Button>
                </>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Header;
