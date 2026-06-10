const express = require('express');
const app = express();
const PORT = 3000;

// Ruta principal
app.get('/', (req, res) => {
    res.send('El servidor está funcionando');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});