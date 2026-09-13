const required = '20.19.0';
const actual = process.versions.node;

if (actual !== required) {
  console.error(`Este proyecto requiere Node.js ${required}; se está usando ${actual}.`);
  console.error('Instala/activa Node 20.19.0 (consulta .nvmrc) o ejecuta las comprobaciones dentro de Docker.');
  process.exit(1);
}
