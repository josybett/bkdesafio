import { productModel } from "./models/productModel.js"
import { logError } from "../utils.js"

export class ProductManagerMongo {

    async addProduct(request) {
        console.log(request)

        let {title, description, code, price, stock, category, thumbnails} = request
        try {
            if (!title || !description || !price || !code || !stock || !category) {
                console.log('Todos los parámetros son requeridos')
                return {
                    'success': false,
                    'code': 400,
                    'message': 'Todos los parámetros son requeridos',
                    'data': []
                }
            }
            price = parseFloat(price)
            stock = parseFloat(stock)
            if (Number.isNaN(price) || Number.isNaN(stock)) {
                return {
                    'success': false,
                    'code': 400,
                    'message': 'Price y Stock deben se numéricos',
                    'data': []
                }
            }
    
            let valCode = {}
            try {
                valCode = await productModel.findOne({code: code.toLowerCase() })
            } catch (error) {
                return logError('addProduct error mongoose: ', 500, error)
            }
            if (valCode) {
                console.log(`Ya se encuentra registrado code: ${code.toLowerCase()}`)
                return {
                    'success': false,
                    'code': 400,
                    'message': `Ya se encuentra registrado code: ${code.toLowerCase()}`,
                    'data': []
                }
            }

            let newProduct = {}
            try {
                newProduct = await productModel.create({
                    title: title,
                    description: description,
                    code: code.toLowerCase(),
                    price: price,
                    status: true,
                    stock: stock,
                    category: category,
                    thumbnails: Array.isArray(thumbnails) ? thumbnails : []
                })
            } catch (error) {
                return logError('addCarts error mongoose: ', 500, error)
            }
            
            return {
                'success': true,
                'code': 200,
                'message': `Creado con éxito producto con code: ${code.toLowerCase()}`,
                'data': newProduct
            }
        } catch (error) {
            console.log('addProduct error: ',error.message)
            return logError('addProduct error: ', 500, error)
        }
    }

    async getProducts(limit=0) {
        let products = []
        try {
            products = await productModel.find({})
        } catch (error) {
            console.log('getProducts error mongose: ',error.message)
        }
        if (products.length && limit > 0) {
            products = products.slice(0, limit)
        }

        return products
    }

    async getProductById(id) {
        let product = []
        try {
            product = await productModel.findOne({_id: id, delete:false})
            if (!product) {
                console.log('Not found')
            }
        } catch (error) {
            console.log('getProductById error mongose: ',error.message)
        }
        return product
    }

    async updateProduct(id, updProduct) {
        try {
            let product = []
            let updProd = {}
            let resp = {
                'success': true,
                'code': 200,
                'message': `Producto editado con id: ${id}`,
            }
            try {
                product = await productModel.findOne({_id: id, delete:false})
            } catch (error) {
                console.log('updateProduct error mongoose: ',error.message)
                return logError('updateProduct error: ', 500, error)
            }
            if (!product) {
                console.log(`No existe producto con id: ${id}`)
                return {
                    'success': false,
                    'code': 400,
                    'message': `No existe producto con id: ${id}`,
                }
            }

            const keysString = ['title', 'description', 'thumbnails', 'category']
            const keysNumber = ['price', 'stock']
            const keysBool = ['status']
            let prod = Object.fromEntries(Object.entries(updProduct).
                            filter(([k, v]) => 
                                (((v != null && v != '') || v > 0 ) && keysString.includes(k)) ||
                                ((keysNumber.includes(k)) && !isNaN(parseInt(v))) ||
                                ((keysBool.includes(k)) && typeof v ==='boolean')
                            ))
            updProd = {
                ...product,
                ...prod,
                price: (prod.price) ? parseFloat(prod.price) : product.price,
                stock: (prod.stock) ? parseFloat(prod.stock) : product.stock,
                thumbnails: (prod.thumbnails && Array.isArray(prod.thumbnails)) ? prod.thumbnails : [],
            }
            delete updProd['_id']
            delete updProd['__v']
            console.log(updProd)
            let resultado
            try {
                resultado = await productModel.updateOne({_id:id, delete: false}, updProd)
                console.log(resultado)
                if(resultado.modifiedCount == 0) {
                    resp = {
                        'success': true,
                        'code': 400,
                        'message': `No se concretó la modificación con id: ${id}`,
                    }
                }
            } catch (error) {
                return logError('updateProduct error mongoose: ', 500, error)
            }

            return resp
        } catch (error) {
            return logError('updateProduct error: ', 500, error)
        }
    }

    async deleteProductById(id) {
        try {
            let product
            let resp = {
                'success': true,
                'code': 200,
                'message': `Ha sido eliminado el producto con id: ${id}`,
            }
            try {
                product = await productModel.findOne({_id: id, delete:false})
            } catch (error) {
                console.log('deleteProductById error mongoose: ',error.message)
                return logError('deleteProductById error: ', 500, error)
            }
            if (!product) {
                console.log(`No existe producto con id: ${id}`)
                return {
                    'success': false,
                    'code': 400,
                    'message': `No existe producto con id: ${id}`,
                }
            }
            let resultado = await productModel.updateOne({_id:id}, {delete: true})
            console.log(resultado)
            if(resultado.modifiedCount == 0) {
                resp = {
                    'success': true,
                    'code': 400,
                    'message': `No se concretó la eliminación del id: ${id}`,
                }
            }
            return resp
        } catch (error) {
            console.log('deleteProductById error: ',error.message)
            return logError('deleteProductById error: ', 500, error)
        }
    }
}