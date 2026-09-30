import { Store } from "./Store.js";

// Create a store with sample products
const store = new Store([
    { id: 1, name: "Laptop", price: 350000, qty: 2 },
    { id: 2, name: "Mouse", price: 5000, qty: 3 },
    { id: 3, name: "Keyboard", price: 15000, qty: 1 }
]);

let nextId = 4;

// Get HTML elements
const form = document.getElementById("product-form");
const productList = document.getElementById("product-list");
const totalElement = document.getElementById("total");

const nameInput = document.getElementById("name");
const priceInput = document.getElementById("price");
const qtyInput = document.getElementById("qty");

// Display products in the table
function renderProducts() {
    productList.innerHTML = "";

    store.items.forEach(product => {
        const row = document.createElement("tr");

        const nameCell = document.createElement("td");
        nameCell.textContent = product.name;

        const priceCell = document.createElement("td");
        priceCell.textContent = product.price;

        const qtyCell = document.createElement("td");
        const qtyField = document.createElement("input");
        qtyField.type = "number";
        qtyField.min = "0";
        qtyField.value = product.qty;
        qtyField.className = "product-qty";
        qtyField.dataset.id = product.id;
        qtyField.setAttribute(
            "aria-label",
            `Quantity for ${product.name}`
        );
        qtyCell.appendChild(qtyField);

        const actionsCell = document.createElement("td");

        const updateButton = document.createElement("button");
        updateButton.textContent = "Update";
        updateButton.dataset.action = "update";
        updateButton.dataset.id = product.id;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.dataset.action = "delete";
        deleteButton.dataset.id = product.id;

        actionsCell.append(updateButton, " ", deleteButton);
        row.append(nameCell, priceCell, qtyCell, actionsCell);
        productList.appendChild(row);
    });

    updateTotal();
}

// Calculate the total price
function updateTotal() {
    const total = store.items.reduce((sum, product) => {
        return sum + product.price * product.qty;
    }, 0);

    totalElement.textContent = total.toLocaleString("en-US");
}

// Display an error next to an input
function showError(field, message) {
    document.getElementById(field + "-error").textContent = message;
}

// Handle form submission
form.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = nameInput.value.trim();
    const price = Number(priceInput.value);
    const qty = Number(qtyInput.value);

    showError("name", "");
    showError("price", "");
    showError("qty", "");

    let valid = true;

    if (name === "") {
        showError("name", "Product name is required");
        valid = false;
    }

    if (priceInput.value.trim() === "" ||
        !Number.isFinite(price) || price <= 0) {
        showError("price", "Price must be greater than 0");
        valid = false;
    }

    if (qtyInput.value.trim() === "" ||
        !Number.isInteger(qty) || qty < 0) {
        showError("qty", "Quantity must be a non-negative integer");
        valid = false;
    }

    if (!valid) return;

    store.add({
        id: nextId++,
        name,
        price,
        qty
    });

    form.reset();
    renderProducts();
});

// Event delegation: one listener for all product buttons
productList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-action]");

    if (!button || !productList.contains(button)) return;

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    if (action === "delete") {
        store.remove(id);
        renderProducts();
    }

    if (action === "update") {
        const row = button.closest("tr");
        const qtyField = row.querySelector(".product-qty");
        const newQty = Number(qtyField.value);

        if (qtyField.value.trim() === "" ||
            !Number.isInteger(newQty) || newQty < 0) {
            qtyField.setCustomValidity(
                "Enter a valid non-negative integer"
            );
            qtyField.reportValidity();
            return;
        }

        qtyField.setCustomValidity("");

        const product = store.find(id);
        if (product) {
            product.qty = newQty;
            renderProducts();
        }
    }
});

// Initial display
renderProducts();