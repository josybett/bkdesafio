import {Router} from 'express';
import { CartsManager } from '../cartsManager.js';

export const router = Router()
const cm = new CartsManager();

router.post('/', async (req,res)=>{
    let {success, code, message} = await cm.addCarts(req.body)

    res.setHeader('Content-Type','application/json')
    res.status(code).json({'success':success, 'resultado': message})
})

router.get('/:cid', async (req,res)=>{
    let id = req.params.cid

    id=parseInt(id)  
    if(isNaN(id)){
        return res.status(400).send('Error, ingrese un argumento id numerico')
    }
    let {success, code, message, data} = await cm.getCartById(id)
    if (!success) {
        res.setHeader('Content-Type','application/json')
        return res.status(code).json({message})
    }

    res.setHeader('Content-Type','application/json')
    res.status(200).json(data)
})

router.post('/:cid/product/:pid', async (req,res)=>{
    let cid = req.params.cid
    let pid = req.params.pid
    let qt = req.body?.quantity
    cid=parseInt(cid)  
    pid=parseInt(pid)  
    qt=parseInt(qt)
    if(isNaN(cid) || isNaN(pid) || isNaN(qt)){
        return res.status(400).send('Error, ingrese un argumento id numerico')
    }
    if(qt <= 0){
        return res.status(400).send('Error, quantity debe ser mayor a 0')
    }
    let {success, code, message} = await cm.updateCarts(cid, pid, qt)
    res.setHeader('Content-Type','application/json')
    res.status(code).json({'success': success, 'resultado': message})
})