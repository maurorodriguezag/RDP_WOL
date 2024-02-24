const { ipcRenderer } = require('electron');


// Funcion para crear nueva ventana de electron
class CreateConnectionComponent {
  constructor() {}
  render(connection_name) {
    ipcRenderer.send('crear-nueva-ventana', 'components/modals/edit_connection/index.html', connection_name);
  }
}

module.exports = CreateConnectionComponent;