const fs = require('fs')
const path = require('path')

class ProductManager {
    constructor() {
        this.products = []
        this.path = path.join(__dirname, 'productos.json')
    }

    async addProduct(title, description, price, thumbnail, code, stock) {
        try {
            if (!title || !description || !price || !thumbnail || !code || !stock) {
                console.log('Todos los parámetros son requeridos')
                return
            }
    
            let products = await this.getProducts();
            const id = products.length ? (products[products.length-1].id+1) : 1
            let valCode = products.find(prod=>prod.code===code)
            if (valCode) {
                console.log(`Ya se encuentra registrado code: ${code}`)
                return
            }
    
            let newProduct = {
                id,
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            }
    
            products.push(newProduct)
            await this.saveFile(products)
        } catch (error) {
            console.log('addProduct error: ',error.message)
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
                return
            }

            const keys = ['title', 'description', 'price', 'thumbnail', 'stock']
            let prod = Object.fromEntries(Object.entries(updProduct).
                            filter(([k, v]) => 
                                (((v != null && v != '') || v > 0 ) && keys.includes(k))
                            ))
            products[indexProduct] = {
                ...products[indexProduct],
                ...prod,
                id
            }
            await this.saveFile(products)
            console.log(`Producto editado con id: ${id}`)
        } catch (error) {
            console.log('updateProduct error: ',error.message)
        }
    }

    async deleteProductById(id) {
        try {
            let products = await this.getProducts();
            let indexProduct = products.findIndex(prod=>prod.id===id)
            if (indexProduct === -1) {
                console.log(`No existe producto con id: ${id}`)
                return
            }
            products.splice(indexProduct, 1)
            this.saveFile(products)
            console.log(`Ha sido eliminado el producto con id: ${id}`)
        } catch (error) {
            console.log('deleteProductById error: ',error.message)
        }
    }
}

module.exports = ProductManager
/*

const desafio = (async() => {
    let pm = new ProductManager('./products.json')
    console.log(await pm.getProducts())
    await pm.addProduct('computador','Este es un producto prueba',2000,'Sin imagen','qwe123',25)
    console.log(await pm.getProducts())
    await pm.addProduct('producto prueba','Este es un producto prueba',200,'Sin imagen','abc123',25)
    await pm.addProduct('producto prueba 2','Este es un producto prueba',300,'Sin imagen','def456',35)
    await pm.updateProduct(3, {title: 'laptop', description: 'portatil', price: 4000, code: '', stock: 0})
    await pm.deleteProductById(1)
})

desafio()
*/
