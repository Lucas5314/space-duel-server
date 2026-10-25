const wardrobe = {
  Camisetas: [
    { name: "Camiseta fuego", color: "#ed6d45", meta: "Rara · Tormenta" },
    { name: "Camiseta neón", color: "#b7ef57", meta: "Épica · Neón" },
    { name: "Sudadera violeta", color: "#9368dc", meta: "Rara · Urbana" },
    { name: "Chaqueta hielo", color: "#79c8e9", meta: "Épica · Ártica" },
    { name: "Camiseta clásica", color: "#e6e5dc", meta: "Común · Básica" },
    { name: "Jersey ganador", color: "#e55473", meta: "Legendaria · Liga" }
  ],
  Pantalones: [
    { name: "Pantalón azul", color: "#586fd0", meta: "Rara · Tormenta" },
    { name: "Cargo oscuro", color: "#535a50", meta: "Épica · Urbana" },
    { name: "Pantalón neón", color: "#a8d848", meta: "Rara · Neón" },
    { name: "Vaqueros claros", color: "#76a8d2", meta: "Común · Básica" },
    { name: "Pantalón magma", color: "#df5a3f", meta: "Épica · Fuego" },
    { name: "Pantalón sombra", color: "#383b47", meta: "Legendaria · Liga" }
  ],
  Calzado: [
    { name: "Zapatillas clásicas", color: "#e5e4dd", meta: "Común · Básica" },
    { name: "Botas magma", color: "#ed7045", meta: "Épica · Fuego" },
    { name: "Runner neón", color: "#b7ef57", meta: "Rara · Neón" },
    { name: "Botas tácticas", color: "#555c51", meta: "Rara · Urbana" },
    { name: "Zapatillas hielo", color: "#7ec8e9", meta: "Épica · Ártica" },
    { name: "Botas campeón", color: "#d6ae54", meta: "Legendaria · Liga" }
  ],
  Accesorios: [
    { name: "Gorra lima", color: "#c7f36b", meta: "Rara · Neón" },
    { name: "Aro dorado", color: "#e1bc62", meta: "Épica · Oro" },
    { name: "Visor violeta", color: "#aa71ea", meta: "Rara · Urbana" },
    { name: "Halo hielo", color: "#85d9ee", meta: "Legendaria · Ártica" },
    { name: "Gafas rojas", color: "#ed6464", meta: "Épica · Fuego" },
    { name: "Amuleto azul", color: "#5d9bea", meta: "Rara · Tormenta" }
  ]
};

let category = "Camisetas";
const selections = {
  Camisetas: 0,
  Pantalones: 0,
  Calzado: 0,
  Accesorios: -1
};

const categories = document.querySelector("#categories");
const items = document.querySelector("#items");

function render() {
  categories.innerHTML = Object.keys(wardrobe).map(name =>
    `<button class="cat ${name === category ? "active" : ""}" data-cat="${name}">${name}</button>`
  ).join("");

  document.querySelector("#sectionTitle").textContent = category;
  document.querySelector("#count").textContent =
    `${wardrobe[category].length} artículos`;

  items.innerHTML = wardrobe[category].map((item, index) => {
    const type = category === "Camisetas" ? "shirt"
      : category === "Pantalones" ? "pants"
      : category === "Calzado" ? "shoes"
      : "accessories";

    return `
      <button class="item ${selections[category] === index ? "selected" : ""}"
              data-index="${index}">
        <span class="check">✓</span>
        <span class="thumb">
          <span class="mini ${type}" style="--c:${item.color}"></span>
        </span>
        <span class="item-name">${item.name}</span>
        <span class="item-meta">${item.meta}</span>
      </button>`;
  }).join("");

  document.querySelector("#equipped").textContent =
    Object.keys(wardrobe)
      .filter(name => selections[name] >= 0)
      .map(name => wardrobe[name][selections[name]].name)
      .join(" · ") || "Nada equipado";

  const shirt = wardrobe.Camisetas[selections.Camisetas];
  const pants = wardrobe.Pantalones[selections.Pantalones];

  document.querySelector("#avatarShirt").setAttribute("fill", shirt.color);
  document.querySelector("#shirtSide").setAttribute("fill", shirt.color);
  document.querySelector("#shirtBack").setAttribute("fill", shirt.color);
  document.querySelector("#avatarPants").setAttribute("fill", pants.color);
  document.querySelector("#pantsSide").setAttribute("fill", pants.color);
  document.querySelector("#pantsBack").setAttribute("fill", pants.color);

  document.querySelector("#capLayer").style.display =
    selections.Accesorios === 0 ? "" : "none";

  document.querySelector("#lookTag").textContent =
    `LOOK ${String(1 + Object.values(selections).filter(value => value >= 0).length).padStart(2, "0")}`;
}

const views = {
  front: document.querySelector("#frontView"),
  side: document.querySelector("#sideView"),
  back: document.querySelector("#backView")
};

document.querySelector(".turn-controls").addEventListener("click", event => {
  const button = event.target.closest("[data-view]");
  if (!button) return;

  Object.entries(views).forEach(([name, element]) => {
    element.style.display = name === button.dataset.view ? "inline" : "none";
  });

  document.querySelectorAll(".turn").forEach(turn => {
    turn.classList.toggle("active", turn === button);
  });
});

categories.addEventListener("click", event => {
  const button = event.target.closest("[data-cat]");
  if (!button) return;
  category = button.dataset.cat;
  render();
});

items.addEventListener("click", event => {
  const button = event.target.closest("[data-index]");
  if (!button) return;
  selections[category] = Number(button.dataset.index);
  render();
});

document.querySelector("#reset").addEventListener("click", () => {
  selections.Camisetas = 0;
  selections.Pantalones = 0;
  selections.Calzado = 0;
  selections.Accesorios = -1;
  render();
  notify("Look reiniciado");
});

document.querySelector("#save").addEventListener("click", () => {
  notify("¡Look guardado!");
});

function notify(message) {
  const toast = document.querySelector("#toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

render();