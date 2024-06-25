const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const { connect, Schema, model } = require("mongoose");
const port = 5000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(port, () => {
  try {
    console.log(`Server is running ${port}`);
    connect(
      "mongodb+srv://mongoDB:mongoDB@cluster0.wmkzqgw.mongodb.net/dbDemoTwo"
    );
    console.log("db connection established");
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
});

const DistrictSchemaStructure = new Schema({
  DistrictName: {
    type: String,
    required: true,
  },
});

const District = model("District", DistrictSchemaStructure);

app.post("/District", async (req, res) => {
  try {
    const { DistrictName } = req.body;

    let existingDistrict = await District.findOne({ DistrictName });

    if (existingDistrict) {
      return res
        .status(400)
        .json({ errors: [{ msg: "District already exists" }] });
    }

    let newDistrict = new District({
      DistrictName,
    });

    await newDistrict.save();

    res.json({ message: "District inserted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/District", async (req, res) => {
  try {
    let district = await District.find();
    res.json({ district });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/DistrictId/:id", async (req, res) => {
  try {
    let district = await District.findById(req.params.id);

    res.json({ district });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/Districtsubdistrict/:id", async (req, res) => {
  try {
    let district = await District.find({ _id: req.params.id });
    if (district.length === 0) {
      return res.status(404).json({ msg: "District not found" });
    }
    res.json({ district });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.delete("/Districtdelete/:id", async (req, res) => {
  try {
    let district = await District.findByIdAndDelete(req.params.id);
    res.json({ district });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.put("/District/:id", async (req, res) => {
  try {
    const { DistrictName } = req.body;

    let district = await District.findByIdAndUpdate(
      req.params.id,
      {
        DistrictName,
      },
      { new: true }
    );

    if (!district) {
      return res.status(404).json({ errors: [{ msg: "district not found" }] });
    }

    res.json({ message: "district updated successfully", district });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.patch("/District/:id", async (req, res) => {
  try {
    const { DistrictName } = req.body;

    let district = await District.findByIdAndUpdate(
      req.params.id,
      {
        DistrictName,
      },
      { new: true }
    );

    if (!district) {
      return res.status(404).json({ errors: [{ msg: "district not found" }] });
    }

    res.json({ message: "district updated successfully", district });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

const PlaceSchemaStructure = new Schema({
  PlaceName: {
    type: String,
    required: true,
  },

  DistrictId: {
    type: Schema.Types.ObjectId,
    ref: "District",
    required: true,
  },
});

const Place = model("Place", PlaceSchemaStructure);

app.post("/Place", async (req, res) => {
  try {
    const { PlaceName, DistrictId } = req.body;

    let existingPlace = await Place.findOne({ PlaceName });

    if (existingPlace) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Place already exists" }] });
    }

    let newPlace = new Place({
      PlaceName,
      DistrictId,
    });

    await newPlace.save();

    res.json({ message: "Place inserted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/Place", async (req, res) => {
  try {
    let place = await Place.find().populate("DistrictId");
    res.json({ place });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/PlaceId/:id", async (req, res) => {
  try {
    let place = await Place.findById(req.params.id);

    res.json({ place });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/PlacesubPlace/:id", async (req, res) => {
  try {
    let place = await Place.find({ _id: req.params.id });
    if (place.length === 0) {
      return res.status(404).json({ msg: "Place not found" });
    }
    res.json({ place });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/Placesubplace/:id", async (req, res) => {
  try {
    let place = await Place.find(req.params.id);
    res.json({ place });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.delete("/Placedelete/:id", async (req, res) => {
  try {
    let place = await Place.findByIdAndDelete(req.params.id);
    res.json({ place });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.put("/Place/:id", async (req, res) => {
  try {
    const { PlaceName, DistrictId } = req.body;

    let place = await Place.findByIdAndUpdate(
      req.params.id,
      {
        PlaceName,
        DistrictId,
      },
      { new: true }
    );

    if (!place) {
      return res.status(404).json({ errors: [{ msg: "place not found" }] });
    }

    res.json({ message: "place updated successfully", place });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.patch("/Place/:id", async (req, res) => {
  try {
    const { PlaceName, DistrictId } = req.body;

    let place = await Place.findByIdAndUpdate(
      req.params.id,
      {
        PlaceName,
        DistrictId,
      },
      { new: true }
    );

    if (!place) {
      return res.status(404).json({ errors: [{ msg: "place not found" }] });
    }

    res.json({ message: "place updated successfully", place });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

const BrandSchemaStructure = new Schema({
  BrandName: {
    type: String,
    required: true,
  },
});

const Brand = model("Brand", BrandSchemaStructure);

app.post("/Brand", async (req, res) => {
  try {
    const { BrandName } = req.body;

    let existingBrand = await Brand.findOne({ BrandName });

    if (existingBrand) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Brand already exists" }] });
    }

    let newBrand = new Brand({
      BrandName,
    });

    await newBrand.save();

    res.json({ message: "Brand inserted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/Brand", async (req, res) => {
  try {
    let brand = await Brand.find();
    res.json({ brand });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/BrandId/:id", async (req, res) => {
  try {
    let brand = await Brand.findById(req.params.id);

    res.json({ brand });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/BrandsubBrand/:id", async (req, res) => {
  try {
    let brand = await Brand.find({ _id: req.params.id });
    if (brand.length === 0) {
      return res.status(404).json({ msg: "Brand not found" });
    }
    res.json({ brand });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.delete("/Branddelete/:id", async (req, res) => {
  try {
    let brand = await Brand.findByIdAndDelete(req.params.id);
    res.json({ brand });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.put("/Brand/:id", async (req, res) => {
  try {
    const { BrandName } = req.body;

    let brand = await Brand.findByIdAndUpdate(
      req.params.id,
      {
        BrandName,
      },
      { new: true }
    );

    if (!brand) {
      return res.status(404).json({ errors: [{ msg: "brand not found" }] });
    }

    res.json({ message: "brand updated successfully", brand });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.patch("/Brand/:id", async (req, res) => {
  try {
    const { BrandName } = req.body;

    let brand = await Brand.findByIdAndUpdate(
      req.params.id,
      {
        BrandName,
      },
      { new: true }
    );

    if (!brand) {
      return res.status(404).json({ errors: [{ msg: "brand not found" }] });
    }

    res.json({ message: "brand updated successfully", brand });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

const UserSchemaStructure = new Schema({
  UserName: {
    type: String,
    required: true,
  },

  Useremail: {
    type: String,
    required: true,
  },
  Usercontact: {
    type: String,
    required: true,
  },
  Userpassword: {
    type: String,
    required: true,
  },
  Useraddress: {
    type: String,
    required: true,
  },
  PlaceId: {
    type: Schema.Types.ObjectId,
    ref: "Place",
    required: true,
  },
  Userphoto: {
    type: String,
    required: true,
  },
});

const User = model("User", UserSchemaStructure);

app.post("/User", async (req, res) => {
  try {
    const {
      UserName,

      Useremail,
      Usercontact,
      Userpassword,
      Useraddress,
      PlaceId,
      Userphoto,
    } = req.body;

    let existingUser = await User.findOne({ UserName });

    if (existingUser) {
      return res.status(400).json({ errors: [{ msg: "User already exists" }] });
    }

    let newUser = new User({
      UserName,

      Useremail,
      Usercontact,
      Userpassword,
      Useraddress,
      PlaceId,
      Userphoto,
    });

    await newUser.save();

    res.json({ message: "User inserted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/User", async (req, res) => {
  try {
    let user = await User.find().populate("PlaceId");
    res.json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/UserId/:id", async (req, res) => {
  try {
    let user = await User.findById(req.params.id);

    res.json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/UsersubUser/:id", async (req, res) => {
  try {
    let user = await User.find({ _id: req.params.id });
    if (user.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.delete("/Userdelete/:id", async (req, res) => {
  try {
    let user = await User.findByIdAndDelete(req.params.id);
    res.json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.put("/User/:id", async (req, res) => {
  try {
    const {
      UserName,
      Useremail,
      Usercontact,
      Userpassword,
      Useraddress,
      PlaceId,
      Userphoto,
    } = req.body;

    let user = await User.findByIdAndUpdate(
      req.params.id,
      {
        UserName,
        Useremail,
        Usercontact,
        Userpassword,
        Useraddress,
        PlaceId,
        Userphoto,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ errors: [{ msg: "User not found" }] });
    }

    res.json({ message: "User updated successfully", user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.patch("/User/:id", async (req, res) => {
  try {
    const {
      UserName,
      Useremail,
      Usercontact,
      Userpassword,
      Useraddress,
      PlaceId,
      Userphoto,
    } = req.body;

    let user = await User.findByIdAndUpdate(
      req.params.id,
      {
        UserName,
        Useremail,
        Usercontact,
        Userpassword,
        Useraddress,
        PlaceId,
        Userphoto,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ errors: [{ msg: "User not found" }] });
    }

    res.json({ message: "User updated successfully", user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

const SellerSchemaStructure = new Schema({
  SellerName: {
    type: String,
    required: true,
  },

  Selleremail: {
    type: String,
    required: true,
  },
  Sellercontact: {
    type: String,
    required: true,
  },
  Sellerpassword: {
    type: String,
    required: true,
  },
  Selleraddress: {
    type: String,
    required: true,
  },
  PlaceId: {
    type: Schema.Types.ObjectId,
    ref: "Place",
    required: true,
  },
  Sellerphoto: {
    type: String,
    required: true,
  },
});

const Seller = model("Seller", SellerSchemaStructure);

app.post("/Seller", async (req, res) => {
  try {
    const {
      SellerName,
      Selleremail,
      Sellercontact,
      Sellerpassword,
      Selleraddress,
      PlaceId,
      Sellerphoto,
    } = req.body;

    let existingSeller = await Seller.findOne({ SellerName });

    if (existingSeller) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Seller already exists" }] });
    }

    let newSeller = new Seller({
      SellerName,

      Selleremail,
      Sellercontact,
      Sellerpassword,
      Selleraddress,
      PlaceId,
      Sellerphoto,
    });

    await newSeller.save();

    res.json({ message: "Seller inserted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/Seller", async (req, res) => {
  try {
    let seller = await Seller.find();
    res.json({ seller });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/SellerId/:id", async (req, res) => {
  try {
    let seller = await Seller.findById(req.params.id);

    res.json({ seller });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/SellersubSeller/:id", async (req, res) => {
  try {
    let seller = await Seller.find({ _id: req.params.id });
    if (seller.length === 0) {
      return res.status(404).json({ msg: "Seller not found" });
    }
    res.json({ seller });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.delete("/Sellerdelete/:id", async (req, res) => {
  try {
    let seller = await Seller.findByIdAndDelete(req.params.id);
    res.json({ seller });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.put("/Seller/:id", async (req, res) => {
  try {
    const {
      SellerName,

      Selleremail,
      Sellercontact,
      Sellerpassword,
      Selleraddress,
      PlaceId,
      Sellerphoto,
    } = req.body;

    let seller = await Seller.findByIdAndUpdate(
      req.params.id,
      {
        SellerName,

        Selleremail,
        Sellercontact,
        Sellerpassword,
        Selleraddress,
        PlaceId,
        Sellerphoto,
      },
      { new: true }
    );

    if (!seller) {
      return res.status(404).json({ errors: [{ msg: "Seller not found" }] });
    }

    res.json({ message: "Seller updated successfully", seller });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.patch("/Seller/:id", async (req, res) => {
  try {
    const {
      SellerName,

      Selleremail,
      Sellercontact,
      Sellerpassword,
      Selleraddress,
      PlaceId,
      Sellerphoto,
    } = req.body;

    let seller = await Seller.findByIdAndUpdate(
      req.params.id,
      {
        SellerName,

        Selleremail,
        Sellercontact,
        Sellerpassword,
        Selleraddress,
        PlaceId,
        Sellerphoto,
      },
      { new: true }
    );

    if (!seller) {
      return res.status(404).json({ errors: [{ msg: "Seller not found" }] });
    }

    res.json({ message: "Seller updated successfully", seller });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

const ProductsSchemaStructure = new Schema({
  ProductsName: {
    type: String,
    required: true,
  },
  ProductsPhoto: {
    type: String,
    required: true,
    unique: true,
  },
  ProductsDetails: {
    type: String,
    required: true,
  },
  ProductsPrice: {
    type: String,
    required: true,
  },
  brandid: {
    type: Schema.Types.ObjectId,
    ref: "Brand",
    required: true,
  },
  sellerid: {
    type: Schema.Types.ObjectId,
    ref: "Seller",
    required: true,
  },
});

const Product = model("Product", ProductsSchemaStructure);

app.post("/Product", async (req, res) => {
  try {
    const {
      ProductsName,
      ProductsPhoto,
      ProductsDetails,
      ProductsPrice,
      brandid,

      sellerid,
    } = req.body;

    let existingProduct = await Product.findOne({ ProductsName });

    if (existingProduct) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Product already exists" }] });
    }

    let newProduct = new Product({
      ProductsName,
      ProductsPhoto,
      ProductsDetails,
      ProductsPrice,
      brandid,

      sellerid,
    });

    await newProduct.save();

    res.json({ message: "Product inserted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/Product", async (req, res) => {
  try {
    let product = await Product.find().populate("brandid").populate("sellerid");
    res.json({ product });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/ProductId/:id", async (req, res) => {
  try {
    let product = await Seller.findById(req.params.id);

    res.json({ product });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/SellersubSeller/:id", async (req, res) => {
  try {
    let product = await Product.find({ _id: req.params.id });
    if (product.length === 0) {
      return res.status(404).json({ msg: "product not found" });
    }
    res.json({ product });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.delete("/Productdelete/:id", async (req, res) => {
  try {
    let product = await Seller.findByIdAndDelete(req.params.id);
    res.json({ product });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.put("/Product/:id", async (req, res) => {
  try {
    const {
      ProductsName,
      ProductsPhoto,
      ProductsDetails,
      ProductsPrice,
      brandid,

      sellerid,
    } = req.body;

    let product = await Seller.findByIdAndUpdate(
      req.params.id,
      {
        ProductsName,
        ProductsPhoto,
        ProductsDetails,
        ProductsPrice,
        brandid,

        sellerid,
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ errors: [{ msg: "product not found" }] });
    }

    res.json({ message: "product updated successfully", product });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.patch("/Product/:id", async (req, res) => {
  try {
    const {
      ProductsName,
      ProductsPhoto,
      ProductsDetails,
      ProductsPrice,
      brandid,

      sellerid,
    } = req.body;

    let product = await Product.findByIdAndUpdate(
      req.params.id,
      {
        ProductsName,
        ProductsPhoto,
        ProductsDetails,
        ProductsPrice,
        brandid,

        sellerid,
      },
      { new: true }
    );

    if (!product) {
      return res.status(404).json({ errors: [{ msg: "product not found" }] });
    }

    res.json({ message: "product updated successfully", product });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});
