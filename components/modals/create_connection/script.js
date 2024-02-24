const { default: Swal } = require("sweetalert2");

(function scanIPsWeb() {
  Swal.fire({
    title: "Escaneando IPs de la red",
    text: "Por favor espere...",
    icon: "info",
    showConfirmButton: false,
    allowOutsideClick: false,
  });
  const { exec } = require("child_process");

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
      const select_ip = document.getElementById("ip");
      for (const ip of arrayIpsAndMac) {
        const option = document.createElement("option");
        option.value = ip.ip;
        option.text = ip.ip;
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
})();

function create_connection() {
  const Store = require("electron-store");
  const store = new Store();
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
    resolution
  };
  store.set("connections", connections);
  //   Cerrar ventana actual
  const { ipcRenderer } = require("electron");

  ipcRenderer.invoke("close-window");
}
