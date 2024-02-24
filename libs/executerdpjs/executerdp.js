class ExecuteRDP {
  constructor(user, password, ip, port, mac, resolution) {
    this.user = user;
    this.password = password;
    this.ip = ip;
    this.port = port;
    this.mac = mac;
    this.resolution = resolution;
  }

  executeWol() {
    const wol = require("wake_on_lan");
    wol.wake(this.mac, (error) => {
      if (error) {
        console.log(error);
      }
    });
  }

  execute() {
    Swal.fire({
      title: "Conectando",
      text: "Por favor espere...",
      icon: "info",
      showConfirmButton: false,
    });
    this.executeWol();
    setTimeout(() => {
      Swal.fire({
        title: "Conectado",
        text: "Conexión establecida",
        icon: "success",
        showConfirmButton: false,
      });
      const { spawn } = require("child_process");
      const child = spawn("/opt/homebrew/bin/xfreerdp", [
        "/u:" + this.user,
        "/p:" + this.password,
        "/v:" + this.ip + ":" + this.port,
        this.resolution,
        "/sound",
        "/microphone",
        "/gfx",
        "/smart-sizing",
        "/clipboard",
        // "/multimon",
        // "/drive:home,/home/usuario",
        // "/usb:id,dev:0x1a86:0x7523",
      ]);
      child.on("close", (code) => {
        console.log(`child process exited with code ${code}`);
        Swal.fire({
          title: "Conexión terminada",
          text: "La conexión se ha cerrado",
          icon: "info",
          showConfirmButton: true,
          confirmButtonText: "De acuerdo, cerrar.",
        });
      });
      child.on("disconnect", (code) => {
        Swal.fire({
          title: "Conexión terminada",
          text: "La conexión se ha cerrado",
          icon: "info",
          showConfirmButton: true,
          confirmButtonText: "De acuerdo, cerrar.",
        });
        console.log(`child process disconnected with code ${code}`);
      });
    }, 2000);
  }
}

module.exports = ExecuteRDP;
