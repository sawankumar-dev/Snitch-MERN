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