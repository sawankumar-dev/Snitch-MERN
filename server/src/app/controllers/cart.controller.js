import cartModel from "../models/cart.model";
import productModel from "../models/product.model.js";

export const addCart = async (req, res) => {
    try {
        const { productId, quantity, size } = req.body;
        const product  = await productModel.findById(productId);
        if(!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            })
        }
        const selectedSize = product.sizes.find(s => s.size === size);
        if(!selectedSize) {
            return res.status(400).json({
                success: false,
                message: "Invalid size"
            })
        }
        if(selectedSize.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: "Invalid stock"
            })
        }
        // let cart = await cartModel.findOne({user: req.user._id})
        // if(!cart) {
        //     cart = await cartModel.create({user: req.user._id})
        // }
        const cart = (await cartModel.findOne({user: req.user._id})) ?? await cartModel.create({user: req.user._id})
        const productInCart  = cart.products.find(p => (p.product.toString() === productId) && (p.size === size))
        if(productInCart) { 
            if(productInCart.quantity + quantity > selectedSize.stock) {
                return res.status(400).json({
                    success: false,
                    message: "Insufficient stock"
                })
            }
            await cartModel.updateOne({
                user: req.user._id,
                "products.product": productId,
                "products.size": size
            }, {
                $inc: {
                    "products.$.quantity": quantity 
                }
            })
        }
        await cartModel.findOneAndUpdate({user: req.user._id}, {
            $push: {
                products: {
                    product: productId,
                    quantity: quantity,
                    size: size
                }
            }
        })
        return res.status(200).json({
            success: true,
            message: "Product added to cart successfully!"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
}

export const getCart = async (req, res) => {
    const cart = (await cartModel.findById(req.user._id)) ?? (await cartModel.create({user: req.user._id}));
    return res.status(200).json({
        success: false,
        message: "Cart retrieved successfully",
        data: {
            cart: cart
        }
    })
}