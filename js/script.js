function Producto(id, nombre, precio, imagen) {
  this.id = id;
  this.nombre = nombre;
  this.precio = precio;
  this.imagen = imagen;
}

const productos = [
  new Producto(1, "Auriculares", 80000, "assets/img/auricularesGamer.webp"),
  new Producto(2, "Teclado Mecánico", 120000, "assets/img/tecladoGamer.jpg"),
  new Producto(3, "Mouse Gamer", 50000, "assets/img/mouseGamer.jpg"),
];

let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

const contenedorProductos = document.getElementById("productos");
const contenedorCarrito = document.getElementById("carrito");
const totalCarrito = document.getElementById("total");
const btnVaciar = document.getElementById("vaciarCarrito");
const buscador = document.getElementById("buscador");

function renderProductos(lista) {
  contenedorProductos.innerHTML = "";
  lista.forEach((prod) => {
    const card = document.createElement("div");
    card.classList.add("producto");
    card.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}" style="width:100%; border-radius:8px; margin-bottom:10px;">
      <h3>${prod.nombre}</h3>
      <p>$${prod.precio}</p>
      <button data-id="${prod.id}">Agregar</button>
    `;
    contenedorProductos.appendChild(card);
  });
}

function renderCarrito() {
  contenedorCarrito.innerHTML = "";

  carrito.forEach((item) => {
    const p = document.createElement("p");

    p.textContent = `${item.nombre} - $${item.precio} x ${item.cantidad}`;

    const btnSumar = document.createElement("button");
    btnSumar.textContent = "➕";
    btnSumar.addEventListener("click", () => {
      sumarCantidad(item.id);
    });

    const btnRestar = document.createElement("button");
    btnRestar.textContent = "➖";
    btnRestar.addEventListener("click", () => {
      restarCantidad(item.id);
    });

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "❌";
    btnEliminar.style.backgroundColor = "red";
    btnEliminar.style.marginLeft = "10px";
    btnEliminar.addEventListener("click", () => {
      eliminarDelCarrito(item.id);
    });

    p.appendChild(btnSumar);
    p.appendChild(btnRestar);
    p.appendChild(btnEliminar);

    contenedorCarrito.appendChild(p);
  });

  const total = carrito.reduce(
    (acc, prod) => acc + prod.precio * prod.cantidad,
    0,
  );
  totalCarrito.textContent = `Total: $${total}`;
}

contenedorProductos.addEventListener("click", (e) => {
  if (e.target.tagName === "BUTTON") {
    const id = parseInt(e.target.dataset.id);
    const producto = productos.find((p) => p.id === id);
    const item = carrito.find((p) => p.id === id);

    if (item) {
      item.cantidad++;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderCarrito();
  }
});

btnVaciar.addEventListener("click", () => {
  carrito = [];
  localStorage.removeItem("carrito");
  renderCarrito();
});

function eliminarDelCarrito(id) {
  carrito = carrito.filter((p) => p.id !== id);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderCarrito();
}

function sumarCantidad(id) {
  const item = carrito.find((p) => p.id === id);
  if (item) {
    item.cantidad++;
    localStorage.setItem("carrito", JSON.stringify(carrito));
    renderCarrito();
  }
}

function restarCantidad(id) {
  const item = carrito.find((p) => p.id === id);
  if (item && item.cantidad > 1) {
    item.cantidad--;
  } else {
    carrito = carrito.filter((p) => p.id !== id);
  }
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderCarrito();
}

buscador.addEventListener("input", () => {
  const texto = buscador.value.toLowerCase();
  const filtrados = productos.filter((p) =>
    p.nombre.toLowerCase().includes(texto),
  );
  renderProductos(filtrados);
});

renderProductos(productos);
renderCarrito();
