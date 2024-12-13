const User = require('../models/User');

class UserRepository {
    async findById(id) {
        return User.findById(id);
    }

    async findByEmail(email) {
        return User.findOne({ email });
    }

    async createUser(data) {
        const user = new User(data);
        return user.save();
    }

    async updateUserPassword(userId, newPassword) {
        return User.findByIdAndUpdate(userId, { password: newPassword }, { new: true });
    }

}

module.exports = new UserRepository();
