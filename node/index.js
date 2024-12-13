const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const userRoutes = require('./routes/userRoutes');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

connectDB();

app.use(bodyParser.json());

// Configuração de CORS para permitir comunicação com o Flask
app.use(cors({
    origin: 'http://localhost:5001', // Permite requisições do servidor Flask
    credentials: true
}));

app.use(express.static(path.join(__dirname, 'public')));

// Rotas de usuários
app.use('/api/users', userRoutes);

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});

// Rota de fallback para erros 404
app.get('*', (req, res) => {
    res.status(404).send('Página não encontrada');
});

// Inicialização do servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
