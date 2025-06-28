import Swal from 'sweetalert2';

const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didOpen: (toast) => {
        toast.onmouseenter = Swal.stopTimer;
        toast.onmouseleave = Swal.resumeTimer;
}   
});


// ----- 1. Variable Declarations -----
const idInput = document.getElementById("id");
const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const amountInput = document.getElementById("amount");
const saveButton = document.getElementById("bttn");
const modifyButton = document.getElementById("modifyBtn");
const productsDiv = document.getElementById("products");

const productos = {};  // Base object
const productosSet = new Set();  // To avoid duplicates
const productosMap = new Map();  // For categories

// ----- 2. Save new product -----
saveButton.addEventListener("click", () => {
    const id = idInput.value.trim();
    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value);
    const amount = parseInt(amountInput.value);

    if (!id || !name || isNaN(price) || isNaN(amount) || price <= 0 || amount <= 0) {
        Swal.fire("Error", "All parameters have to be complete and more than 0", "error");
        return;
    }

    if (productos[id]) {
        Swal.fire("Error", "this product already exists. Use 'Modify' to update.", "error");
        return;
    }

    const producto = { id, nombre: name, precio: price, cantidad: amount };
    productos[id] = producto;
    productosSet.add(JSON.stringify(producto));

    const categoria = price > 50 ? "Electrónica" : "Oficina";
    productosMap.set(categoria, name);

    Toast.fire({
        icon: "success",
        title: "Signed in successfully"
    });

    clearInputs();
    renderResults();
});

// ----- 3. Modify existing product -----
modifyButton.addEventListener("click", () => {
    const id = idInput.value.trim();
    const name = nameInput.value.trim();
    const price = parseFloat(priceInput.value);
    const amount = parseInt(amountInput.value);

    if (!id || !name || isNaN(price) || isNaN(amount) || price <= 0 || amount <= 0) {
        Swal.fire("Error", "All parameters have to be complete and more than 0", "error");
        return;
    }

    if (!productos[id]) {
        Swal.fire("Error", "this product don't exist. Use 'Save' instead.", "error");
        return;
    }

    const productoAnterior = JSON.stringify(productos[id]);
    productosSet.delete(productoAnterior);

    const productoNuevo = { id, nombre: name, precio: price, cantidad: amount };
    productos[id] = productoNuevo;
    productosSet.add(JSON.stringify(productoNuevo));

    const categoria = price > 50000 ? "Electrónica" : "Oficina";
    productosMap.set(categoria, name);

    Swal.fire("Actualizado", "Product modificated correctly", "info");

    clearInputs();
    renderResults();
});

// ----- 4. Display results -----
function renderResults() {
    productsDiv.innerHTML = "";

    const titulo = document.createElement("h3");
    titulo.textContent = "Inventory Results";
    productsDiv.appendChild(titulo);

    const objTitle = document.createElement("h4");
    objTitle.textContent = "Products (Object):";
    productsDiv.appendChild(objTitle);
    for (let key in productos) {
        const p = document.createElement("p");
        p.textContent = `ID: ${key} | Name: ${productos[key].nombre} | Price: $${productos[key].precio}`;
        productsDiv.appendChild(p);
    }

    const setTitle = document.createElement("h4");
    setTitle.textContent = "Unique Products (Set):";
    productsDiv.appendChild(setTitle);
    for (let item of productosSet) {
        const prod = JSON.parse(item);
        const p = document.createElement("p");
        p.textContent = `ID: ${prod.id} | Name: ${prod.nombre} | Price: $${prod.precio}`;
        productsDiv.appendChild(p);
    }

    const mapTitle = document.createElement("h4");
    mapTitle.textContent = "Categories and Products (Map):";
    productsDiv.appendChild(mapTitle);
    productosMap.forEach((nombre, categoria) => {
        const p = document.createElement("p");
        p.textContent = `Category: ${categoria} → Product: ${nombre}`;
        productsDiv.appendChild(p);
    });
}

function clearInputs() {
    idInput.value = "";
    nameInput.value = "";
    priceInput.value = "";
    amountInput.value = "";
}
