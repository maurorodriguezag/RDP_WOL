class ConnectionComponent {
  constructor(idPather) {
    this.idPather = idPather;
  }
  render(replaces = {}) {
    const renderPath = new render(this.idPather);
    renderPath.render(
      "components/cards/connection/index.html",
      "components/cards/connection/script.js",
      replaces
    );
  }
}

module.exports = ConnectionComponent;
