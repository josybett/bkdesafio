import { cartsModel } from "./models/cartsModel.js"
import { logError } from "../utils.js"
import mongoose from "mongoose"
import { ProductManagerMongo } from "./productManagerMongo.js"

export class CartsManagerMongo {
    
    async addCarts(request) {
        try {
            let { products } = request
            let newCart = {}

            try {
                newCart = await cartsModel.create({products: products ?? []})
            } catch (error) {
                return logError('addCarts error mongose: ', 500, error)
            }

            return {
                'success': true,
                'code': 200,
                'message': `Creado con éxito carrito id: ${newCart}`,
            }
        } catch (error) {
            return logError('addCarts error: ', 500, error)
        }
    }

    async getCartById(id) {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return {
                    'success': false,
                    'code': 400,
                    'message': `Ingesar un id válido`,
                }
            }
            let cart = {}
            try {
                cart = await cartsModel.findOne({_id: id}).populate({path: 'products.product'})
            } catch (error) {
                return logError('getCartById error mongose: ', 500, error)
            }

            if (!cart) {
                console.log('Not found')
                return {
                    'success': false,
                    'code': 404,
                    'message': `No existe carrito con id: ${id}`,
                }
            }
            return {
                'success': true,
                'code': 200,
                'message': `Ok`,
                'data': cart
            }
        } catch (error) {
            return logError('getCartById error: ', 500, error)
        }
    }

    async updateCarts(id, pid, qt) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return {
                'success': false,
                'code': 400,
                'message': `Ingesar un id válido`,
            }
        }
        let cart = {}
        let message = `Producto editado con id: ${pid}`
        let resultado = {}
        let resp = {
            'success': true,
            'code': 200,
            'message': message,
            'data': resultado
        }
        try {
            cart = await cartsModel.findOne({_id: id})
        } catch (error) {
            return logError('getCartById error mongose: ', 500, error)
        }
        if (cart == {}) {
            return {
                'success': false,
                'code': 404,
                'message': `No existe carrito con id: ${id}`
            }
        }

        let productsCarts = cart.products
        let prod = {
            product: pid,
            quantity: qt
        }
        let index = productsCarts.findIndex(pc=>pc?.product==pid)
        if (index !== -1) {
            productsCarts[index] = {
                ...productsCarts[index],
                quantity: ( Number(productsCarts[index].quantity) + Number(qt))
            }
        } else {
            const pm = new ProductManagerMongo()
            let prodById = await pm.getProductById(pid)
            if (!Array.isArray(prodById)) {
                productsCarts.push(prod)
            } else {
                message = `No existe producto con id: ${pid}`
            }
        }
        cart.products = productsCarts
        console.log(cart)   
        try {
            resultado=await cartsModel.updateOne({_id:id }, cart)
            console.log(resultado)
            if(resultado.modifiedCount == 0) {
                resp = {
                    'success': true,
                    'code': 400,
                    'message': `No se concretó la modificación con id: ${id}`,
                }
            } else {
                `Carrito editado con id: ${id}`
            }
        } catch (error) {
            return logError('updateCarts error mongoose: ', 500, error)
        }
        console.log(`Carrito editado con id: ${id}`)
        return resp
    }
}