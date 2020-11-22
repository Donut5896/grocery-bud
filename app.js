// ****** SELECT ITEMS **********
const alert = document.querySelector('.alert');
const form = document.querySelector('.grocery-form');
const grocery = document.getElementById('grocery');
const submitBtn = document.querySelector('.submit-btn');

const container = document.querySelector('.grocery-container');
const list = document.querySelector('.grocery-list');

const clearBtn = document.querySelector('.clear-btn');


// edit option
let editElement;
let editFlag = false;
let editID = "";

// ****** EVENT LISTENERS **********

//submit form
form.addEventListener('submit', addItem);
// clear items
clearBtn.addEventListener('click', clearItems)
// load items
window.addEventListener('DOMContentLoaded', setupItems);


// ****** FUNCTIONS **********


function addItem(e) {

    //prevent form to submit to browser
    e.preventDefault();
     //input
    const value = grocery.value;
    //to get unique id (cheating) in stringj
    const id=new Date().getTime().toString();
   
    
    
    //1.if user input is not equal to empty string and add don't edit 
    //then add item to the list

    // empty string is evaluated to falsy
    if(value && !editFlag){
        createListItem(id, value)
        //display alert
        displayAlert("item added to the list", "success");
        //display the list
        container.classList.add("show-container");
        // add to local storage
        addToLocalStorage(id, value);
        //set back to default
        setBackToDefault();
    }
    
    else if(value && editFlag){
        editElement.innerHTML = value;
        displayAlert('value changed', 'success');
        //edit local storage
        editLocalStorage(editID, value);
        setBackToDefault();
    }else{ //for no input
        displayAlert("please enter value", "danger");
    }


};

// display alert whem thers is no input
function displayAlert(text, action){
    alert.textContent = text;
    alert.classList.add(`alert-${action}`);

    //remove alert
    setTimeout(function() {
        alert.textContent = "";
        alert.classList.remove(`alert-${action}`);
    
    }, 1000)
};

// clear items
function clearItems(){
    //to select all items
    const items = document.querySelectorAll('.grocery-item');
    // check if there is atleast one item
    if(items.length > 0){
        items.forEach(function(item){
            list.removeChild(item);
        });
    }
    //remove clear item button
    container.classList.remove("show-container");
    //display alert
    displayAlert("empty list", "danger");
    setBackToDefault();
    // remove list from local storage
    localStorage.removeItem('list');
}


//delete function
function deleteItem(event){
    const element = event.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    list.removeChild(element);

    //to remove clear list botton if there is no item left
    if(list.children.length === 0){
        container.classList.remove("show-container");
    }
    displayAlert('item removed', 'danger');
    setBackToDefault();
    //remove item from local storage
    removeFromLocalStorage(id);
}

// edit function
function editItem(event){
    const element = event.currentTarget.parentElement.parentElement;
  //set edit item
  editElement = event.currentTarget.parentElement.
  previousElementSibling;
  //set form value, display input name on the box
  grocery.value = editElement.innerHTML;
  editFlag = true;
  editID = element.dataset.id;
  submitBtn.textContent = "edit";
}


//set back to default
function setBackToDefault(){
    grocery.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "submit";
};

// ****** LOCAL STORAGE **********
function addToLocalStorage(id, value){
    const grocery = {id, value };
    let items = getLocalStorage();
    
    items.push(grocery);
    localStorage.setItem("list", JSON.stringify(items));
    //console.log("added to local storage");
};


function removeFromLocalStorage(id){
    let items = getLocalStorage();
    //filter out the other id that dont match
    items = items.filter(function(item) {
        if(item.id !== id){
            return item
        }
    });
    //send to local storage
    localStorage.setItem("list", JSON.stringify(items));
}

//update edit item to local Storage 
function editLocalStorage(id, value){
    let items = getLocalStorage();
    items = items.map(function(item) {
        //if id matchs than return the item
        if(item.id === id){
            item.value = value;
        }
        return item;
    });
    localStorage.setItem("list", JSON.stringify(items));
}


function getLocalStorage(){
    return localStorage.getItem("list")?JSON.parse(localStorage.
        getItem('list')):[];
};


//local storage API (Aplication > Local Sorage)
        //set item
//localStorage.setItem('orange', JSON.stringify(["item1", "item2"]));
        // get item
//const oranges = JSON.parse(localStorage.getItem('orange'));
        //removeItem
//localStorage.removeItem('oranges');

// ****** SETUP ITEMS **********
function setupItems(){
    let items = getLocalStorage();
    if(items.length > 0 ){
        items.forEach(function(item) {
            createListItem(item.id, item.value)
        })
        container.classList.add('show-container');
    }
}

function createListItem(id,value){
     //create grocery-item class dynamically
     const element = document.createElement('article');
     //add class
     element.classList.add('grocery-item');
     //add id
     const attr = document.createAttribute('data-id');
     attr.value = id;
     //add to element
     element.setAttributeNode(attr);
     element.innerHTML = ` 
     <p class="title">${value}</p>
     <div class="btn-container">
     <button type="button" class="edit-btn">
       <i class="fas fa-edit"></i>
     </button>
     <button type="button" class="delete-btn">
       <i class="fas fa-trash"></i>
     </button> 
        </div> `;

     // edit buttton (beacsue there is no edit button from the start they are 
     // not in the index html, we add them dynamically)
     const deleteBtn = element.querySelector('.delete-btn');
     const editBtn = element.querySelector('.edit-btn');
     deleteBtn.addEventListener('click', deleteItem);
     editBtn.addEventListener('click', editItem);
    




     //append child (add text of Element to the list )
     list.appendChild(element);
}