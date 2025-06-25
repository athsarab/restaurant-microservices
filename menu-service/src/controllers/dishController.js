const Dish = require('../models/Dish');

// Get all dishes
exports.getAllDishes = async (req, res) => {
  try {
    const dishes = await Dish.find({ isAvailable: true })
      .populate('category', 'name');
    
    res.json(dishes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get dish by ID
exports.getDishById = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id)
      .populate('category', 'name');
    
    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    
    res.json(dish);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Dish not found' });
    }
    
    res.status(500).send('Server error');
  }
};

// Get dishes by category
exports.getDishesByCategory = async (req, res) => {
  try {
    const dishes = await Dish.find({ 
      category: req.params.categoryId,
      isAvailable: true 
    }).populate('category', 'name');
    
    res.json(dishes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Create a new dish
exports.createDish = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image,
      category,
      ingredients,
      isVegetarian,
      isVegan,
      isGlutenFree,
      spicyLevel,
      preparationTime
    } = req.body;
    
    // Check if dish already exists
    const existingDish = await Dish.findOne({ name });
    if (existingDish) {
      return res.status(400).json({ message: 'Dish already exists' });
    }
    
    const newDish = new Dish({
      name,
      description,
      price,
      image,
      category,
      ingredients,
      isVegetarian,
      isVegan,
      isGlutenFree,
      spicyLevel,
      preparationTime
    });
    
    const dish = await newDish.save();
    
    res.status(201).json(dish);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update a dish
exports.updateDish = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      image,
      category,
      ingredients,
      isVegetarian,
      isVegan,
      isGlutenFree,
      spicyLevel,
      isAvailable,
      preparationTime
    } = req.body;
    
    // Build dish object
    const dishFields = {};
    if (name) dishFields.name = name;
    if (description) dishFields.description = description;
    if (price) dishFields.price = price;
    if (image) dishFields.image = image;
    if (category) dishFields.category = category;
    if (ingredients) dishFields.ingredients = ingredients;
    if (isVegetarian !== undefined) dishFields.isVegetarian = isVegetarian;
    if (isVegan !== undefined) dishFields.isVegan = isVegan;
    if (isGlutenFree !== undefined) dishFields.isGlutenFree = isGlutenFree;
    if (spicyLevel !== undefined) dishFields.spicyLevel = spicyLevel;
    if (isAvailable !== undefined) dishFields.isAvailable = isAvailable;
    if (preparationTime) dishFields.preparationTime = preparationTime;
    
    let dish = await Dish.findById(req.params.id);
    
    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    
    // Update
    dish = await Dish.findByIdAndUpdate(
      req.params.id,
      { $set: dishFields },
      { new: true }
    ).populate('category', 'name');
    
    res.json(dish);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Dish not found' });
    }
    
    res.status(500).send('Server error');
  }
};

// Delete a dish
exports.deleteDish = async (req, res) => {
  try {
    const dish = await Dish.findById(req.params.id);
    
    if (!dish) {
      return res.status(404).json({ message: 'Dish not found' });
    }
    
    await Dish.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Dish deleted' });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Dish not found' });
    }
    
    res.status(500).send('Server error');
  }
};
