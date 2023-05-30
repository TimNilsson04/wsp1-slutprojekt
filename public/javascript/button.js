
window.addEventListener('load', (event) => {
    const addButton = document.querySelector('#add-button');

    let picture = localStorage.getItem('picture') || null;
    let name = localStorage.getItem('name') || null;
    let price = localStorage.getItem('price') || null;

    addButton.addEventListener('click', (event) => {
        event.preventDefault();
        picture = addButton.dataset.productpicture;
        localStorage.setItem('picture', picture);
    });

    addButton.addEventListener('click', (event) => {
        event.preventDefault();
        name = addButton.dataset.productname;
        localStorage.setItem('name', name);
    });

    addButton.addEventListener('click', (event) => {
        event.preventDefault();
        price = addButton.dataset.productprice;
        localStorage.setItem('price', price);
    });

});
