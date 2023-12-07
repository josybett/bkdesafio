import { messageModel } from "./models/messageModel.js"
import { logError } from "../utils.js"
import mongoose from "mongoose"

export class MessageManager {
    
    async addMessage(request) {
        try {
            let { user, message } = request
            let newMess = {}

            let valEmail =  /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/;
            if(!valEmail.test(user)){
                return {
                    'success': true,
                    'code': 400,
                    'message': `Email de usuario inválido: ${user}`,
                    'data': {}
                }
            }
            if (!message) {
                return {
                    'success': true,
                    'code': 400,
                    'message': `Has olvidado escribir tu mensaje`,
                    'data': {}
                }
            }

            try {
                newMess = await messageModel.create({user, message})
            } catch (error) {
                return logError('addMessage error mongose: ', 500, error)
            }

            return {
                'success': true,
                'code': 200,
                'message': `Creado con éxito mensaje: ${user}`,
                'data': newMess
            }
        } catch (error) {
            return logError('addMessage error: ', 500, error)
        }
    }

    async getMessages() {
        let messages = []
        try {
            messages = await messageModel.find({}).sort({updatedAt: 1})
        } catch (error) {
            return logError('getMessages error mongose: ', 500, error)
        }

        return messages
    }
}