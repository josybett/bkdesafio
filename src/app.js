import express from 'express'
import { router as productRouter } from './routes/productsRouter.js';
import { router as cartsRouter } from './routes/cartsRouter.js';
import { router as viewsRouter } from './routes/viewsRouter.js';
import __dirname from './utils.js';
import path from 'path';
import { engine } from 'express-handlebars'
import {Server} from 'socket.io'
import { httpSocket } from './middleware/socket.js'

const PORT = 8080;

const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname,'/views'));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public')))

app.use('/api/products', httpSocket, productRouter)
app.use('/api/carts', cartsRouter)
app.use('/', viewsRouter)

const server = app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`)
});

export const io = new Server(server)

io.on("connect", () => {
    console.log(`Cliente conectado`)
})