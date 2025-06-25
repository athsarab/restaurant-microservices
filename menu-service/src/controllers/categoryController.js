const Category = require('../models/Category');

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Get category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.json(category);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.status(500).send('Server error');
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;
    
    // Check if category already exists
    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: 'Category already exists' });
    }
    
    const newCategory = new Category({
      name,
      description,
      image
    });
    
    const category = await newCategory.save();
    
    res.status(201).json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Update a category
exports.updateCategory = async (req, res) => {
  try {
    const { name, description, image, isActive } = req.body;
    
    // Build category object
    const categoryFields = {};
    if (name) categoryFields.name = name;
    if (description) categoryFields.description = description;
    if (image) categoryFields.image = image;
    if (isActive !== undefined) categoryFields.isActive = isActive;
    
    let category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    // Update
    category = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: categoryFields },
      { new: true }
    );
    
    res.json(category);
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.status(500).send('Server error');
  }
};

// Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    await Category.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Category deleted' });
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Category not found' });
    }
    
    res.status(500).send('Server error');
  }
};
