const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const { User, Product, Cart, Order } = require("./models/Schema");
const app = express();

mongoose.connect("mongodb+srv://user:user@cluster0.hzfuazk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0").then(() => console.log("db is running"));

app.use(cors());
app.use(express.json());

//user registration
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    const alredyemail = await User.findOne({ email: email });
    if (alredyemail) {
        return res.status(400).json("User is already there");
    }
    const user = User({
        name,
        email,
        password
    })
    await user.save();
    return res.status(200).json("Register sucessfully");
})

//user login
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const alredyemail = await User.findOne({ email: email });
    if (!alredyemail) {
        return res.status(404).json("User no found");
    }
    if (alredyemail.password === password) {
        return res.status(200).json(alredyemail.id);
    }
    return res.status(405).json("password is incorrect");
})

//add to cart
app.post('/addtocart', async (req, res) => {
    try {
        const { userid, productid } = req.body;
        const cart = Cart({
            userid,
            productid
        });
        await cart.save();
        return res.status(200).json("added in to the cart");
    } catch (error) {
        return res.status(500).json("server error");
    }
})

//remove from cart
app.delete('/removefromcart/:id/:userid', async (req, res) => {
    try {
        await Cart.deleteOne({ userid: req.params.userid, productid: req.params.id });
        return res.status(200).json("removed sucessful")
    } catch (error) {
        return res.status(500).json("server error");
    }
})

//get the cart
app.get('/getthecart/:userid', async (req, res) => {
    try {
        const cart = await Cart.find({ userid: req.params.userid });
        return res.status(200).json(cart);
    } catch (error) {
        return res.status(500).json("server error");
    }
});

//get the cart
app.get('/getthecartwith/:userid', async (req, res) => {
    try {
        const cart = await Cart.find({ userid: req.params.userid }).populate("productid");
        return res.status(200).json(cart);
    } catch (error) {
        return res.status(500).json("server error");
    }
})

//place an order
app.post('/placeanorder', async (req, res) => {
    try {
        const { userid, products, total } = req.body;
        const order = Order({
            userid,
            products,
            total
        });
        await order.save()
        return res.status(200).json("order is successful")
    } catch (error) {
        return res.status(500).json("server error");
    }
})

//get the order details
app.get('/getorders', async(req, res) => {
    return res.status(200).json(await Order.find().populate('userid'))
})



//admin login
app.post('/adminlogin', async (req, res) => {
    const { email, password } = req.body;
    if (email === "admin@gmail.com" && password === "Admin123") {
        return res.status(200).json("admin login successful");
    }
    return res.status(405).json("credentials are incorrect");
});

//add a product
app.post('/addproduct', async (req, res) => {
    try {
        const { name, image, price, category } = req.body;
        const product = Product({
            name,
            image,
            price,
            category
        });
        await product.save()
        return res.status(200).json("add succesfylly");
    } catch (error) {
        return res.status(500).json("server error");
    }
});

//get the products
app.get('/getproducts', async (req, res) => {
    try {
        return res.status(200).json(await Product.find());
    } catch (error) {
        return res.status(500).json("server error");

    }
});

//delete the product
app.delete('/deleteproduct/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndDelete(id);
        return res.status(200).json("Deleted successfully")
    } catch (error) {
        return res.status(500).json("server error");
    }
})

app.listen(5000, () => console.log("server is running"));