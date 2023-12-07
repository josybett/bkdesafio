const socket = io()

const inputMensaje = document.getElementById('message-to-send')
const divMensajes = document.getElementById('messages-list')
const botonEnviar = document.getElementById('message-to-send')

function sendMessage(user, message) {
    fetch("http://localhost:8080/api/message", {
        method: "POST",
        body: JSON.stringify({
        user,
        message,
        }),
        headers: {
        "Content-type": "application/json; charset=UTF-8"
        }
    });
}

socket.on("connect", () => {
    socket.on('nuevoMensaje', datos => {
        const { user, message } = datos
        parrafo=document.createElement('li', {classList: ['clearfix']})
        parrafo.innerHTML=`<div class="message-data align-right">
        <span class="message-data-name" >${user}</span> <i class="fa fa-circle me"></i></div>
        <div class="message other-message float-right">
            ${message}
        </div>`
        divMensajes.append(parrafo)
        divMensajes.scrollTop=divMensajes.scrollHeight
    })
}) 

Swal.fire({
    title: "Identifiquese",
    input: "email",
    text: "Ingrese su email",
    inputAttributes: {
        autocapitalize: "on",
        id: "input-name"
    },
    showLoaderOnConfirm: true,
    allowOutsideClick: false,
    inputValidator: (value)=>{
    return (!value || !String(value)
        .toLowerCase()
        .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )) && "Debe ingresar un email válido"
    },
    allowOutsideClick:false
}).then((resultado) => {
    Swal.fire({
        text:`Se ha conectado...!!!`,
        toast:true,
        position:"top-right"
    })

    const nickname = resultado.value
    socket.emit('id', nickname)
    inputMensaje.focus()
    document.title=nickname

    inputMensaje.addEventListener("keyup",(e)=>{
        if(e.code==="Enter" && e.target.value.trim().length>0){
            sendMessage(nickname, e.target.value.trim())
            e.target.value=''
        }
    })
    
    botonEnviar.addEventListener("click",()=>{
        const { value } = inputMensaje
        if (value.trim().length>0) {
            sendMessage(nickname, value.trim())
            inputMensaje.value=''
        }
    })  
})