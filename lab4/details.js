// document.addEventListener('DOMContentLoaded', () => {
//     const shirtDetailsContainer = document.getElementById('shirt-details');
//     const selectedShirt = JSON.parse(localStorage.getItem('selectedShirt'));

//     if (selectedShirt) {
//         const shirtName = selectedShirt.name;
//         const shirtDescription = selectedShirt.description;
//         const shirtPrice = selectedShirt.price;
//         const shirtColors = selectedShirt.colors;

//         const defaultFrontImage = selectedShirt.default.front;
//         const defaultBackImage = selectedShirt.default.back;
//         const firstColor = Object.keys(shirtColors)[0];
//         const frontImage = shirtColors[firstColor]?.front || defaultFrontImage;
//         const backImage = shirtColors[firstColor]?.back || defaultBackImage;

//         let colorButtons = '';
//         Object.keys(shirtColors).forEach(color => {
//             colorButtons += `<button class="color-button" onclick="changeShirtImage('${shirtColors[color].front}', '${shirtColors[color].back}', '${color}')">${color}</button>`;
//         });

//         shirtDetailsContainer.innerHTML = `
//             <h2>${shirtName}</h2>
//             <img id="shirt-image" src="${frontImage}" alt="${shirtName} front image">
//             <p>${shirtDescription}</p>
//             <p>${shirtPrice}</p>
//             <div>
//                 <button id="front-button" onclick="showFrontImage()">Front</button>
//                 <button id="back-button" onclick="showBackImage()">Back</button>
//             </div>
//             <div>${colorButtons}</div>
//         `;
        
//         document.getElementById('shirt-image').dataset.front = frontImage;
//         document.getElementById('shirt-image').dataset.back = backImage;
//     }
// });

// function showFrontImage() {
//     const shirtImage = document.getElementById('shirt-image');
//     shirtImage.src = shirtImage.dataset.front;
// }

// function showBackImage() {
//     const shirtImage = document.getElementById('shirt-image');
//     shirtImage.src = shirtImage.dataset.back;
// }

// function changeShirtImage(frontImageSrc, backImageSrc, color) {
//     const shirtImage = document.getElementById('shirt-image');
//     shirtImage.dataset.front = frontImageSrc;
//     shirtImage.dataset.back = backImageSrc;
    
//     const currentView = shirtImage.src === shirtImage.dataset.back ? 'back' : 'front';
//     if (currentView === 'back') {
//         shirtImage.src = backImageSrc;
//     } else {
//         shirtImage.src = frontImageSrc;
//     }

//     document.getElementById('front-button').onclick = () => showFrontImage();
//     document.getElementById('back-button').onclick = () => showBackImage();
// }

document.addEventListener('DOMContentLoaded', () => {
    const shirtNameElem = document.getElementById('shirt-name');
    const shirtPriceElem = document.getElementById('shirt-price');
    const shirtDescriptionElem = document.getElementById('shirt-description');
    const shirtImageElem = document.getElementById('shirt-image');
    const colorButtonsContainer = document.querySelector('.color-buttons');

    const selectedShirt = JSON.parse(localStorage.getItem('selectedShirt'));

    if (selectedShirt) {
        const shirtName = selectedShirt.name;
        const shirtDescription = selectedShirt.description;
        const shirtPrice = selectedShirt.price;
        const shirtColors = selectedShirt.colors;

        const defaultFrontImage = selectedShirt.default.front;
        const defaultBackImage = selectedShirt.default.back;
        const firstColor = Object.keys(shirtColors)[0];
        const frontImage = shirtColors[firstColor]?.front || defaultFrontImage;
        const backImage = shirtColors[firstColor]?.back || defaultBackImage;

        shirtNameElem.textContent = shirtName;
        shirtPriceElem.textContent = `Price: ${shirtPrice}`;
        shirtDescriptionElem.textContent = shirtDescription;
        shirtImageElem.src = frontImage;

        Object.keys(shirtColors).forEach(color => {
            const button = document.createElement('button');
            button.className = 'color-button';
            button.style.backgroundColor = color;
            button.textContent = color;
            button.onclick = () => changeShirtImage(shirtColors[color].front, shirtColors[color].back, color);
            colorButtonsContainer.appendChild(button);
        });

        shirtImageElem.dataset.front = frontImage;
        shirtImageElem.dataset.back = backImage;
    }
});

function showFrontImage() {
    const shirtImage = document.getElementById('shirt-image');
    shirtImage.src = shirtImage.dataset.front;
}

function showBackImage() {
    const shirtImage = document.getElementById('shirt-image');
    shirtImage.src = shirtImage.dataset.back;
}

function changeShirtImage(frontImageSrc, backImageSrc, color) {
    const shirtImage = document.getElementById('shirt-image');
    shirtImage.dataset.front = frontImageSrc;
    shirtImage.dataset.back = backImageSrc;

    const currentView = shirtImage.src === shirtImage.dataset.back ? 'back' : 'front';
    if (currentView === 'back') {
        shirtImage.src = backImageSrc;
    } else {
        shirtImage.src = frontImageSrc;
    }

    document.querySelectorAll('.color-button').forEach(button => {
        if (button.textContent === color) {
            button.classList.add('selected');
        } else {
            button.classList.remove('selected');
        }
    });
}
