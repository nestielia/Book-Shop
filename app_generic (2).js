import { consts } from "./consts.js";
import data from "./books.json" assert {type: "json"};
const mainbody = document.querySelector('body');
mainbody.appendChild(buildDOM());
var cart = [];

/* DOM Creation  */
function buildDOM(){
    const dom = makeFrag();
    dom.appendChild(buildNavbar());
    dom.appendChild(buildHeader());
    dom.appendChild(buildBooks());
    return dom;
}

function buildNavbar(){
    const fragment = makeFrag();

    fragment.appendChild(makeElmntWithID("nav","navbar"))
        .appendChild(makeElmntWithAttrs("img", {src:"images/bars-svgrepo-com.svg"}, "bars_icon"));

    fragment.getElementById("navbar")
        .appendChild(makeElmntWithAttrs("img", {src:"images/shopping-cart-svgrepo-com.svg"}, "cart_icon"));

    fragment.getElementById("cart_icon").addEventListener("click", function(){
        toggleCartVisibility();
    })

    fragment.getElementById("navbar")
        .appendChild(makeElmntWithIDAndClass("div", "cart_content", "show_cart_content"))
            .appendChild(makeElmntWithID("h2"))
             .appendChild(document.createTextNode("Your Cart"));

    //create the cart container contents
    fragment.getElementById("cart_content")
    .appendChild(makeElmntWithIDAndClass("div", "cart_container", "show_container_content"))

    fragment.getElementById("cart_content")
    .appendChild(makeElmntWithIDAndClass("button", "totalButton", "totalButton"))
    .appendChild(document.createTextNode("Proceed to checkout"));

    fragment.getElementById("totalButton").addEventListener("click", function(){
        newLocation();
    })


    const cartSnippet = createCartListing(false);
    fragment.getElementById("cart_container")
        .replaceChildren(cartSnippet);

    return fragment;
}

function buildHeader(){
    const fragment = document.createDocumentFragment()

    fragment.appendChild(makeElmntWithID("header","hero"))
        .appendChild(makeElmntWithID("div","banner"))
            .appendChild(makeElmntWithID("h1","bannerTitle"))
                .appendChild(document.createTextNode(consts.HEADER_TEXT));

    fragment.getElementById("banner")
    .appendChild(makeElmntWithID("button","bannerBtn"))
        .appendChild(document.createTextNode(consts.SHOP_BUTTON));

    fragment.getElementById("bannerBtn").addEventListener("click", function () {
        toBooks();
    })

    return fragment;
}

function buildBooks(){
    const fragment = makeFrag();

    fragment.appendChild(makeElmntWithID("section","books"))
        .appendChild(makeElmntWithID("div","sectionTitle"))
            .appendChild(makeElmnt("h2"))
                .appendChild(document.createTextNode(consts.SECTION_TEXT));

    fragment.getElementById("books")
    .appendChild(makeElmntWithID("div","booksCenter"))
        .appendChild(generateBooksListing());

    return fragment;
}

/* Booklistings Sections */
function generateBooksListing(){
    let bookCounter=0;
    const listingsFragment = document.createDocumentFragment();
    for (let book of data){
        listingsFragment.appendChild(createBookElements(book, ++bookCounter));
    }
    return listingsFragment;
}


function createBookElements(bookDetail, bookCounter){
    const bookFragment = makeFrag();

    bookFragment.appendChild(makeElmntWithIDAndClass("article", "book"+bookCounter, "articleCard"))
        .appendChild(makeElmntWithAttrs("img", {src:bookDetail["imageLink"], class:"bookImage"}, "bookImage"+bookCounter));

    bookFragment.getElementById("book"+bookCounter)
    .appendChild(makeElmntWithIDAndClass("div", "bookDetail"+bookCounter, "bookInfo"))
        .appendChild(makeElmntWithID("h3", "bookTitle"))
            .appendChild(document.createTextNode(bookDetail["title"]))

    bookFragment.getElementById("bookDetail"+bookCounter)
    .appendChild(makeElmntWithID("h4", "bookAuthor"))
        .appendChild(document.createTextNode(bookDetail["author"]))

    bookFragment.getElementById("bookDetail"+bookCounter)
    .appendChild(makeElmntWithID("p", "bookPrice"))
        .appendChild(document.createTextNode(`Price: €${bookDetail["price"]}`))

    bookFragment.getElementById("bookDetail"+bookCounter)
    .appendChild(makeElmntWithIDAndClass("button", "moreButton"+bookCounter,"showDescription"))
        .appendChild(document.createTextNode("Show more..."));

    bookFragment.getElementById("moreButton"+bookCounter).addEventListener("click", function (){
        toggleDetailVisibility("descriptionContainer"+bookCounter);
    });

    bookFragment.getElementById("book"+bookCounter)
    .appendChild(makeElmntWithIDAndClass("div","descriptionContainer"+bookCounter, "descrContainer"))
        .appendChild(makeElmntWithIDAndClass("p", "bookDescription", "bookDescr"))
         .appendChild(document.createTextNode(bookDetail["description"]))

         bookFragment.getElementById("bookDescription")
    .appendChild(makeElmntWithIDAndClass("button", "closeBtn"+bookCounter, "closeDescription"))
    .appendChild(document.createTextNode("Close"));

    bookFragment.getElementById("closeBtn"+bookCounter).addEventListener("click", function (){
        toggleDetailVisibility("descriptionContainer"+bookCounter);
        });

    bookFragment.getElementById("bookDetail"+bookCounter)
    .appendChild(makeElmntWithIDAndClass("button", "cartButton"+bookCounter, "cartButton"))
        .appendChild(document.createTextNode("Add to cart"))

    bookFragment.getElementById("cartButton"+bookCounter).addEventListener("click", function (){
        addOrRemoveCartItem(true,bookCounter, bookDetail["title"], bookDetail["author"], bookDetail["price"],bookDetail["imageLink"]);
    });

    return bookFragment;
}



/** ---- CART FUNCTIONS ----- */

function toggleCartVisibility(){
    const  carContentsDiv =  document.querySelector(".show_cart_content")
    if (carContentsDiv.style.visibility == '')
        carContentsDiv.style.visibility ='hidden'
    if ((carContentsDiv.style.visibility !== 'hidden')) {
        carContentsDiv.style.visibility = 'hidden';
    }else {
        carContentsDiv.style.visibility = 'visible';
    }
}

function toggleDetailVisibility(bookId) {
     const  bookDetailDiv =  document.getElementById(bookId);
    if (bookDetailDiv.style.display === "none") {
        bookDetailDiv.style.display = "flex";
      } else {
        bookDetailDiv.style.display = "none";
      }
}

function newLocation() {
    document.location.href="delivery/delivery.html";
}

function toBooks() {
    document.location.href = "#books";
}


function addOrRemoveCartItem(isAdd, id, title, author, price, src){

    for (let i = 0; i < cart.length; i++){
        if (cart[i].id === id){
            if (isAdd){
                cart[i].quantity +=1;
                updateQuantAndPrice(cart[i].id, i);
                return;
            }else{
                cart[i].quantity -=1;
                updateQuantAndPrice(cart[i].id, i);
                if (cart[i].quantity == 0){
                    cart.splice(i,1);
                    createCartListing(isAdd);
                }else{
                    return;
                }
            }
        }
    }
    if (isAdd){
        const bookCartItemDetail = {id:id,source:src, title:title, author:author, price:price, quantity:1}
        cart.push(bookCartItemDetail);
        createCartListing(isAdd);
    }
    return;
}

function updateQuantAndPrice(bookId,cartCounter){
    const cartFragment = document.getElementById("quantity_"+bookId);
    cartFragment.firstElementChild.innerHTML = "Quantity:  "+cart[cartCounter].quantity;
    document.getElementById("cart_total_price").innerHTML="Total: €" + calculateTotalPrice();
}

function calculateTotalPrice(){
    let totalPrice = 0;
    for (let i = 0; i < cart.length; i++){
        totalPrice += (cart[i].price * cart[i].quantity)
    }
    return totalPrice;
}


/**
 * Returns a document fragment of cart items (or empty div)
 * @param {*} isAdd 
 * @returns 
 */
function createCartListing(isAdd){
    const fragment = document.createDocumentFragment();
    const cartFragment = document.getElementById("cart_container");

    if ((cart == undefined) || (cart.length == 0)){
        if (isAdd !== true){
        //if it is an empty cart then print an "empty" div
        const appendage = fragment.appendChild(makeElmntWithIDAndClass("div", "emptyDiv", "emptyDiv"));
        appendage.appendChild(document.createTextNode("Your cart is empty"));
        if (cartFragment === null){ // cartFragment will be null when the document loads the first time - so just reurn the new document
            return appendage;
            }
        }
    }
    // rebuild the cart contents
    for (let item of cart){
       fragment.appendChild(createCartItem(item));
    }
     fragment.appendChild(makeElmntWithID("div", "cart_total_price"))
         .appendChild(document.createTextNode("Total: €" + calculateTotalPrice()));
    // replace all the existing children of cart_container with the fragment constructed above
    cartFragment.replaceChildren(fragment);
    return;
}   



function createCartItem(cartItem){
    const fragment = document.createDocumentFragment();

    fragment.appendChild(makeElmntWithIDAndClass("div","added_book"+cartItem.id,"added_book"))
        .appendChild(makeElmntWithID("div","cart_book_image"))
            .appendChild(makeElmntWithAttrs("img", {src:cartItem.source}));

    fragment.getElementById("added_book"+cartItem.id)
    .appendChild(makeElmntWithID("div", "cart_book_heading"))
        .appendChild(makeElmnt("h3"))
        .appendChild(document.createTextNode(cartItem.title));

    const headingDiv = fragment.getElementById("cart_book_heading")
    
    headingDiv
    .appendChild(makeElmnt("h4"))
        .appendChild(document.createTextNode(cartItem.author));

    headingDiv
    .appendChild(makeElmntWithID("span","quantity_"+cartItem.id))
        .appendChild(makeElmnt("h4"))
            .appendChild(document.createTextNode("Quantity:  "+cartItem.quantity));

    headingDiv
    .appendChild(makeElmnt("h4"))
        .appendChild(document.createTextNode("€ "+cartItem.price));


    fragment.getElementById("cart_book_heading")
    .appendChild(makeElmntWithID("button","cart_remove_btn"))
        .appendChild(document.createTextNode("Remove"));

    fragment.getElementById("cart_remove_btn").addEventListener("click", function(){
        addOrRemoveCartItem(false, cartItem.id); 
    })

    return fragment;    





}


/** ---- END CART FUNCTIONS ---- */


/* Helper functions  */

/**
 * Create a simple element with no attributes
 * @param {*} elementType type of the element to be created
 * @returns
 */
 function makeElmnt(elementType){
    return document.createElement(elementType);
}

/**
 * Create an element with an ID
 * @param {*} elementType type of the element to be created
 * @param {*} elementID ID of the element to be created
 * @returns
 */
function makeElmntWithID(elementType, elementID){
    //const theElement = createElement(elementType);
    return setIDAndClass(makeElmnt(elementType),elementID);
}

/**
 * Create an element with an ID and class
 * @param {*} elementType type of the element to be created
 * @param {*} elementID ID of the element to be created
 *  * @param {*} elementClass Class to be set of the specifide element
 * @returns
 */
 function makeElmntWithIDAndClass(elementType, elementID,elementClass){
    //const theElement = createElement(elementType);
    return setIDAndClass(makeElmnt(elementType),elementID,elementClass);
}

/**
 * Create an element with an ID and class
 * @param {*} elementType type of the element to be created
 * @param {*} elementClass Class to be set of the specifide element
 * @returns
 */
 function makeElmntWithClass(elementType, elementClass){
    return setClass(makeElmnt(elementType),elementClass);
}


function setIDAndClass(theElement, elementID, elementClass){
    if (elementID !== undefined) theElement.id = elementID;
    if (elementClass !== undefined) setClass(theElement,elementClass);
    return theElement;
}

function setClass(theElement,  elementClass){
    if (elementClass !== undefined) theElement.className = elementClass;
    return theElement;
}

/**
 * Creates an HTML element with specified attributes
 * @param {*} elementType  type of the element to be created
 * @param {Object[]} attributes list of 1 or more attributes to add to the element in the format {attr1:"attrName", attr2:"AttrName"}
 * @param {*} elementID optional id parameter to set an id on the element. This will be overridden if an ID is specified as part of the attributes paramtere
 * @returns
 */
function makeElmntWithAttrs(elementType,attributes, elementID){
    const theElement = setIDAndClass(makeElmnt(elementType),elementID);
    if (attributes !== undefined) setAttributes(theElement,attributes);
    return theElement;
    }

/**
 * Adds a specfied list of attributes to an existing HTMLElement
 * @param {HTMLElement} theElement
 * @param {Object[]} attributes list of 1 or more attributes to add to the element in the format {attr1:"attrName", attr2:"AttrName"}
 * @returns
 */
function setAttributes(theElement,attributes){
    if (attributes !== undefined){
        for (let attr in attributes){
           theElement.setAttribute(attr, attributes[attr])
        }
    }
    return theElement;
}




function checkArgs(args, length){
    if (args.length !== length)
        throw new Error ("Wrong number of arguments: Expected " + length + " but received "+ args.length);
}

function makeFrag(){
    return document.createDocumentFragment();
}





