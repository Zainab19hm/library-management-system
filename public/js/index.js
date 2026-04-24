function viewBook(bookId) {
    window.location.href = `/user/books/${bookId}`;
}

function showMessage(message, type) {
    const messageElement = document.getElementById('message');
    if (messageElement) {
        messageElement.innerHTML = `
            <div class="alert alert-${type} alert-dismissible fade show" role="alert">
                ${message}
                <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `;
    }
}

function addToCart(bookId, bookName) {
    fetch('/user/cart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bookId: bookId })
    })
        .then(response => response.json())
        .then(data => {
            if (data.message) {
                showMessage(`${bookName} added to cart`, 'success');
            }
            if (data.newStock !== undefined) {
                const stockElement = document.getElementById(`stock-${bookId}`);
                if (stockElement) {
                    stockElement.innerHTML = `<i class="fa-solid fa-box"></i> ${data.newStock} left`;
                }
            }
            updateCartDisplay(data.cart);
        })
        .catch(error => console.error('Error:', error));
}

function updateQuantity(bookId, bookName, action) {
    fetch(`/user/cart/update/${bookId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action: action })
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showMessage(`Cart updated for ${bookName}`, 'success');
                updateCartDisplay(data.cart);
            }
        })
        .catch(error => console.error('Error:', error));
}

function removeFromCart(bookId) {
    fetch(`/user/cart/remove/${bookId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                showMessage('Book removed from cart successfully', 'success');
                updateCartDisplay(data.cart);
            }
        })
        .catch(error => console.error('Error:', error));
}

function updateCartDisplay(cart) {
    const cartElement = document.getElementById('cart');
    if (cartElement) {
        let totalAmount = 0;

        if (cart && cart.length > 0) {
            let cartHTML = `
                <div class="table-responsive">
                    <table class="table cart-table">
                        <thead>
                            <tr>
                                <th>Image</th>
                                <th>Book</th>
                                <th>Author</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
            `;

            cart.forEach(item => {
                let bookPrice = parseFloat(item.book_price);
                if (isNaN(bookPrice)) {
                    console.error('Invalid price for item:', item);
                    bookPrice = 0;
                }
                let itemTotal = bookPrice * item.quantity;
                totalAmount += itemTotal;

                cartHTML += `
                    <tr>
                        <td>
                            <div class="book-img-wrapper">
                                <img src="/img/${item.book_img}" alt="${item.book_name}">
                            </div>
                        </td>
                        <td class="align-middle">
                            <span class="book-title">
                                ${item.book_name}
                            </span>
                        </td>
                        <td class="align-middle">
                            <span class="book-author">
                                ${item.book_author}
                            </span>
                        </td>
                        <td class="align-middle">₹${bookPrice.toFixed(2)}</td>
                        <td class="align-middle">
                            <div class="quantity-control">
                                <button class="btn-qty" onclick="updateQuantity('${item.book_id}', '${item.book_name}', 'decrease')">
                                    <i class="fa-solid fa-minus"></i>
                                </button>
                                <span class="qty-display">
                                    ${item.quantity}
                                </span>
                                <button class="btn-qty" onclick="updateQuantity('${item.book_id}', '${item.book_name}', 'increase')">
                                    <i class="fa-solid fa-plus"></i>
                                </button>
                            </div>
                        </td>
                        <td class="align-middle font-weight-bold">₹${itemTotal.toFixed(2)}</td>
                        <td class="align-middle">
                            <button class="btn-remove" onclick="removeFromCart('${item.book_id}')">
                                <i class="fa-solid fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `;
            });

            cartHTML += `
                        </tbody>
                    </table>
                </div>

                <div class="cart-summary">
                    <div class="total-amount">
                        <span>Total Amount:</span>
                        <span class="amount">₹${totalAmount.toFixed(2)}</span>
                    </div>
                    <button class="btn-checkout" onclick="proceedToPay()">
                        Proceed to Checkout <i class="fa-solid fa-arrow-right"></i>
                    </button>
                </div>
            `;
            cartElement.innerHTML = cartHTML;
        } else {
            cartElement.innerHTML = `
                <div class="empty-cart-state">
                    <i class="fa-solid fa-cart-shopping"></i>
                    <h3>Your cart is empty</h3>
                    <p>Looks like you haven't added any books yet.</p>
                    <a href="/user/books" class="btn-browse">Browse Books</a>
                </div>
            `;
        }
    }
}

function proceedToPay() {
    window.location.href = '/user/checkout';
}