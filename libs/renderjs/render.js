const fs = require("fs");
const path = require('path');
// Clase para renderizar index.html y script.js dentro de otro html
class Render {
  constructor(idToInsert) {
    this.idToInsert = idToInsert;
  }
  // Método para renderizar index.html y script.js dentro de otro html
  render(html, script, replaces = {}) {
    html = path.join(__dirname,  `../../${html}`);
    script = path.join(__dirname,  `../../${script}`);
    
    let index_html = fs.readFileSync(html, "utf8");

    for (const key in replaces) {
      if (Object.hasOwnProperty.call(replaces, key)) {
        const element = replaces[key];
        // Reemplazar las llaves coincidentes en todo el texto por los valores
        index_html = index_html.replace(new RegExp(`{${key}}`, "g"), element);
      }
    }

    let inde_js = fs.readFileSync(script, "utf8");

    // convertir index en html
    let indexContent = document.createElement("div");
    indexContent.innerHTML = index_html;
    // insertar el contenido de index.html dentro de otro html
    const toHtml = document.getElementById(this.idToInsert);
    toHtml.appendChild(indexContent);

    // convertir script en js
    let scriptContent = document.createElement("script");
    scriptContent.innerHTML = inde_js;
    // insertar el contenido de script.js dentro de otro html
    toHtml.appendChild(scriptContent);
  }
}

module.exports = Render;
