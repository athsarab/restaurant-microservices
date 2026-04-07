const CART_KEY = 'cart';

const readCart = () => {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    return [];
  }
};

const writeCart = (items) => {
  if (!items.length) {
    localStorage.removeItem(CART_KEY);
  } else {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }

  window.dispatchEvent(new Event('cart-updated'));
};

export const getCartItems = () => readCart();

export const getCartCount = () => readCart().reduce((sum, item) => sum + item.quantity, 0);

export const addItemToCart = (dish, quantity = 1) => {
  const items = readCart();
  const existingIndex = items.findIndex((item) => item._id === dish._id);

  if (existingIndex >= 0) {
    items[existingIndex].quantity += quantity;
  } else {
    items.push({
      _id: dish._id,
      name: dish.name,
      price: dish.price,
      image: dish.image,
      quantity
    });
  }

  writeCart(items);
  return items;
};

export const updateCartQuantity = (id, quantity) => {
  const items = readCart().map((item) => (
    item._id === id ? { ...item, quantity } : item
  )).filter((item) => item.quantity > 0);

  writeCart(items);
  return items;
};

export const removeCartItem = (id) => {
  const items = readCart().filter((item) => item._id !== id);
  writeCart(items);
  return items;
};

export const clearCart = () => {
  writeCart([]);
};
