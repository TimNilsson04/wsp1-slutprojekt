
window.addEventListener('load', (event) => {

    let name = localStorage.getItem('name') || null;
    let price = localStorage.getItem('price') || null;
    let picture = localStorage.getItem('picture') || null;

    const nameElement = document.querySelector('#name');
    nameElement.textContent = name;

    const priceElement = document.querySelector('#price');
    priceElement.textContent = price;

    const pictureElement = document.querySelector('#picture');
    pictureElement.textContent = picture;

    

});