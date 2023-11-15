import path from 'path'
import fs from 'fs'
import __dirname from './utils.js';

export class ProductManager {
    constructor() {
        this.products = []
        this.path = path.join(__dirname, 'productos.json')
    }

    async addProduct(request) {
        console.log(request)

        let {title, description, code, price, stock, category, thumbnails, io} = request
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
    
            let products = await this.getProducts();
            const id = products.length ? (products[products.length-1].id+1) : 1
            let valCode = products.find(prod=>prod.code===code)
            if (valCode) {
                console.log(`Ya se encuentra registrado code: ${code}`)
                return {
                    'success': false,
                    'code': 400,
                    'message': `Ya se encuentra registrado code: ${code}`,
                    'data': []
                }
            }
    
            let newProduct = {
                id,
                title,
                description,
                code,
                price,
                status: true,
                stock,
                category,
                thumbnails: Array.isArray(thumbnails) ? thumbnails : [],
            }
            products.push(newProduct)
            await this.saveFile(products)
            return {
                'success': true,
                'code': 200,
                'message': `Creado con éxito producto con code: ${code}`,
                'data': newProduct
            }
        } catch (error) {
            console.log('addProduct error: ',error.message)
            return {
                'success': false,
                'code': 500,
                'message': `Error: ${error.message}`,
                'data': []
            }
        }
    }

    async saveFile(products) {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(products, null, 5))
        } catch (error) {
            console.log('saveFile error: ',error.message)
        }
    }

    async getProducts(limit=0) {
        try {
            if (fs.existsSync(this.path)) {
                let products = JSON.parse(await fs.promises.readFile(this.path, "utf-8"))
                if (limit > 0) {
                    products=products.slice(0, limit)
                    
                }
                return products
            }
            return []
        } catch (error) {
            console.log('getProducts error: ',error.message)
        }
    }

    async getProductById(id) {
        try {
            let products = await this.getProducts();
            let product = products.find(prod=>prod.id===id)
            if (!product) {
                console.log('Not found')
                return []
            }
            return product
        } catch (error) {
            console.log('getProductById error: ',error.message)
            return []
        }
    }

    async updateProduct(id, updProduct) {
        try {
            let products = await this.getProducts();
            let indexProduct = products.findIndex(prod=>prod.id===id)
            if (indexProduct === -1) {
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
            products[indexProduct] = {
                ...products[indexProduct],
                ...prod,
                price: (prod.price) ? parseFloat(prod.price) : products[indexProduct].price,
                stock: (prod.stock) ? parseFloat(prod.stock) : products[indexProduct].stock,
                thumbnails: (prod.thumbnails && Array.isArray(prod.thumbnails)) ? prod.thumbnails : [],
                id
            }
            await this.saveFile(products)
            console.log(`Producto editado con id: ${id}`)
            return {
                'success': true,
                'code': 200,
                'message': `Producto editado con id: ${id}`,
            }
        } catch (error) {
            console.log('updateProduct error: ',error.message)
            return {
                'success': false,
                'code': 500,
                'message': `Error: ${error.message}`,
            }
        }
    }

    async deleteProductById(id) {
        try {
            let products = await this.getProducts();
            let indexProduct = products.findIndex(prod=>prod.id===id)
            if (indexProduct === -1) {
                console.log(`No existe producto con id: ${id}`)
                return {
                    'success': false,
                    'code': 404,
                    'message': `No existe producto con id: ${id}`,
                }
            }
            products.splice(indexProduct, 1)
            this.saveFile(products)
            console.log(`Ha sido eliminado el producto con id: ${id}`)
            return {
                'success': true,
                'code': 200,
                'message': `Ha sido eliminado el producto con id: ${id}`,
            }
        } catch (error) {
            console.log('deleteProductById error: ',error.message)
            return {
                'success': false,
                'code': 500,
                'message': `Error: ${error.message}`,
            }
        }
    }
}