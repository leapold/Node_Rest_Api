const express = require("express");
const router = express.Router();
//npm install --save multer
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

router.get("/", ProductsController.products_get_all);// ./api/routes/products/get

router.post("/", checkAuth, upload.single('productImage'), ProductsController.products_create_product);// ./api/routes/products/post

router.get("/:productId", ProductsController.products_get_product);// ./api/routes/products/get/2

router.patch("/:productId", checkAuth, ProductsController.products_update_product);// ./api/routes/products/3

router.delete("/:productId", checkAuth, ProductsController.products_delete);

module.exports = router;
/*
router.post("/async", async (req, res, next) => {
  try {
    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name: req.body.name,
      price: req.body.price,
    });

    const result = await product.save();
    console.log(result);
    res.status(201).json({
      message: "Handling POST requests to /products",
      createdProduct: result,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err });
  }
});
*/