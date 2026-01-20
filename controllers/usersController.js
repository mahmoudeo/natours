const User = require('../models/usersModel');

const { getAll, getOne, updateOne, deleteOne } = require('./handlerFactory');

exports.getUsers = getAll(User);
exports.getUser = getOne(User);
exports.patchUser = updateOne(User);
exports.deleteUser = deleteOne(User);




