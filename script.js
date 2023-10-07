/////////////////////////////
/// DOM Manipulation      ///
/////////////////////////////

const bookshelf = document.querySelector(".container");
const btnNew = document.querySelector(".btnNew");
const btnCancel = document.querySelector(".btnCancel");
const btnSave = document.querySelector(".btnSave");
const sidebar = document.querySelector(".sidebar");
const container = document.querySelector(".container");

// Book properties
const title = document.querySelector("#txtTitle");
const author = document.querySelector("#txtAuthor");
const pages = document.querySelector("#txtPages");
const synopsis = document.querySelector("#txtSynopsis");
const read = document.querySelector("#read")

// Error displays
const errTitle = document.querySelector("#errTitle");
const errAuthor = document.querySelector("#errAuthor");
const errPages = document.querySelector("#errPages");
const errSynopsis = document.querySelector("#errSynopsis");

// To re-render
let bookShelfEntries = [];

let sidebarState = false;

[btnNew, btnCancel].forEach(x => x.addEventListener('click', (e) => {
    e.preventDefault();
    toggleSidebar();
}));

btnSave.addEventListener('click', (e) => {
    e.preventDefault();

    if(validateBookValues())
        saveBookData();
});

const toggleSidebar = () => {
    sidebarState = !sidebarState;
    if(!sidebarState){
        currentBook = null;
        isEditing = false;
        clearInputs();
    } 
    toggleClasses();
}

const toggleClasses = () => {
    sidebar.classList.toggle('hidden');
    sidebar.classList.toggle('visible');
    container.classList.toggle('non-interactable');
    btnNew.classList.toggle('non-interactable');
}

const loadInputs = (book) => {
    title.value = DOMPurify.sanitize(book.title);
    author.value = DOMPurify.sanitize(book.author);
    pages.value = DOMPurify.sanitize(book.pages)
    synopsis.value = DOMPurify.sanitize(book.synopsis)
    read.checked = book.read;
}

const clearInputs = () => {
    title.value = '';
    author.value = '';
    pages.value = '';
    synopsis.value = '';
    read.checked = false;

    [errTitle, errAuthor, errPages, errSynopsis]
            .forEach(x => x.classList.toggle("display-none", true));
}

/////////////////////////////
/// Book management logic ///
/////////////////////////////

function BookCard(id, element, txtTitle, txtAuthor, txtPages, txtSynopsis) {
    this.id = id,
    this.element = element,
    this.txtTitle = txtTitle;
    this.txtAuthor = txtAuthor;
    this.txtPages = txtPages;
    this.txtSynopsis = txtSynopsis
}

function Book(title, author, pages, read, synopsis) {
    this.id = Math.floor(Math.random() * 10000);
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.synopsis = synopsis;
}

let currentBook = null;
let isEditing = false;

let myLibrary = [
    new Book('Book of Air', 'Some Guy', 69, true, 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quaerat libero facilis architecto consectetur, et maxime fugiat pariatur, quibusdam sit animi.'),
    new Book('Book of Water', 'Some Guy', 69, true, 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quaerat libero facilis architecto consectetur, et maxime fugiat pariatur, quibusdam sit animi.'), 
    new Book('Book of Earth', 'Some Guy', 69, true, 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quaerat libero facilis architecto consectetur, et maxime fugiat pariatur, quibusdam sit animi.'),
    new Book('Book of Fire', 'Some Guy', 69, true, 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quaerat libero facilis architecto consectetur, et maxime fugiat pariatur, quibusdam sit animi.'), 
    new Book('Legend of Korra', 'Some Wamen', 96, false, 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quaerat libero facilis architecto consectetur, et maxime fugiat pariatur, quibusdam sit animi.'), 
    new Book('Netflix Reboot', 'Some Person', 1337, false, 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quaerat libero facilis architecto consectetur, et maxime fugiat pariatur, quibusdam sit animi.')
];

function validateBookValues() {
    let valid = true;

    if(title.value === "") {
        valid = false;
        errTitle.classList.remove("display-none");
    }
    else {
        errTitle.classList.add("display-none");
    }

    if(author.value === "") {
        valid = false;
        errAuthor.classList.remove("display-none");
    }
    else {
        errAuthor.classList.add("display-none");
    }

    if(pages.value === "" || pages.value === 0 || pages.undefined) {
        valid = false;
        errPages.classList.remove("display-none");
    }
    else {
        errPages.classList.add("display-none");
    }

    if(synopsis.value === "") {
        valid = false;
        errSynopsis.classList.remove("display-none");
    }
    else {
        errSynopsis.classList.add("display-none");
    }

    return valid;
}

function beginEditBook(id){
    currentBook = myLibrary.find(x => x.id === id);
    if(currentBook === null || currentBook === undefined)
        window.alert("Suspiciously enough, the book with the given ID was not found...");

    loadInputs(currentBook);

    toggleSidebar();
} 

function initialize(library){
    library.forEach(x => {
        createBookElement(x);
    });
}

function addBookToLibrary(book){
    myLibrary.push(book);
    createBookElement(book);
}

function saveBookData(){
    let book = new Book(
        DOMPurify.sanitize(title.value),
        DOMPurify.sanitize(author.value),
        DOMPurify.sanitize(pages.value),
        read.checked,
        DOMPurify.sanitize(synopsis.value)
    );

    if(isEditing){
        updateBook(book);
    }
    else {
        addBookToLibrary(book);
    }
    toggleSidebar();
}

function removeBookFromLibrary(id) {
    let filtered = myLibrary.filter(x => x.id !== id);
    myLibrary = filtered;
}

function updateBook(book) {
    currentBook.title = book.title;
    currentBook.author = book.author;
    currentBook.pages = book.pages;
    currentBook.synopsis = book.synopsis;
    currentBook.read = book.read;

    updateBookCard(currentBook);

    currentBook = null;
}

function deleteBook(id, element) {
    element.remove();
    myLibrary = myLibrary.filter(x => x.id !== id);
}

function updateBookCard(book) {
    let card = bookShelfEntries.find(x => x.id === book.id);

    if(card === null || card === undefined)
        alert("Again, suspiciously, can not find the card for given ID...");

    card.txtTitle.textContent = book.title;
    card.txtAuthor.textContent = book.author;
    card.txtPages.textContent = `Pages: ${book.pages}`;
    card.txtSynopsis.textContent = book.synopsis;
}

function createBookElement(book) {
    let title = book.title;
    let author = book.author;
    let pages = book.pages;
    let synopsis = book.synopsis;

    const bookDiv = document.createElement("div");
    bookDiv.classList.add("book");

    const controlsDiv = document.createElement("div");
    controlsDiv.classList.add("controls");
    const editDiv = document.createElement("div");
    editDiv.classList.add("edit");
    const deleteDiv = document.createElement("div");
    deleteDiv.classList.add("delete");
    const editImg = document.createElement("img")
    editImg.src = '/resources/edit.png';
    editImg.alt = 'Edit';
    editDiv.appendChild(editImg);
    const deleteImg = document.createElement("img")
    deleteImg.src = '/resources/delete.png';
    deleteImg.alt = 'Delete';
    deleteDiv.appendChild(deleteImg);

    editDiv.onclick = () => {
        isEditing = true;
        beginEditBook(book.id);
    }

    deleteDiv.onclick = () => {
        deleteBook(book.id, bookDiv);
    }

    controlsDiv.appendChild(editDiv);
    controlsDiv.appendChild(deleteDiv);
    
    const titleHeading = document.createElement("h2");
    titleHeading.textContent = title;
    
    const authorHeading = document.createElement("h3");
    authorHeading.textContent = author;
    
    const pagesHeading = document.createElement("h4");
    pagesHeading.textContent = `Pages: ${pages}`;
    
    const splitterDiv = document.createElement("div");
    splitterDiv.classList.add("splitter");
    
    const synopsisBold = document.createElement("b");
    synopsisBold.textContent = "Synopsis:";
    
    const synopsisParagraph = document.createElement("p");
    synopsisParagraph.textContent = synopsis;

    bookDiv.appendChild(controlsDiv);
    bookDiv.appendChild(titleHeading);
    bookDiv.appendChild(authorHeading);
    bookDiv.appendChild(pagesHeading);
    bookDiv.appendChild(splitterDiv);
    bookDiv.appendChild(synopsisBold);
    bookDiv.appendChild(synopsisParagraph);

    bookshelf.appendChild(bookDiv);

    bookShelfEntries.push(new BookCard(
        book.id,
        bookDiv,
        titleHeading,
        authorHeading,
        pagesHeading,
        synopsisParagraph
    ));
}

// Initial books creation
initialize(myLibrary);