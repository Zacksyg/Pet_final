const UserRepository = require('../repositories/userRepository');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Verifica se já existe um usuário com o mesmo email
        const existingUser = await UserRepository.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'Email Já Cadastrado!' });
        }

        // Criação do novo usuário
        const user = await UserRepository.createUser({ name, email, password });

        const token = jwt.sign({ sub: user._id, id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await UserRepository.findByEmail(email);
        if (!user) {
            return res.status(400).json({ error: 'Email ou Senha Invalido' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Email ou Senha Invalido' });
        }

        const token = jwt.sign({ sub: user._id, id: user._id, name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token, name: user.name });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
