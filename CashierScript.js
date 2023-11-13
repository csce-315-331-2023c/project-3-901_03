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
            totalPrice.textContent = total.toFixed(2);
        }
    });

    menuItems.forEach(item => {
        item.addEventListener("click", () => {
            const itemName = item.getAttribute("data-name");
            const itemPrice = parseFloat(item.getAttribute("data-price"));

            currentOrder.push({ name: itemName, price: itemPrice });
            total += itemPrice;

            const newItem = document.createElement("li");
            newItem.textContent = `${itemName} - $${itemPrice.toFixed(2)}`;

            newItem.addEventListener("click", () => {
                newItem.classList.toggle("selected");
            });

            orderList.appendChild(newItem);
            totalPrice.textContent = total.toFixed(2);
        });
    });
});
