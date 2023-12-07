import {Router} from 'express';
import { MessageManager } from '../dao/messageManager.js';
import { io } from '../app.js';

export const router = Router()
const mm = new MessageManager();

router.get('/', async (req,res)=>{
    let resultado = await mm.getMessages()

    res.setHeader('Content-Type','application/json')
    res.status(200).json({resultado})
})

router.post('/', async (req,res)=>{
    let {success, code, message, data} = await mm.addMessage(req.body)
    if (success) {
        console.log("socket enviando: newMessage, mensaje: ", data)
        io.emit("nuevoMensaje", data)
    }
    res.setHeader('Content-Type','application/json')
    res.status(code).json({'success': success, 'resultado': message})
})