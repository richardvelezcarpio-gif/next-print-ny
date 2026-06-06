const params = new URLSearchParams(location.search);
const selection = {
  color: params.get("color") || "White", hex: /^#[0-9a-f]{6}$/i.test(params.get("hex") || "") ? params.get("hex") : "#f7f7f4",
  size: params.get("size") || "M", quantity: Math.max(1, Number(params.get("quantity")) || 1),
};
const unitPrice = ["2XL","3XL","4XL","5XL"].includes(selection.size) ? 18 : 14;
const total = unitPrice * selection.quantity;
const language = localStorage.getItem("preferredLanguage") || "en";
const canvas = document.querySelector("#shirtCanvas");
const ctx = canvas.getContext("2d");
const printArea = { x: 250, y: 245, width: 220, height: 220 };
let artwork = null;
let originalArtwork = null;
let artworkPosition = { x: 360, y: 355 };
let dragging = false;

const translations = {
  en: { kicker:"Online T-shirt designer",title:"Create your front design",intro:"Upload artwork or add text. Drag the design inside the 12 × 12 print area to preview the final shirt.",hint:"Drag the image or text to move it.",artwork:"Add artwork",choose:"Choose image",text:"Add text",placeholder:"Your text",color:"Color",size:"Size",scale:"Artwork size",center:"Center design",clear:"Clear design",approve:"Approve design and order" },
  es: { kicker:"Diseñador de camisetas en línea",title:"Crea tu diseño frontal",intro:"Sube una imagen o agrega texto. Mueve el diseño dentro del área de impresión de 12 × 12 para ver cómo quedará.",hint:"Arrastra la imagen o el texto para moverlo.",artwork:"Agregar imagen",choose:"Escoger imagen",text:"Agregar texto",placeholder:"Tu texto",color:"Color",size:"Tamaño",scale:"Tamaño de imagen",center:"Centrar diseño",clear:"Borrar diseño",approve:"Aprobar diseño y ordenar" },
};

renderLanguage(language);
document.querySelector("#shirtSummary").innerHTML = `<strong>Gildan G500</strong><span>${selection.color} · ${selection.size} · Qty ${selection.quantity}</span><b>$${total.toFixed(2)}</b>`;
draw();

document.querySelector("#designFile").addEventListener("change", async (event) => {
  const file = event.target.files?.[0]; if (!file) return;
  if (file.size > 4 * 1024 * 1024) return setStatus("The image must be under 4 MB.", true);
  originalArtwork = { name: file.name, content: await fileToBase64(file) };
  const image = new Image(); image.onload = () => { artwork = image; centerDesign(); draw(); }; image.src = URL.createObjectURL(file);
});
["designText","designTextColor","designTextSize","designScale"].forEach((id) => document.querySelector(`#${id}`).addEventListener("input", draw));
document.querySelector("#centerDesign").addEventListener("click", () => { centerDesign(); draw(); });
document.querySelector("#clearDesign").addEventListener("click", () => { artwork = null; originalArtwork = null; document.querySelector("#designText").value = ""; draw(); });
canvas.addEventListener("pointerdown", (event) => { dragging = true; moveDesign(event); });
canvas.addEventListener("pointermove", (event) => { if (dragging) moveDesign(event); });
window.addEventListener("pointerup", () => { dragging = false; });
document.querySelector("#continueOrder").addEventListener("click", continueOrder);
document.querySelectorAll("[data-designer-lang]").forEach((button) => button.addEventListener("click", () => {
  localStorage.setItem("preferredLanguage", button.dataset.designerLang);
  renderLanguage(button.dataset.designerLang);
}));

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle = "#eef5fb"; ctx.fillRect(0,0,canvas.width,canvas.height);
  drawShirt();
  ctx.save(); ctx.setLineDash([8,7]); ctx.lineWidth=2; ctx.strokeStyle="#15bde5"; ctx.strokeRect(printArea.x,printArea.y,printArea.width,printArea.height); ctx.restore();
  if (artwork) drawArtwork();
  drawText();
}
function drawShirt() {
  ctx.save(); ctx.fillStyle=selection.hex; ctx.strokeStyle="#c7d4e2"; ctx.lineWidth=3; ctx.beginPath();
  ctx.moveTo(235,130);ctx.lineTo(300,100);ctx.quadraticCurveTo(360,145,420,100);ctx.lineTo(485,130);ctx.lineTo(625,235);ctx.lineTo(555,345);ctx.lineTo(495,300);ctx.lineTo(520,730);ctx.lineTo(200,730);ctx.lineTo(225,300);ctx.lineTo(165,345);ctx.lineTo(95,235);ctx.closePath();ctx.fill();ctx.stroke();
  ctx.fillStyle="#d7e0e8";ctx.beginPath();ctx.ellipse(360,115,61,34,0,0,Math.PI);ctx.fill();ctx.restore();
}
function drawArtwork() {
  const scale=Number(document.querySelector("#designScale").value)/100; const max=printArea.width*scale;
  const ratio=Math.min(max/artwork.width,max/artwork.height); const w=artwork.width*ratio,h=artwork.height*ratio;
  ctx.drawImage(artwork,artworkPosition.x-w/2,artworkPosition.y-h/2,w,h);
}
function drawText() {
  const text=document.querySelector("#designText").value.trim(); if(!text)return;
  ctx.save();ctx.fillStyle=document.querySelector("#designTextColor").value;ctx.font=`900 ${document.querySelector("#designTextSize").value}px Arial`;ctx.textAlign="center";ctx.textBaseline="middle";
  const maxWidth=printArea.width-14;ctx.fillText(text,artworkPosition.x,artworkPosition.y,maxWidth);ctx.restore();
}
function moveDesign(event) {
  const rect=canvas.getBoundingClientRect(); const x=(event.clientX-rect.left)*(canvas.width/rect.width); const y=(event.clientY-rect.top)*(canvas.height/rect.height);
  artworkPosition.x=Math.min(printArea.x+printArea.width,Math.max(printArea.x,x)); artworkPosition.y=Math.min(printArea.y+printArea.height,Math.max(printArea.y,y)); draw();
}
function centerDesign(){artworkPosition={x:printArea.x+printArea.width/2,y:printArea.y+printArea.height/2};}
async function continueOrder() {
  draw(); const preview=canvas.toDataURL("image/png").split(",")[1];
  try { sessionStorage.setItem("nextPrintTshirtFiles",JSON.stringify([{name:"tshirt-design-preview.png",content:preview},...(originalArtwork?[originalArtwork]:[])])); } catch {}
  const text=document.querySelector("#designText").value.trim()||"None"; const details=[`Product: Gildan G500 T-Shirt`,`Color: ${selection.color}`,`Size: ${selection.size}`,`Quantity: ${selection.quantity}`,`Front print area: 12 x 12 inches`,`Custom text: ${text}`,`Price per shirt: $${unitPrice.toFixed(2)}`,`Suggested sale price: $${total.toFixed(2)}`].join("\n");
  const orderParams=new URLSearchParams({service:"Printing",product:`Gildan G500 T-Shirt (${selection.size})`,quantity:String(selection.quantity),price:`$${total.toFixed(2)}`,details});
  location.href=`order.html?${orderParams.toString()}`;
}
function setStatus(text,error=false){const node=document.querySelector("#designerStatus");node.textContent=text;node.classList.toggle("error",error);}
function fileToBase64(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result||"").split(",")[1]||"");reader.onerror=()=>reject(reader.error);reader.readAsDataURL(file);});}
function renderLanguage(lang) {
  const text=translations[lang]||translations.en;
  [["designerKicker","kicker"],["designerTitle","title"],["designerIntro","intro"],["canvasHint","hint"],["artworkTitle","artwork"],["designFileLabel","choose"],["textTitle","text"],["textColorLabel","color"],["textSizeLabel","size"],["scaleTitle","scale"],["centerDesign","center"],["clearDesign","clear"],["continueOrder","approve"]].forEach(([id,key])=>{const node=document.querySelector(`#${id}`);if(node)node.textContent=text[key]});
  document.querySelector("#designText").placeholder=text.placeholder;
}
