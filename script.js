document.addEventListener("DOMContentLoaded", function () {
    // Select the necessary elements
    const searchBox = document.getElementById("search-box");
    const productBoxes = document.querySelectorAll(".products .box");
    const menuBoxes = document.querySelectorAll(".menu .box");
    const cartBtn = document.getElementById("cart-btn");
    const cartItemContainer = document.querySelector(".cart-item-container");
    const checkoutBtn = document.getElementById("checkout-btn");
    
    // Create an array to store the cart items
    let cartItems = [];

    // Function to filter products and menu items based on the search query
    function filterContent(query) {
        query = query.toLowerCase(); // Convert the query to lowercase for case-insensitive comparison

        // Filter through products
        productBoxes.forEach(box => {
            const productName = box.querySelector(".content h3").textContent.toLowerCase();
            if (productName.includes(query)) {
                box.style.display = "block"; // Show product
            } else {
                box.style.display = "none"; // Hide product
            }
        });

        // Filter through menu items
        menuBoxes.forEach(box => {
            const menuName = box.querySelector("h3").textContent.toLowerCase();
            if (menuName.includes(query)) {
                box.style.display = "block"; // Show menu item
            } else {
                box.style.display = "none"; // Hide menu item
            }
        });
    }

    // Event listener for search box
    searchBox.addEventListener("input", function () {
        filterContent(searchBox.value);
    });

    // Function to add an item to the cart
    function addToCart(item) {
        // Get the product name and price
        const itemName = item.querySelector("h3").textContent;
        const itemPrice = item.querySelector(".price").textContent.trim();

        // Create a cart item object
        const cartItem = {
            name: itemName,
            price: itemPrice,
            quantity: 1 // Set initial quantity as 1
        };

        // Check if item already exists in the cart
        const existingItemIndex = cartItems.findIndex(cartItem => cartItem.name === itemName);
        if (existingItemIndex > -1) {
            cartItems[existingItemIndex].quantity += 1; // If it exists, increase the quantity
        } else {
            cartItems.push(cartItem); // Otherwise, add the new item
        }

        // Update the cart display
        updateCartUI();
    }

    // Function to update the cart UI
    function updateCartUI() {
        cartItemContainer.innerHTML = ""; // Clear the current cart display
        cartItems.forEach(item => {
            const cartItemDiv = document.createElement("div");
            cartItemDiv.classList.add("cart-item");
            
            cartItemDiv.innerHTML = `
                <span class="fas fa-times" onclick="removeFromCart('${item.name}')"></span>
                <div class="content">
                    <h3>${item.name}</h3>
                    <div class="price">${item.price} x ${item.quantity}</div>
                </div>
            `;
            cartItemContainer.appendChild(cartItemDiv);
        });
    }

    // Function to remove an item from the cart
    function removeFromCart(itemName) {
        cartItems = cartItems.filter(item => item.name !== itemName); // Remove item from the cart
        updateCartUI(); // Update the cart UI
    }

    // Function to calculate total price
    function calculateTotalPrice() {
        return cartItems.reduce((total, item) => {
            const itemPrice = parseFloat(item.price.replace(/[^0-9.-]+/g,"")); // Remove currency symbols for calculation
            return total + (itemPrice * item.quantity);
        }, 0);
    }

    // Function to handle the checkout process
    function handleCheckout() {
        if (cartItems.length > 0) {
            const totalPrice = calculateTotalPrice();
            let orderSummary = "Order Summary:\n\n";
            cartItems.forEach(item => {
                orderSummary += `${item.name} - ${item.price} x ${item.quantity}\n`;
            });
            orderSummary += `\nTotal Price: ${totalPrice.toFixed(2)}`;
            alert(orderSummary);
            // You can add logic here to proceed with the actual checkout, e.g., sending data to a server
        } else {
            alert("Your cart is empty!");
        }
    }

    // Event listeners for "Add to Cart" buttons in products and menu
    document.querySelectorAll(".products .box .btn").forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            const productBox = this.closest(".box");
            addToCart(productBox);
        });
    });

    document.querySelectorAll(".menu .box .btn").forEach(button => {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            const menuBox = this.closest(".box");
            addToCart(menuBox);
        });
    });

    // Event listener to show/hide the cart when cart button is clicked
    cartBtn.addEventListener("click", function () {
        cartItemContainer.classList.toggle("active");
    });

    // Event listener for checkout button
    checkoutBtn.addEventListener("click", handleCheckout);
});
