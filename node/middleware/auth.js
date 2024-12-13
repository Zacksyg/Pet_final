const UserRepository = require('../repositories/userRepository');
const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
        return res.status(401).json({ message: 'Acesso negado. Nenhum token fornecido.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserRepository.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: 'Usuário não encontrado.' });
        }

        req.user = user;
        next();
    } catch (error) {
        res.status(400).json({ message: 'Token inválido.' });
    }
};
