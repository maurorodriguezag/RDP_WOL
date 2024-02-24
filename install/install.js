const { exec } = require("child_process");

// Crea clase de instalacion de freeRDP y Xquartz en macOS con sweetalert2
class InstallDependencies {
  constructor() {
    this.install();
  }
  install() {
    const isMac = process.platform === "darwin";
    if (isMac) {
      this.installBrew().then((result) => {
        const dirBrew = result.replace("\n", "");
        this.installFreeRDP(dirBrew);
        this.installXquartz(dirBrew);
      });
    }
  }
  async installBrew() {
    const promiseBrew = new Promise((resolve, reject) => {
      // validar si brew esta instalado
      exec("/bin/bash -c '/opt/homebrew/bin/brew --version'", (error, stdout, stderr) => {
        if (error) {
          console.log(error);
          Swal.fire({
            title: "Instalación de Brew",
            text: "Se necesita instalar Brew para poder instalar freeRDP",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Instalar",
            cancelButtonText: "Cancelar",
          }).then((result) => {
            if (result.isConfirmed) {
              // Pedir contraseña para instalar Brew con sweetalert2
              Swal.fire({
                title: "Por favor ingrese su contraseña de administrador",
                input: "password",
                inputAttributes: {
                  autocapitalize: "off",
                },
                showCancelButton: true,
                confirmButtonText: "Instalar",
                cancelButtonText: "Cancelar",
              }).then((result) => {
                if (result.isConfirmed) {
                  const { value: password } = result;
                  Swal.fire({
                    title: "Instalando Brew",
                    text: "Por favor espere...",
                    icon: "info",
                    showConfirmButton: false,
                  });
                  const { spawn, exec } = require("child_process");
                  const child = spawn("/bin/bash", [
                    "-c",
                    "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)",
                  ]);
                  child.stdout.on("data", (data) => {
                    console.log(`stdout: ${data}`);
                    if (data.includes("Password:")) {
                      child.stdin.write("${password}\n");
                    }
                  });

                  child.stderr.on("data", (data) => {
                    console.error(`stderr: ${data}`);
                    if (data.includes("already installed")) {
                      Swal.fire({
                        title: "Instalación de Brew",
                        text: "Brew ya está instalado",
                        icon: "info",
                        showConfirmButton: true,
                        confirmButtonText: "De acuerdo, cerrar.",
                      });
                    }
                  });

                  child.on("close", (code) => {
                    console.log(`child process exited with code ${code}`);
                  });
                }
              });
            }
          });
          return;
        }
        if (stderr) {
          reject(`stderr: ${stderr}`)
        }
        if (stdout) {
          resolve('/opt/homebrew/bin/brew');
        }
      });
    });
    return await promiseBrew;
  }
  installFreeRDP(dirBrew) {
    // validar si FreeRDP esta instalado
    exec("/bin/bash -c '/opt/homebrew/bin/xfreerdp --version'", (error, stdout, stderr) => {
      if (error) {
        console.log(error);
        Swal.fire({
          title: "Instalación de freeRDP",
          text: "Se necesita instalar freeRDP",
          icon: "info",
          showCancelButton: true,
          confirmButtonText: "Instalar",
          cancelButtonText: "Cancelar",
        }).then((result) => {
          if (result.isConfirmed) {
            // Pedir contraseña para instalar FreeRDP con sweetalert2
            Swal.fire({
              title: "Por favor ingrese su contraseña de administrador",
              input: "password",
              inputAttributes: {
                autocapitalize: "off",
              },
              showCancelButton: true,
              confirmButtonText: "Instalar",
              cancelButtonText: "Cancelar",
            }).then((result) => {
              if (result.isConfirmed) {
                const { value: password } = result;
                Swal.fire({
                  title: "Instalando freeRDP",
                  text: "Por favor espere...",
                  icon: "info",
                  showConfirmButton: false,
                });
                const { spawn } = require("child_process");
                const child = spawn(dirBrew, [
                  "install",
                  "freerdp",
                ]);
                child.stdout.on("data", (data) => {
                  console.log(`stdout: ${data}`);
                  if (data.includes("Password:")) {
                    child.stdin.write("${password}\n");
                  }
                });

                child.stderr.on("data", (data) => {
                  console.error(`stderr: ${data}`);
                  //   Validar si ya está instalado
                  if (data.includes("already installed")) {
                    Swal.fire({
                      title: "Instalación de freeRDP",
                      text: "FreeRDP ya está instalado",
                      icon: "info",
                      showConfirmButton: false,
                    });
                  }
                });

                child.on("close", (code) => {
                  console.log(`child process exited with code ${code}`);
                });
              }
            });
          }
        });
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      if (stdout) {
        return;
      }
    });
  }
  installXquartz(dirBrew) {
    // validar si Xquartz esta instalado
    exec(
      `${dirBrew} list xquartz --cask | grep xquartz`,
      (error, stdout, stderr) => {
        if (error) {
          console.log(error);
          Swal.fire({
            title: "Instalación de Xquartz",
            text: "Se necesita instalar Xquartz para poder ejecutar freeRDP",
            icon: "info",
            showCancelButton: true,
            confirmButtonText: "Instalar",
            cancelButtonText: "Cancelar",
          }).then((result) => {
            if (result.isConfirmed) {
              // Pedir contraseña para instalar Xquartz con sweetalert2
              Swal.fire({
                title: "Por favor ingrese su contraseña de administrador",
                input: "password",
                inputAttributes: {
                  autocapitalize: "off",
                },
                showCancelButton: true,
                confirmButtonText: "Instalar",
                cancelButtonText: "Cancelar",
              }).then((result) => {
                if (result.isConfirmed) {
                  const { value: password } = result;
                  Swal.fire({
                    title: "Instalando Xquartz",
                    text: "Por favor espere...",
                    icon: "info",
                    showConfirmButton: false,
                  });
                  const { spawn } = require("child_process");
                  const child = spawn(dirBrew, [
                    "install",
                    "xquartz",
                  ]);
                  child.stdout.on("data", (data) => {
                    console.log(`stdout: ${data}`);
                    if (data.includes("Password:")) {
                      child.stdin.write("${password}\n");
                    }
                  });

                  child.stderr.on("data", (data) => {
                    console.error(`stderr: ${data}`);
                    if (data.includes("already installed")) {
                      Swal.fire({
                        title: "Instalación de Xquartz",
                        text: "Xquartz ya está instalado",
                        icon: "info",
                        showConfirmButton: true,
                        confirmButtonText: "De acuerdo, cerrar.",
                      });
                    }
                  });

                  child.on("close", (code) => {
                    console.log(`child process exited with code ${code}`);
                  });
                }
              });
            }
          });
          return;
        }
        if (stderr) {
          console.error(`stderr: ${stderr}`);
          return;
        }
        if (stdout) {
          return;
        }
      }
    );
  }
}

module.exports = InstallDependencies;
