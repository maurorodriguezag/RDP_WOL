const { ipcRenderer } = require('electron');


// Funcion para crear nueva ventana de electron
class CreateConnectionComponent {
  constructor() {}
  render() {
    ipcRenderer.send('crear-nueva-ventana', 'components/modals/create_connection/index.html');
  }
}

module.exports = CreateConnectionComponent;