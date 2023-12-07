import {Router} from 'express';
import { CartsManagerMongo } from '../dao/cartsManagerMongo.js';
import mongoose from "mongoose"

export const router = Router()
const cm = new CartsManagerMongo();

router.post('/', async (req,res)=>{
    let {success, code, message} = await cm.addCarts(req.body)

    res.setHeader('Content-Type','application/json')
    res.status(code).json({'success':success, 'resultado': message})
})

router.get('/:cid', async (req,res)=>{
    let id = req.params.cid
    res.setHeader('Content-Type','application/json');

    let {success, code, message, data} = await cm.getCartById(id)
    if (!success) {
        return res.status(code).json({message})
    }

    res.status(200).json(data)
})

router.post('/:cid/product/:pid', async (req,res)=>{
    let cid = req.params.cid
    let pid = req.params.pid
    let qt = req.body?.quantity
    res.setHeader('Content-Type','application/json');

    if(!mongoose.Types.ObjectId.isValid(cid) || !mongoose.Types.ObjectId.isValid(pid)) {
        return res.status(400).json({error:`Ingrese un argumento id válido`})
    }

    qt=parseInt(qt)
    if(isNaN(qt)){
        return res.status(400).json({error:`quantity debe ser numérico`})
    }
    if(qt <= 0){
        return res.status(400).json({error:`quantity debe ser mayor a 0`})
    }
    let {success, code, message} = await cm.updateCarts(cid, pid, qt)
    res.status(code).json({'success': success, 'resultado': message})
})