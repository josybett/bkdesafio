import { Router } from 'express';
import { ProductManagerMongo } from '../dao/productManagerMongo.js';
import { MessageManager } from '../dao/messageManager.js';

export const router=Router()
const pm = new ProductManagerMongo()
const mm = new MessageManager()

router.get('/', async (req,res)=>{
    let products = await pm.getProducts()
    res.status(200).render('home', {products})
})

router.get('/realtimeproducts', async (req,res)=>{
    let products = await pm.getProducts()
    res.status(200).render('realTimeProducts', {products})
})

router.get('/chat', async (req, res) => {
    let messages = await mm.getMessages()
    res.status(200).render('chat', {messages})
})