const render = require("./libs/renderjs/render");
const Swal = require('sweetalert2');
const install = require("./install/install");
const Store = require('electron-store');
const store = new Store();
const install_dependencies = new install()
const renderApp = new render("app");
const path = require("path");
const app_directory = path.join(__dirname);

renderApp.render("views/list_rdps/index.html", "views/list_rdps/script.js");
