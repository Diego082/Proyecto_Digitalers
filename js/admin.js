let consolasPrimerInicio = [
    {
        id: '5f49fab9-3135-4676-a160-5c3fdbb1ae92',
        descripcion: 'Consola de hogar con gráficos en alta definición.',
        titulo: 'PlayStation 5',
        precio: 499.99,
        imagen: 'https://stylewatch.vtexassets.com/arquivos/ids/233580-800-800?v=638188815205330000&width=800&height=800&aspect=true',
        categoria: 'consolas',
        fechaDeCreacion: '2020-11-12',
    },
    {
        id: '2e897bad-d4e4-413d-a515-ed95df9ad917',
        fechaDeCreacion: '2017-03-03',
        descripcion: 'Consola portátil con pantalla táctil.',
        titulo: 'Nintendo Switch',
        precio: 299.99,
        imagen: 'https://http2.mlstatic.com/D_NQ_NP_625423-MLA47920375564_102021-O.webp',
        categoria: 'accesorios'
    },
    {
        id: 'fc3025ec-f314-4b63-9765-1e8df3ee358a',
        descripcion: 'Consola de hogar con alta potencia y compatibilidad hacia atrás.',
        titulo: 'Xbox Series X',
        fechaDeCreacion: '2020-11-10',
        precio: 499.99,
        imagen: 'https://assets.xboxservices.com/assets/fb/d2/fbd2cb56-5c25-414d-9f46-e6a164cdf5be.png?n=XBX_A-BuyBoxBGImage01-D.png',
        categoria: 'juegos'
    },
   
];


let consolas = JSON.parse(localStorage.getItem("productos")) || consolasPrimerInicio


if(  JSON.parse(localStorage.getItem("productos")) === null  ) {

    localStorage.setItem("productos", JSON.stringify(consolas))
    
}



let idEditar;
const btn = document.querySelector('button.btn[type="submit"]')
const tableBodyHTML = document.querySelector("#table-body")


pintarProductos(consolas)



const inputFiltrarHTML = document.getElementById("filtrar")

const formularioProductoHTML = document.getElementById("formularioProducto")

// !LISTENER EVENTO FORMULARIO
formularioProductoHTML.addEventListener('submit', (evt) => {

    evt.preventDefault()

    const el = formularioProductoHTML.elements;

    let id;

    if(idEditar) {
        id = idEditar
    } else {
        id = crypto.randomUUID()
    }


    const nuevoProducto = {
        id: id,
        titulo: el.tituloName.value,
        descripcion: el.descripcion.value,
        precio: el.precio.valueAsNumber,
        imagen: el.imagen.value,
        categoria: el.categoria.value,
        fechaDeCreacion: obtenerFecha(),
    }


    if(idEditar) {
        const index = consolas.findIndex(consola => {
            return consola.id === idEditar
        })
        consolas[index] = nuevoProducto;
        idEditar = undefined;
        btn.innerText = "Agregar producto"
        btn.classList.remove("btn-success")
    } else {
        consolas.push(nuevoProducto)
    }


    Swal.fire({
        icon: 'success',
        title: 'Producto agregado/modificado correctamente',
        text: 'El producto se actualizo o modifico correctamente!',
      })


    pintarProductos(consolas)

    localStorage.setItem("productos", JSON.stringify(consolas))
    
    formularioProductoHTML.reset()
    el.tituloName.focus()
})




// - PINTAR PRODUCTOS
function pintarProductos(arrayAPintar) {

    tableBodyHTML.innerHTML = "";

    arrayAPintar.forEach(function(conso, index) {
        tableBodyHTML.innerHTML += 
            `<tr>
                <td class="table-image">
                        <img src="${conso.imagen}" alt="${conso.titulo}">
                </td>
                <td class="table-title">${conso.titulo}</td>
                <td class="table-description">${conso.descripcion}</td>
                <td class="table-price">${conso.precio}</td>
                <td class="table-category">${conso.categoria}</td>
                <td >
                    <div class="d-flex gap-1">
                        <button class="btn-delete btn btn-danger btn-sm" onclick="borrarProducto('${conso.id}')">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                        <button class="btn btn-success btn-sm" onclick="editarProducto('${conso.id}')" data-bs-toggle="modal" data-bs-target="#formModal">
                            <i class="fa-solid fa-pen-to-square"></i>
                        </button>
                    </div>
                    
                </td>
            </tr>`
    })
}


//Funcion para filtrar productos
inputFiltrarHTML.addEventListener('keyup', (evt) => {

    const busqueda = evt.target.value.toLowerCase();
    
    const resultado = consolas.filter((producto) =>  {
        const titulo = producto.titulo.toLowerCase()
        if( titulo.includes(busqueda)  ) {
            return true
        } 
        return false
    } )
    pintarProductos(resultado)

})


const borrarProducto = (idABuscar) => {
    Swal.fire({
        title: 'Desea borrar producto',
        icon: 'error',
        text: 'Realmente desea elminar el producto?',
        showCloseButton: true,
        showCancelButton: true,
        cancelButtonText: 'Cancelar' ,
        confirmButtonText: 'Borrar',
      }).then((result) => {

        if(result.isConfirmed) {
            const indiceEncontrado = consolas.findIndex((productoFindIndex) => {
                if(productoFindIndex.id === idABuscar) {
                    return true
                }
                return false
            })
            consolas.splice(indiceEncontrado, 1);

            pintarProductos(consolas)

            localStorage.setItem("productos", JSON.stringify(consolas)   )


            Swal.fire('Borrado!', 'Producto borrado correctamente', 'success')
        }
    })
}

// - Editar producto
const editarProducto = function(idRecibido) {

    console.log(`Editar elemento ${idRecibido}`)
    const productoEditar = consolas.find((prod) => {
        if(prod.id === idRecibido) {
            return true
        }
    })

    if(!productoEditar) return;

    idEditar = productoEditar.id

    const elements = formularioProductoHTML.elements;

    elements.tituloName.value = productoEditar.titulo;
    elements.precio.value = productoEditar.precio;
    elements.descripcion.value = productoEditar.descripcion;
    elements.imagen.value = productoEditar.imagen;
    elements.categoria.value = productoEditar.categoria;

    
    btn.innerText = "Editar Producto"
    btn.classList.add("btn-success")



    
}