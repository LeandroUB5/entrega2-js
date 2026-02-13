function Producto(id, nombre, precio, imagen) {
  this.id = id;
  this.nombre = nombre;
  this.precio = precio;
  this.imagen = imagen;
}

let productos = [
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

const btnLogin = document.getElementById("btnLogin");
const btnLogout = document.getElementById("btnLogout");
const loginModal = document.getElementById("loginModal");
const closeModal = document.getElementById("closeModal");
const userInfo = document.getElementById("userInfo");
const loginForm = document.getElementById("loginForm");
const adminPanel = document.getElementById("adminPanel");

// Estos son los 2 usuarios que puse por defecto para que se vean las funciones.
const usuarios = [
  { email: "admin@tienda.com", password: "1234", role: "admin" },
  { email: "cliente@tienda.com", password: "5678", role: "cliente" },
];

btnLogin.addEventListener("click", () => {
  loginModal.style.display = "block";
});
closeModal.addEventListener("click", () => {
  loginModal.style.display = "none";
});
window.addEventListener("click", (e) => {
  if (e.target === loginModal) {
    loginModal.style.display = "none";
  }
});

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  const user = usuarios.find(
    (u) => u.email === email && u.password === password,
  );

  if (user) {
    alert("Login exitoso como " + user.role);

    localStorage.setItem("usuarioLogueado", JSON.stringify(user));

    if (user.role === "admin") {
      adminPanel.style.display = "block";
    } else {
      adminPanel.style.display = "none";
    }

    userInfo.textContent = `Bienvenido, ${user.role} (${user.email})`;
    userInfo.style.display = "inline-block";

    btnLogin.style.display = "none";
    btnLogout.style.display = "inline-block";

    loginModal.style.display = "none";
  } else {
    alert("Usuario o contraseña incorrectos");
  }
});

const usuarioGuardado = JSON.parse(localStorage.getItem("usuarioLogueado"));
if (usuarioGuardado) {
  if (usuarioGuardado.role === "admin") {
    adminPanel.style.display = "block";
  }
  userInfo.textContent = `Bienvenido, ${usuarioGuardado.role} (${usuarioGuardado.email})`;
  btnLogin.style.display = "none";
  btnLogout.style.display = "inline-block";
}

btnLogout.addEventListener("click", () => {
  localStorage.removeItem("usuarioLogueado");
  userInfo.textContent = "";
  adminPanel.style.display = "none";

  btnLogout.style.display = "none";
  btnLogin.style.display = "inline-block";

  alert("Sesión cerrada correctamente");
});

const formProducto = document.getElementById("formProducto");
formProducto.addEventListener("submit", (e) => {
  e.preventDefault();

  const nombre = document.getElementById("nombreProd").value;
  const precio = parseFloat(document.getElementById("precioProd").value);
  const imagen = document.getElementById("imagenProd").value;

  const nuevoId = productos.length ? productos[productos.length - 1].id + 1 : 1;
  const nuevoProducto = new Producto(nuevoId, nombre, precio, imagen);

  productos.push(nuevoProducto);
  renderProductos(productos);

  alert("Producto agregado correctamente");
  formProducto.reset();
});

function renderProductos(lista) {
  contenedorProductos.innerHTML = "";

  const usuarioLogueado = JSON.parse(localStorage.getItem("usuarioLogueado"));

  lista.forEach((prod) => {
    const card = document.createElement("div");
    card.classList.add("producto");

    card.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}" style="width:100%; border-radius:8px; margin-bottom:10px;">
      <h3>${prod.nombre}</h3>
      <p>$${prod.precio}</p>
      <button data-id="${prod.id}">Agregar</button>
    `;

    if (usuarioLogueado && usuarioLogueado.role === "admin") {
      const btnEliminar = document.createElement("button");
      btnEliminar.textContent = "Eliminar producto";
      btnEliminar.style.backgroundColor = "#00bfff";
      btnEliminar.style.color = "#fff";
      btnEliminar.style.marginLeft = "10px";

      btnEliminar.addEventListener("click", () => {
        productos = productos.filter((p) => p.id !== prod.id);
        renderProductos(productos);
        alert("Producto eliminado correctamente");
      });

      card.appendChild(btnEliminar);
    }

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
  if (e.target.tagName === "BUTTON" && e.target.dataset.id) {
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
