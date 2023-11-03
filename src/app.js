const express = require('express');
const ProductManager = require('./productManager');
const PORT = 3000;

const app = express();
const pm = new ProductManager();

app.get('/products', async (req,res)=>{
    const limit = req.query.limit ?? 0
    let resultado = await pm.getProducts(limit)

    res.setHeader('Content-Type','application/json')
    res.status(200).json({limit, resultado})
})

app.get('/products/:pid', async (req,res)=>{
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

app.listen(PORT,()=>{
    console.log(`Server escuchando en puerto ${PORT}`)
});