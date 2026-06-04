const printingProducts = [
  { name: "Business Cards", prices: [["100", "$35.00"], ["250", "$55.00"], ["500", "$65.00"], ["1000", "$119.00"], ["2500", "$180.00"], ["5000", "$220.00"], ["10000", "$370.00"]] },
  { name: "Flyers 4x6", prices: [["100", "$49.00"], ["250", "$79.00"], ["500", "$99.00"], ["1000", "$150.00"], ["2500", "$249.00"], ["5000", "$349.00"], ["10000", "$420.00"]] },
  { name: "Flyers 5x7", prices: [["100", "$95.00"], ["250", "$140.00"], ["500", "$180.00"], ["1000", "$240.00"], ["2500", "$390.00"], ["5000", "$450.00"], ["10000", "$650.00"]] },
  { name: "Stickers round 2\"", prices: [["100", "$70.00"], ["250", "$116.00"], ["500", "$130.00"], ["1000", "$190.00"], ["2500", "$280.00"], ["5000", "$380.00"], ["10000", "$580.00"]] },
  { name: "Stickers round 2.5\"", prices: [["100", "$100.00"], ["250", "$180.00"], ["500", "$190.00"], ["1000", "$220.00"], ["2500", "$350.00"], ["5000", "$450.00"], ["10000", "$720.00"]] },
  { name: "Stickers 2x3.5", prices: [["100", "$75.00"], ["250", "$110.00"], ["500", "$140.00"], ["1000", "$160.00"], ["2500", "$190.00"], ["5000", "$240.00"], ["10000", "$420.00"]] },
  { name: "Stickers 2x2", prices: [["100", "$65.00"], ["250", "$95.00"], ["500", "$135.00"], ["1000", "$155.00"], ["2500", "$185.00"], ["5000", "$230.00"], ["10000", "$330.00"]] },
  { name: "Stickers 4x4", prices: [["100", "$110.00"], ["250", "$170.00"], ["500", "$190.00"], ["1000", "$220.00"], ["2500", "$350.00"], ["5000", "$470.00"], ["10000", "$750.00"]] },
  { name: "Menus 8.5x11", prices: [["100", "$160.00"], ["250", "$200.00"], ["500", "$280.00"], ["1000", "$370.00"], ["2500", "$550.00"], ["5000", "$596.00"], ["10000", "$890.00"]] },
  { name: "Menus 11x17", prices: [["100", "$315.00"], ["250", "$450.00"], ["500", "$620.00"], ["1000", "$780.00"], ["2500", "$900.00"], ["5000", "$1,120.00"], ["10000", "$1,558.00"]] },
  { name: "Banner 2x4", prices: [["1", "$88.00"]] },
  { name: "Banner 2x6", prices: [["1", "$120.00"]] },
  { name: "Banner 3x6", prices: [["1", "$180.00"]] },
  { name: "Banner 2x8", prices: [["1", "$221.33"]] },
  { name: "Banner 2x10", prices: [["1", "$267.33"]] },
  { name: "Door Hangers 4x11", prices: [["100", "$202.00"], ["250", "$236.00"], ["500", "$277.00"], ["1000", "$310.00"], ["2500", "$483.00"], ["5000", "$560.00"], ["10000", "$1,050.00"]] },
  { name: "Door Hangers 3.5x8.5", prices: [["100", "$160.00"], ["250", "$197.00"], ["500", "$219.00"], ["1000", "$240.00"], ["2500", "$367.00"], ["5000", "$485.00"], ["10000", "$775.00"]] },
];

const productList = document.querySelector("#productList");
const productTitle = document.querySelector("#productTitle");
const productKicker = document.querySelector("#productKicker");
const productPriceRows = document.querySelector("#productPriceRows");
const productQuantity = document.querySelector("#productQuantity");
const productPrice = document.querySelector("#productPrice");
const productOrderLink = document.querySelector("#productOrderLink");

let selectedProduct = printingProducts[0];
let selectedPrice = selectedProduct.prices[0];

renderProductList();
renderProduct(selectedProduct.name);

productQuantity?.addEventListener("change", () => {
  selectedPrice = selectedProduct.prices.find((item) => item[0] === productQuantity.value) || selectedProduct.prices[0];
  updateSelectedPrice();
});

function renderProductList() {
  if (!productList) return;

  productList.innerHTML = printingProducts
    .map(
      (product, index) => `
        <button class="${index === 0 ? "active" : ""}" type="button" data-product="${escapeAttribute(product.name)}">
          ${escapeHtml(product.name)}
        </button>
      `
    )
    .join("");

  productList.addEventListener("click", (event) => {
    const button = event.target.closest("button[data-product]");
    if (!button) return;
    renderProduct(button.dataset.product);
  });
}

function renderProduct(productName) {
  selectedProduct = printingProducts.find((product) => product.name === productName) || printingProducts[0];
  selectedPrice = selectedProduct.prices[0];

  productList?.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("active", button.dataset.product === selectedProduct.name);
  });

  if (productTitle) productTitle.textContent = selectedProduct.name;
  if (productKicker) productKicker.textContent = `${selectedProduct.prices.length} price options`;
  if (productQuantity) {
    productQuantity.innerHTML = selectedProduct.prices
      .map(([quantity]) => `<option value="${escapeAttribute(quantity)}">${escapeHtml(quantity)}</option>`)
      .join("");
  }
  if (productPriceRows) {
    productPriceRows.innerHTML = selectedProduct.prices
      .map(
        ([quantity, price]) => `
          <tr>
            <td>${escapeHtml(quantity)}</td>
            <td>${escapeHtml(price)}</td>
          </tr>
        `
      )
      .join("");
  }

  updateSelectedPrice();
}

function updateSelectedPrice() {
  if (productPrice) productPrice.textContent = selectedPrice[1];
  if (productOrderLink) {
    const details = `Product: ${selectedProduct.name}\nQuantity: ${selectedPrice[0]}\nSuggested sale price: ${selectedPrice[1]}`;
    const params = new URLSearchParams({
      service: "Printing",
      product: selectedProduct.name,
      quantity: selectedPrice[0],
      price: selectedPrice[1],
      details,
    });
    productOrderLink.href = `order.html?${params.toString()}`;
  }
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replace(/`/g, "&#096;");
}
