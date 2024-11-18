function generateShirtContent() {
  const container = document.getElementById("shirts-container");
  shirts.forEach((shirt) => {
    const shirtDiv = document.createElement("div");
    shirtDiv.className = "shirt";

    const shirtName = shirt.name || "Unnamed Shirt";
    const colorCount = Object.keys(shirt.colors).length;
    const shirtDescription = shirt.description || "No description available.";
    const shirtPrice = shirt.price || "Price not available";

    const defaultImage = shirt.default.front;
    const firstColor = Object.keys(shirt.colors)[0];
    const shirtImage = shirt.colors[firstColor]?.front || defaultImage;

    shirtDiv.innerHTML = `
                <h2>${shirtName}</h2>
                <img src="${shirtImage}" alt="${shirtName} front image">
                <p class="shirt-description">${colorCount} colors available</p>
                <p class="shirt-price">${shirtPrice}</p>
                <div class="button-container">
                    <button class="shirt-button" onclick="showQuickView('${shirtName}', '${shirtImage}', '${shirtDescription}', '${shirtPrice}')">Quick View</button>
                    <button class="shirt-button" onclick="seePage('${shirtName}')">See Page</button>
                </div>
            `;

    container.appendChild(shirtDiv);
  });
}

function showQuickView(name, image, description, price) {
  document.getElementById("quick-view-title").textContent = name;
  document.getElementById("quick-view-image").src = image;
  document.getElementById("quick-view-description").textContent = description;
  document.getElementById("quick-view-price").textContent = price;
  document.getElementById("quick-view").style.display = "block";
  document.getElementById("overlay").style.display = "block";
}

function closeQuickView() {
  document.getElementById("quick-view").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}

function seePage(shirtName) {
  const selectedShirt = shirts.find((shirt) => shirt.name === shirtName);
  if (selectedShirt) {
    localStorage.setItem("selectedShirt", JSON.stringify(selectedShirt));
    window.location.href = "details.html";
  }
}

document.addEventListener("DOMContentLoaded", generateShirtContent);
