const baseUrl = 'https://ecommercebackend.fundamentos-29.repl.co/';
const productsList = document.querySelector('#products-container');
const navToggle = document.querySelector('.nav__button--toggle');
const navCar = document.querySelector('.nav__car');
const car = document.querySelector('#car');
const carList = document.querySelector('#car__list');
const emptyCarButton = document.querySelector('#empty-car');

let carProducts = [];

const modalContainer = document.querySelector('#modal-container');
const modalElement = document.querySelector('#modal-element');

let modalDetails = [];

navToggle.addEventListener('click', () => {
    navCar.classList.toggle('nav__car--visible')
})

eventListenersLoader()

function eventListenersLoader() {
    productsList.addEventListener('click', addProduct);
    car.addEventListener("click", deleteProduct);
    emptyCarButton.addEventListener("click", emptyCar);
    productsList.addEventListener("click", modalProduct);
    modalContainer.addEventListener("click", closeModal);
    document.addEventListener("DOMContentLoaded", () => {
        carProducts = JSON.parse(localStorage.getItem('car')) || [];
        carElementsHTML()
    })
}


function getProducts() {
    axios.get(baseUrl) 
    .then((response) => {
        const products = response.data
        printProducts(products)
    })
    .catch((error) => {
        console.log(error)
    })   
}
getProducts()

function printProducts(products) {
    let html = '';
    for (let product of products) {
        html += `
        <div class='products__element'>
           <img src='${product.image}' alt='product-img' class='products-img'>
           <div class='products__info'>
              <p class='products__name'> ${product.name} </p>
              <div class='products__div'>
                <p class='products__price'>USD ${product.price.toFixed(2)}</p>
              </div>
              <div class='products__car'>
                <button data-id='${product.id}' class='products__button add_car' >Añadir al carrito</button>
                <button data-id="${product.id}" data-description="${product.description}" class="products__button products__button--search products__details" data-quantity="${product.quantity}">
                  <i class="fa-solid fa-magnifying-glass"></i>
                </button>
              </div>
           </div>
        </div>
        `
    } 
    productsList.innerHTML = html
}

function addProduct(event) {
    if(event.target.classList.contains('add_car')) {
        const product = event.target.parentElement.parentElement.parentElement;
        carProductsElement(product);
    }
}

function carProductsElement(product) {
    const infoProduct = {
        id: product.querySelector('button').getAttribute('data-id'),
        image: product.querySelector('img').src,
        name: product.querySelector('p').textContent,
        price: product.querySelector('.products__div p').textContent,
        quantity: 1
    }


if (carProducts.some( product => product.id === infoProduct.id)) {
    const productIncrement = carProducts.map(product => {
        if (product.id === infoProduct.id ) {
            product.quantity++
            return product
        } else {
            return product
        }
    })
    carProducts = [ ...productIncrement ]
} else {
    carProducts = [ ...carProducts, infoProduct ]
} carElementsHTML();
}

function carElementsHTML() {
    let carHTML = '';
    for (let product of carProducts) {
        carHTML += `
        <div class="car__product">
            <div class="car__product__image">
              <img src="${product.image}">
            </div>
            <div class="car__product__description">
              <p>${product.name}</p>
              <p>Precio: ${product.price}</p>
              <p>Cantidad: ${product.quantity}</p>
              <div class="car__product__button">
                <i class="fa-solid fa-trash" data-id="${product.id}"></i>
            </div>
            </div>
        </div>
        <hr>
        `
    }
    carList.innerHTML = carHTML;
    productsStorage()

    
}

function productsStorage(){
    localStorage.setItem("car", JSON.stringify(carProducts))
}

function deleteProduct(event) {
    if( event.target.classList.contains('fa-solid') ){
        const productId = event.target.getAttribute('data-id')
        carProducts = carProducts.filter(product => product.id != productId)
        carElementsHTML()
    }
}

function emptyCar() {
    carProducts = [];
    carElementsHTML();
}

function modalProduct(event) {
    if(event.target.classList.contains("fa-magnifying-glass")){
        modalContainer.classList.add("show__modal")
        const product = event.target.parentElement.parentElement.parentElement.parentElement
        modalDetailsElement(product)
    }
}

function closeModal(event) {
    if(event.target.classList.contains("modal__icon")){
        modalContainer.classList.remove("show__modal")
    }
}

function modalDetailsElement(product) {
    const infoDatails = {
        id: product.querySelector('button').getAttribute('data-id'),
        image: product.querySelector('img').src,
        name: product.querySelector('p').textContent,
        price: product.querySelector('.products__div p').textContent,
        description: product.querySelector('.products__details').getAttribute('data-description'),
        stock: product.querySelector('.products__details').getAttribute('data-quantity')
        
    }
    modalDetails = [ ...modalDetails, infoDatails ]
    modalHTML()
}

function modalHTML() {

    let detailsHTML = ""
    for( let element of modalDetails ) {
        detailsHTML = `
        <div class="modal__info">
            <div class="modal__info--first">
                <h3>${element.name}</h3>
                <h2>$${element.price}</h2>
                <h4>Stock disponible: ${element.stock}</h4>
                <h4>Colores:</h4>
                <img src="${element.image}">
                <h4>Descripción:</h4>
                <p>${element.description}</p>
            </div>
            <div class="modal__info--second">
                <img src="${element.image}">
                <div></div>
            </div>
        </div>
    `
    }
    modalElement.innerHTML = detailsHTML
}

window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    const scrollPosition = window.scrollY;
  
    if (scrollPosition > 0) {
      navbar.classList.add('navbar-scrolled');
    } else {
      navbar.classList.remove('navbar-scrolled');
    }
  });
  

