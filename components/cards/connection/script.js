
function execute_connection(name) {
  const connections = store.get("connections");
  const element = connections[name];
  const path = require("path");

  const ExecuteRDP = require(path.join(
    app_directory,
    "/libs/executerdpjs/executerdp.js"
  ));
  const executeRDP = new ExecuteRDP(
    element.user,
    element.password,
    element.ip,
    element.port,
    element.mac,
    element.resolution
  );
  executeRDP.execute();
}

function delete_connection(name) {
  const connections = store.get("connections");
  delete connections[name];
  // Preguntar si se desea eliminar con SweetAlert
  Swal.fire({
    title: "Eliminar conexión",
    text: `¿Está seguro que desea eliminar la conexión ${name}?`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      store.set("connections", connections);
      location.reload();
    }
  });
}

function edit_connection(name) {
  const Store = require("electron-store");
  const store = new Store();
  store.set("selectedConnection", name);
  const EditConnectionComponent = require("./components/modals/edit_connection/edit_connection.js");
  const editConnectionComponent = new EditConnectionComponent();
  editConnectionComponent.render(name);
}

function toggle_auto_start(name){
  const connections = store.get("connections");
  const element = connections[name];
  element.autostart = !element.autostart;
  store.set("connections", connections);
}
