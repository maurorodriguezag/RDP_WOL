const { default: Swal } = require("sweetalert2");
const Store = require("electron-store");
const store = new Store();
const { ipcRenderer } = require("electron");
let old_connection_name = "";
ipcRenderer.on("connection_name", (event, name) => {
  old_connection_name = name;
});

(function scanIPsWeb() {
  Swal.fire({
    title: "Escaneando IPs de la red",
    text: "Por favor espere...",
    icon: "info",
    showConfirmButton: false,
    allowOutsideClick: false,
  });
  const { exec } = require("child_process");
  ipcRenderer.on("connection_name", (event, name) => {
    old_connection_name = name;
    exec("arp -a", (error, stdout, stderr) => {
      if (stdout) {
        const arrayIpsAndMac = [];

        const lines = stdout.split("\n");
        lines.forEach((line) => {
          let ip = line.split(" ")[1];
          let mac = line.split(" ")[3];

          // Validar que la ip no tenga parentesis
          if (ip) {
            ip = ip.replace("(", "").replace(")", "");
          }

          // Validar que la mac no tenga segmentos con un solo caracter
          if (mac) {
            let new_mac = "";
            const macSegments = mac.split(":");
            macSegments.forEach((segment) => {
              if (segment.length < 2) {
                new_mac += "0" + segment + ":";
              } else {
                new_mac += segment + ":";
              }
            });
            mac = new_mac.slice(0, -1);
          }

          if (
            ip &&
            mac &&
            !mac.includes("incomplete") &&
            mac !== "ff:ff:ff:ff:ff:ff"
          ) {
            arrayIpsAndMac.push({ ip, mac });
          }
        });
        Swal.close();
        let connections = store.get("connections");
        const connection = connections[old_connection_name];



        const select_ip = document.getElementById("ip");
        for (const ip of arrayIpsAndMac) {
          const option = document.createElement("option");
          option.value = ip.ip;
          option.text = ip.ip;
          // Seleccionar la ip del select
          if (connection && connection.ip === ip.ip) {
            option.selected = true;
            document.getElementById("mac").value = ip.mac;
          }
          select_ip.appendChild(option);
        }

        select_ip.addEventListener("change", (e) => {
          const mac = arrayIpsAndMac.find((ip) => ip.ip === e.target.value).mac;
          document.getElementById("mac").value = mac;
        });
        return;
      }
      if (error) {
        console.error(`exec error: ${error}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
    });
  });
})();

(function fillForm() {
  ipcRenderer.on("connection_name", (event, name) => {
    old_connection_name = name;
    let connections = store.get("connections");
    // se obtiene el valor connection_name enviado desde main.js win.webContents.send("connection_name", connection_name);
    const connection = connections[old_connection_name];
    document.getElementById("name").value = old_connection_name;
    document.getElementById("user").value = connection.user;
    document.getElementById("password").value = connection.password;
    // Seleccionar la ip del select
    const select_ip = document.getElementById("ip");
    for (let i = 0; i < select_ip.options.length; i++) {
      if (select_ip.options[i].value === connection.ip) {
        select_ip.selectedIndex = i;
        break;
      }
    }
    // Seleccionar la resolución del select
    const select_resolution = document.getElementById("resolution");
    for (let i = 0; i < select_resolution.options.length; i++) {
      if (select_resolution.options[i].value === connection.resolution) {
        select_resolution.selectedIndex = i;
        break;
      }
    }
    document.getElementById("port").value = connection.port;
    document.getElementById("mac").value = connection.mac;
  });
})();

function edit_connection() {
  let connections = store.get("connections");

  const name = document.getElementById("name").value;
  const user = document.getElementById("user").value;
  const password = document.getElementById("password").value;
  const ip = document.getElementById("ip").value;
  const port = document.getElementById("port").value;
  const mac = document.getElementById("mac").value;
  const resolution = document.getElementById("resolution").value;

  if (!connections) {
    connections = {};
  }

  connections[name] = {
    user,
    password,
    ip,
    port,
    mac,
    resolution,
  };
  if (old_connection_name !== name) {
    delete connections[old_connection_name];
  }
  store.set("connections", connections);
  //   Cerrar ventana actual
  const { ipcRenderer, webContents } = require("electron");
  ipcRenderer.invoke("close-window");
}
