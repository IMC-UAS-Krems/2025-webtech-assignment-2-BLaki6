var taxRate = 0.20;
var discount3 = 0.10;
var discount5 = 0.20;

var products = [
    { id: 1, name: "Warm Blanket", price: 12, img: "img/blanket.png", desc: "Soft blanket to keep animals warm." },
    { id: 2, name: "Pedigree Dog Food", price: 18, img: "img/dogfood.png", desc: "Dry food for adult dogs." },
    { id: 3, name: "Whiskas Cat Food", price: 16, img: "img/catfood.png", desc: "Dry food for adult cats." },
    { id: 4, name: "Animal Bed", price: 20, img: "img/bed.png", desc: "Comfortable bed for dogs and cats." },
    { id: 5, name: "Senior Pet Support", price: 45, img: "img/senior.png", desc: "Extra care for senior animals." },
    { id: 6, name: "One Week Shelter Care", price: 35, img: "img/shelter.png", desc: "Care costs for one week." },
    { id: 7, name: "Emergency Vet Visit", price: 40, img: "img/vet.png", desc: "Helps pay for vet treatment." },
    { id: 8, name: "Food & Water Bowl Set", price: 14, img: "img/bowl.png", desc: "Daily feeding bowls." },
    { id: 9, name: "Toy Bundle", price: 15, img: "img/toy.png", desc: "Toys to keep animals active." },
    { id: 10, name: "Vaccination Support", price: 30, img: "img/vaccine.png", desc: "Supports vaccinations." }
];

var cart = [];
var galleryDiv = document.getElementById("productGallery");
var cartDiv = document.getElementById("cartArea");
var sumItems = document.getElementById("sumItems");
var sumSubtotal = document.getElementById("sumSubtotal");
var sumDiscount = document.getElementById("sumDiscount");
var sumTax = document.getElementById("sumTax");
var sumTotal = document.getElementById("sumTotal");
var clearBtn = document.getElementById("clearCartBtn");
var checkoutBtn = document.getElementById("checkoutBtn");
var form = document.getElementById("checkoutForm");
var confirmSection = document.getElementById("confirmCollapse");
var confirmBox = document.getElementById("confirmBox");

confirmSection.style.display = "none";

function showProducts() {
    var html = "";
    var i;

    for (i = 0; i < products.length; i++) {
        html += '<div class="col-sm-6 col-lg-4">';
        html += '<div class="card h-100">';
        html += '<img src="' + products[i].img + '" class="card-img-top">';
        html += '<div class="card-body d-flex flex-column">';
        html += '<h5>' + products[i].name + '</h5>';
        html += '<p class="small flex-grow-1">' + products[i].desc + '</p>';
        html += '<div class="d-flex justify-content-between">';
        html += '<strong>€' + products[i].price.toFixed(2) + '</strong>';
        html += '<button class="btn btn-sm btn-primary addBtn" data-id="' + products[i].id + '">Add</button>';
        html += '</div></div></div></div>';
    }

    galleryDiv.innerHTML = html;

    var buttons = document.getElementsByClassName("addBtn");
    for (i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", addToCart);
    }
}

function addToCart(e) {
    var id = parseInt(e.target.getAttribute("data-id"), 10);
    var i;

    for (i = 0; i < products.length; i++) {
        if (products[i].id === id) {

            var found = false;
            var j;

            for (j = 0; j < cart.length; j++) {
                if (cart[j].id === id) {
                    cart[j].amount = cart[j].amount + 1;
                    found = true;
                }
            }

            if (!found) {
                cart.push({
                    id: products[i].id,
                    name: products[i].name,
                    price: products[i].price,
                    amount: 1
                });
            }
        }
    }
    updateCart();
}

function removeFromCart(e) {
    var id = parseInt(e.target.getAttribute("data-id"), 10);
    var i;

    for (i = 0; i < cart.length; i++) {
        if (cart[i].id === id) {
            cart.splice(i, 1);
        }
    }

    updateCart();
}

clearBtn.addEventListener("click", function () {
    cart = [];
    updateCart();
});

function updateCart() {
    var html = "";
    var i;
    var donationCount = 0;
    var subtotal = 0;

    for (i = 0; i < cart.length; i++) {
        donationCount = donationCount + cart[i].amount;
        subtotal = subtotal + (cart[i].price * cart[i].amount);
    }
    var discount = 0;

    if (donationCount >= 5) {
        discount = subtotal * discount5;
    } else if (donationCount >= 3) {
        discount = subtotal * discount3;
    }
    var afterDiscount = subtotal - discount;
    var tax = afterDiscount * taxRate;
    var total = afterDiscount + tax;

    if (cart.length === 0) {
        cartDiv.innerHTML = "<p class='text-muted'>Your cart is empty.</p>";
    } else {
        html += "<table class='table table-sm'>";
        html += "<tr><th>Donation</th><th>Amount</th><th>Total</th><th></th></tr>";

        for (i = 0; i < cart.length; i++) {
            html += "<tr>";
            html += "<td>" + cart[i].name + "</td>";
            html += "<td>" + cart[i].amount + "</td>";
            html += "<td>€" + (cart[i].price * cart[i].amount).toFixed(2) + "</td>";
            html += "<td><button class='btn btn-sm btn-danger removeBtn' data-id='" + cart[i].id + "'>x</button></td>";
            html += "</tr>";
        }

        html += "</table>";
        cartDiv.innerHTML = html;

        var removeBtns = document.getElementsByClassName("removeBtn");
        for (i = 0; i < removeBtns.length; i++) {
            removeBtns[i].addEventListener("click", removeFromCart);
        }
    }

    sumItems.innerHTML = donationCount;
    sumSubtotal.innerHTML = "€" + subtotal.toFixed(2);
    sumDiscount.innerHTML = "-€" + discount.toFixed(2);
    sumTax.innerHTML = "€" + tax.toFixed(2);
    sumTotal.innerHTML = "€" + total.toFixed(2);
    clearBtn.disabled = (donationCount === 0);
    checkoutBtn.disabled = (donationCount === 0);
}

form.addEventListener("submit", function (e) {
    e.preventDefault();

    form.classList.add("was-validated");
    if (!form.checkValidity()) return;
    if (cart.length === 0) return;

    var first = document.getElementById("firstName").value;
    var last = document.getElementById("lastName").value;
    var email = document.getElementById("email").value;
    var donationCount = 0;
    var subtotal = 0;
    var i;

    for (i = 0; i < cart.length; i++) {
        donationCount = donationCount + cart[i].amount;
        subtotal = subtotal + (cart[i].price * cart[i].amount);
    }

    var discount = 0;
    if (donationCount >= 5) discount = subtotal * discount5;
    else if (donationCount >= 3) discount = subtotal * discount3;

    var afterDiscount = subtotal - discount;
    var tax = afterDiscount * taxRate;
    var total = afterDiscount + tax;
    var listHtml = "<h6>Your donations</h6>";

    listHtml += "<table class='table table-sm'>";
    listHtml += "<tr><th>Donation</th><th>Amount</th><th>Total</th></tr>";

    for (i = 0; i < cart.length; i++) {
        listHtml += "<tr>";
        listHtml += "<td>" + cart[i].name + "</td>";
        listHtml += "<td>" + cart[i].amount + "</td>";
        listHtml += "<td>€" + (cart[i].price * cart[i].amount).toFixed(2) + "</td>";
        listHtml += "</tr>";
    }

    listHtml += "</table>";
    confirmBox.innerHTML =
        "<p><strong>Name:</strong> " + first + " " + last + "</p>" +
        "<p><strong>Email:</strong> " + email + "</p>" +
        "<hr>" +
        listHtml +
        "<hr>" +
        "<p><strong>Subtotal:</strong> €" + subtotal.toFixed(2) + "</p>" +
        "<p><strong>Discount:</strong> -€" + discount.toFixed(2) + "</p>" +
        "<p><strong>Tax (20%):</strong> €" + tax.toFixed(2) + "</p>" +
        "<p class='fw-bold'><strong>Total:</strong> €" + total.toFixed(2) + "</p>";

    confirmSection.style.display = "block";
    cart = [];
    updateCart();
    form.reset();
    form.classList.remove("was-validated");
});

showProducts();
updateCart();