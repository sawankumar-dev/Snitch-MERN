export const uploadProduct = async (req, res) => {
    console.log(req.files)
    res.status(200).json({
        success: true,
        message: 'Product created successfully!'
    })
}