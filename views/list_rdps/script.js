// Crear nueva conexión
function create_new_connection() {
  const CreateConnectionComponent = require("./components/modals/create_connection/create_connection.js");
  const createConnectionComponent = new CreateConnectionComponent();
  createConnectionComponent.render();
}

// Cargar lista de conexiones
(function load_rdps() {
  const connections = store.get("connections");
  const ConnectionComponent = require("./components/cards/connection/connection.js");
  const connectionComponent = new ConnectionComponent("content_rdps");
  for (const key in connections) {
    if (Object.hasOwnProperty.call(connections, key)) {
      const element = connections[key];

      if (element.autostart) {
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

      connectionComponent.render(
        (replaces = {
          name: key,
          ip: element.ip,
          mac: element.mac,
          port: element.port,
          auto_start: element.autostart ? "checked" : "",
        })
      );
    }
  }
})();
