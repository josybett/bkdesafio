import {Router} from 'express';
import { ProductManager } from '../productManager.js';
import { io } from '../app.js';

export const router = Router()
const pm = new ProductManager();

router.get('/', async (req,res)=>{
    const limit = req.query.limit ?? 0
    let resultado = await pm.getProducts(limit)

    res.setHeader('Content-Type','application/json')
    res.status(200).json({limit, resultado})
})

router.get('/:pid', async (req,res)=>{
    let id = req.params.pid

    id=parseInt(id)  
    if(isNaN(id)){
        return res.status(400).send('Error, ingrese un argumento id numerico')
    }
    let resultado = await pm.getProductById(id)
    if (Array.isArray(resultado) && !resultado.length) {
        res.setHeader('Content-Type','application/json')
        return res.status(404).json({'resultado': `No existe producto con id: ${id}`})
    }

    res.setHeader('Content-Type','application/json')
    res.status(200).json({resultado})
})

router.post('/', async (req,res)=>{
    let {success, code, message, data} = await pm.addProduct(req.body)
    if (success) {
        console.log("socket enviando: newProduct, mensaje: ", data)
        io.emit("newProduct", data)
    }
    res.setHeader('Content-Type','application/json')
    res.status(code).json({'success': success, 'resultado': message})
})

router.put('/:pid', async (req,res)=>{
    let id = req.params.pid

    id=parseInt(id)  
    if(isNaN(id)){
        return res.status(400).send('Error, ingrese un argumento id numerico')
    }
    let {success, code, message} = await pm.updateProduct(id, req.body)
    res.setHeader('Content-Type','application/json')
    res.status(code).json({'success': success, 'resultado': message})
})

router.delete('/:pid', async (req,res)=>{
    let id = req.params.pid

    id=parseInt(id)  
    if(isNaN(id)){
        return res.status(400).send('Error, ingrese un argumento id numerico')
    }
    let {success, code, message} = await pm.deleteProductById(id)
    if (success) {
        console.log("socket enviando: deleteProduct, mensaje: ", id)
        io.emit("deleteProduct", id)
    }
    res.setHeader('Content-Type','application/json')
    res.status(code).json({'success': success, 'resultado': message})
})