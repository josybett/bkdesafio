const socket = io()

socket.on("connect", () => {
    console.log("Conectado al socket")
    Swal.fire({
        position: "top-end",
        icon: "success",
        title: "Conexión al socket exitosa",
        showConfirmButton: false,
        timer: 1500
    })
});

socket.on("newProduct", product=>{
    console.log("socket recibido: newProduct, mensaje: ", product)
    let ulProducts = document.querySelector('ul')
    let liNew = document.createElement('li')
    liNew.id = product.id
    liNew.innerHTML = product.title
    ulProducts.append(liNew)
})

socket.on("deleteProduct", id=>{
    console.log("socket recibido: deleteProduct, mensaje: ", id)
    let product = document.getElementById(id)
    product.remove()
})
