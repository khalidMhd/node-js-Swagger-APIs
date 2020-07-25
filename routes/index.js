var express = require('express');
var router = express.Router();
var multer = require('multer')
var swaggerUi = require('swagger-ui-express')

var swaggerDocument = require('../swagger.json')

var CategoryModel = require('../Models/category')
var Category = CategoryModel.find({}, { __v: 0 })

var productModel = require('../Models/products')
var products = productModel.find({}, { __v: 0 })

var userModel = require('../Models/user')
var user = userModel.find({})

var orderModel = require('../Models/order');
const { findByIdAndUpdate } = require('../Models/products');
var order = orderModel.find({}, { __v: 0 })

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads/')
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname)
  }
})

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

var upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
})

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Sabzi-Ghar' });
});

//=================== Category =========================
router.get('/categories', function (req, res, next) {
  Category.exec(function (err, data) {
    if (err) throw err
    if (data != '') {
      res.send(data)
    } else {
      res.send('Category Not Found!')
    }
  })
});

router.get('/categories/:id', function (req, res, next) {
  CategoryModel.find({ _id: req.params.id }).exec(function (err, data) {
    if (err) throw err
    if (data != '') {
      res.send(data)
    } else {
      res.send('Category Not Found!')
    }
  })
});

router.post('/categories', upload.single('image'), function (req, res, next) {
  var categoryDetails = new CategoryModel({
    name: req.body.name,
    image: req.file.path
  })
  categoryDetails.save(function (err, data) {
    if (err) throw err
    res.send('Category Added:')
  })
});

router.get('/categories/:id', function (req, res, next) {
  CategoryModel.findByIdAndRemove({ _id: req.params.id }).exec(function (err) {
    if (err) throw err
    res.send('Deleted Successfully')
  })
})

//================== Products =======================
router.get('/products', function (req, res, next) {
  products.exec(function (err, data) {
    if (err) throw err
    if (data != '') {
      res.send(data)
    } else {
      res.send("Products Not Found!")
    }
  })
});

router.post('/products', upload.single('image'), function (req, res, next) {
  var productDetails = new productModel({
    name: req.body.name,
    price: req.body.price,
    category: req.body.category,
    image: req.file.path
  })
  productDetails.save(function (err, data) {
    if (err) throw err
    res.send('Product Added:')
  })
});

router.put('/products/:id', upload.single('image'), function (req, res, next) {
  console.log("iDDDD"+ req.params.id)
  var productId = req.params.id
  var name = req.body.name
  var price = req.body.price
  var category = req.body.category
  var image= req.file.path
   productModel.findById(productId,function(err,data){
     if(err) throw err
     data.name = name?name:data.name
     data.price = price?price:data.price
     data.category = category?category:data.category
     data.image = image?image:data.image

      data.save(function(err){
      if(err) throw err
      res.send("Product Updated!")
     })
   })
});

router.get('/products/:name', function (req, res, next) {
  productModel.find({ category: req.params.name }).exec(function (err, data) {
    if (err) throw err;
    if (data != '') {
      res.send(data)
    } else {
      res.send("Products Not Found!")
    }
  })
});

router.get('/products/:id', function (req, res, next) {
  productModel.findByIdAndRemove({ _id: req.params.id }).exec(function (err) {
    if (err) throw err
    res.send('Deleted Successfully')
  })
})

//=================== User ======================
router.post('/user', function (req, res,) {
  var userDetails = new userModel({
    mobile: req.body.mobile,
    address: req.body.address
  })
  userDetails.save(function (err) {
    if (err) throw err
    res.send('User Created')
  })
})

router.get('/user', function (req, res) {
  user.exec(function (err, data) {
    if (err) throw err
    res.send(data)
  })
})

//=============== order ================
router.post('/order', function (req, res) {

  var orderDetails = new orderModel({
    user: req.body.user,
    address: req.body.address
  })

  var productIDs = req.body.product
  var productsList = productIDs.split(',');
  var quantities = req.body.quantity.split(',')

  orderDetails.product = productsList
  orderDetails.quantity = quantities


  orderDetails.save(function (err) {
    if (err) throw err
    res.send('Odred Placed')
  })
})

router.get('/order', function (req, res) {
  order.populate('product', "name price category image").exec(function (err, data) {
    if (err) throw err
    var orders = []
    for (var i=0; i<data.length; i++){
      var order = data[i]
      var products = []
      for(var p=0; p<order.product.length; p++){
        var product = order.product[p]
        product.quantity = order.quantity[p]
        products.push(product)
      }
      order.product = products

      var newOrder = new orderModel({
        _id: order._id,
        product: products,
        address: order.address,
      })
      newOrder.quantity = undefined

      orders.push(newOrder)
    }

    res.send(orders)
  })
})

router.get('/order/:userid', function (req, res) {
  orderModel.find({ user: req.params.userid }).populate('product',"name price category image").exec(function (err, data) {
    if (err) throw err
    var orders = []
    for (var i=0; i<data.length; i++){
      var order = data[i]
      var products = []
      for(var p=0; p<order.product.length; p++){
        var product = order.product[p]
        product.quantity = order.quantity[p]
        products.push(product)
      }
      order.product = products

      var newOrder = new orderModel({
        _id: order._id,
        product: products,
        address: order.address,
      })
      newOrder.quantity = undefined

      orders.push(newOrder)
    }

    res.send(orders)
  })
})

router.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

module.exports = router;