//Read jsonfile as a response of DB
let jsonResponse;
let selectedCategory;
fetch("./assets/products.json")
    .then(res => res.json())
    .then(data => {
        jsonResponse = data;
        document.dispatchEvent(new Event('dbLoaded', {bubbles: true}));
    });


const $categories = document.querySelector(".categories");
const $importantProducts = document.querySelector(".destacados-container");
const $products = document.querySelector(".products-container");
const $productDescription = document.querySelector("#modal");
const $categoryName = document.querySelector(".products>.title");
//When data is loaded
document.addEventListener("dbLoaded", () => {
    selectedCategory = jsonResponse.categories[0];
    console.log(selectedCategory);

    loadCategories(jsonResponse.categories);
    loadProducts(jsonResponse.products);

})

function loadProducts(products) {
    //Clear content
    $categoryName.innerText=selectedCategory.name;
    $importantProducts.innerHTML = "";
    $products.innerHTML = "";
    //Load important products
    products.forEach((product) => {
        if (product.important === true) {
            $importantProducts.innerHTML += `
                <li class="card product" onclick="onSelectProduct(this)">
                    <input type="hidden" name="id" value="${product.id}"/>
                    <img src="${product.imageUrl}" alt="imagen-de-producto" class="product-image"/>
                    <div>
                        <p class="product-name">${product.name}</p>
                        <div class="product-last-price price">
                            <p>${product.previousPrice}<span>${product.measure}</span></p>
                        </div>
                        <div class="product-price price">
                            <p>${product.price}<span>${product.measure}</span><img src="./assets/images/add-cart.svg" alt="add-to-cart" class="icon"/></p>
                        </div>
                    </div>
                </li>
            `;
        }
    });
    //Load products by category
    products.forEach((product) => {
        if (product.categoryId === selectedCategory.id) {
            $products.innerHTML += `
            <li class="card product" onclick="onSelectProduct(this)">
                <input type="hidden" name="id" value="${product.id}"/>
                <img src="${product.imageUrl}" alt="imagen-de-producto" class="product-image"/>
                <div>
                    <p class="product-name">${product.name}</p>
                    <div class="product-price price">
                        <p>${product.price}<span>${product.measure}</span></p>
                        <img src="./assets/images/add-cart.svg" alt="add-to-cart" class="icon"/>
                    </div>
                </div>
            </li>
        `;
        }
    })
}

function loadCategories(categories) {
    categories.forEach((categorie) => {
        $categories.innerHTML += `
            <li class="category-card card" OnClick="onSelectCategory(this)">
                <input type="hidden" name="id" value="${categorie.id}"/>
                <img src="${categorie.imageUrl}" class="image" alt="Categories">
                <p class="category-name">${categorie.name}</p>
            </li>
        `;
    })
}

function onSelectCategory(e) {
    const value = e.querySelector('[name="id"]').value;
    selectedCategory = jsonResponse.categories.find(x=>x.id===value);
    //Instead call again the DB assumes that it be loaded yet
    loadProducts(jsonResponse.products);

}

function onSelectProduct(e) {
    const value = e.querySelector('[name="id"]').value;
    const product = jsonResponse.products.find(x=>x.id===value);
    $productDescription.innerHTML = `
        <div class="close-icon icon" onclick="exitModal()">X</div>
        <div class="modal-content">
            <img src="${product.imageUrl}" alt="Product image">
            <div class="product-info">
                <h3>${product.name}</h3>
                <div class="description">
                    <h4>Description</h4>
                    <p>
                        Those are potatoes from French region, serve for all uses
                    </p>
                </div>
                <div class="ingredients">
                    <h4>Ingredients</h4>
                    <p>
                        Potatoes (100%)
                    </p>
                </div>
                <div class="price">
                    <h4>Price</h4>
                    <p>${product.price}<span>${product.measure}</span></p>
                </div>
    
                <input type="button" value="Add Cart">
            </div>
        </div>
    `;

    $productDescription.setAttribute("visible",'');
    document.body.setAttribute("hidden",'');

}

function exitModal() {
    //Clean modal
    $productDescription.innerHTML = "";
    //Hidde modal
    $productDescription.removeAttribute("visible");
    document.body.removeAttribute("hidden");
}