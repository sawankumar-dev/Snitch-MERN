import productModel from "../models/product.model.js";
import { uploadImage } from "../services/storage.service.js"

export const uploadProduct = async (req, res) => {
    console.log(req.files)
    console.log(req.body)
    const fileUrls = [];
    for(let i = 0; i< req.files.length; i++) {
        const response = await uploadImage({
            buffer: req.files[i].buffer,
            fileName: req.files[i].originalname
        })
        fileUrls.push(response.url)
    }
    const product = await productModel.create({
        title: req.body.title,
        description: req.body.description,
        price: {
            amount: req.body.price.amount,
            currency: req.body.price.currency
        },
        sizes: req.body.sizes,
        images: fileUrls,
        seller: req.user._id
    })
    res.status(200).json({
        success: true,
        message: 'Product created successfully!',
        product
    })
}

export async function getAllProducts(req, res) {
    const products = await productModel.find()
    return res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        products
    })
}

export async function listAllProductsToSeller(req, res) {
    const products= await productModel.find({published: true, seller: req.user._id})
    return res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        data: {
            products,
        }
    })
}

export async function unlistProduct(req, res) {
    const {id} = req.params;
    const product = await productModel.findById(id);
    if(!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        })
    }
    await productModel.findByIdAndUpdate(id,{
        published: true
    })
    return res.status(200).json({
        success: false,
        message: "Product unpublished successfully"
    })
}

export async function listProduct(req, res) {
    const {id} = req.params;
    const product = await productModel.findById(id);
    if(!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        })
    }
    await productModel.findByIdAndUpdate(id,{
        published: true
    })
    return res.status(200).json({
        success: true,
        message: "Product published successfully"
    })
}