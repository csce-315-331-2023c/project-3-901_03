document.addEventListener("DOMContentLoaded", function () {
    const menuItems = document.querySelectorAll("#menu-items li");
    const orderList = document.querySelector("#order-items");
    const totalPrice = document.querySelector("#total-price");
    const deleteButton = document.querySelector("#delete-button");

    let currentOrder = [];
    let total = 0.00;

    // Removes the selected item from the order
    deleteButton.addEventListener("click", () => {
        const selectedItem = orderList.querySelector(".selected");
        if (selectedItem) {
            const itemIndex = Array.from(orderList.children).indexOf(selectedItem);
            const removedItem = currentOrder.splice(itemIndex, 1)[0];
            total -= removedItem.price;
            orderList.removeChild(selectedItem);
            updateTotal();
        }
    });

    menuItems.forEach(item => {
        item.addEventListener("click", () => {
            const itemName = item.getAttribute("data-name");
            const itemPrice = parseFloat(item.getAttribute("data-price"));

            const newItem = document.createElement("li");

            const incrementButton = document.createElement("button");
            incrementButton.textContent = "+";
            incrementButton.addEventListener("click", () => {
                // Increment the count of the item
                const orderItem = currentOrder.find(orderItem => orderItem.name === itemName);
                orderItem.count++;
                countSpan.textContent = orderItem.count;
                updateTotal();
            });

            const countSpan = document.createElement("span");
            countSpan.textContent = "1"; // Default count is 1
            countSpan.style.padding = "0 8px"; // Added padding

            const decrementButton = document.createElement("button");
            decrementButton.textContent = "-";
            decrementButton.addEventListener("click", () => {
                // Decrement the count of the item, and remove if count is zero
                const orderItem = currentOrder.find(orderItem => orderItem.name === itemName);
                if (orderItem.count > 1) {
                    orderItem.count--;
                    countSpan.textContent = orderItem.count;
                } else {
                    const itemIndex = currentOrder.indexOf(orderItem);
                    currentOrder.splice(itemIndex, 1);
                    orderList.removeChild(newItem);
                }
                updateTotal();
            });

            newItem.textContent = `${itemName} - $${itemPrice.toFixed(2)}`;
            newItem.style.padding = "0 8px";
            newItem.appendChild(incrementButton);
            newItem.appendChild(countSpan);
            newItem.appendChild(decrementButton);

            currentOrder.push({ name: itemName, price: itemPrice, count: 1 });

            newItem.addEventListener("click", () => {
                newItem.classList.toggle("selected");
            });

            orderList.appendChild(newItem);
            updateTotal();
        });
    });

    function updateTotal() {
        total = currentOrder.reduce((acc, item) => acc + item.price * item.count, 0);
        totalPrice.textContent = total.toFixed(2);
    }
});