const { User, Post, Comment } = require("../models");
const { redisClient }  = require('../config/redisClient')
const { getModelByIdCache, getModelsCache, deleteModelsCache, deleteModelByIdCache, deleteManyModelsCache, deleteManyDbChildren } = require("./genericController")

const getUsers = async (_, res) => {
    const cached = await getModelsCache(User)
    const users = cached ? JSON.parse(cached) : await User.find().populate({ path: 'posts', select: 'fecha content comments tags imagenes'}).populate({ path: 'comments', select: 'fecha content'});
    await redisClient.set('Users:todos', JSON.stringify(users), { EX: 300 })
    res.status(200).json(users);
};

const getUserById = async (req, res) => {
    const cached = await getModelByIdCache(User, req.params.id)
    const user = cached ? JSON.parse(cached) : await User.findById(req.params.id).populate('posts').populate('comments');
    await redisClient.set(`User:${req.params.id}`, JSON.stringify(user), { EX: 300 })
    res.status(200).json(user);
};

const createUser = async (req, res) => {
    const user = await User.create(req.body);
    await deleteModelsCache(User)
    res.status(201).json(user);
};

const updateUserById = async (req, res) => {
    await User.findByIdAndUpdate(req.params.id, req.body, {new: true})
    await deleteModelByIdCache(User, req.params.id)
    await deleteModelsCache(User)
    res.status(200).json({ message: "Usuario actualizado correctamente" }); 
};

const deleteById = async (req, res) => {
    const userId = req.params.id;
    //Borrar los posts y comentarios del usuario
    await deleteManyDbChildren([Post, Comment], { userId: userId }); 
    await User.findByIdAndDelete(userId);
    await deleteModelByIdCache(User, userId);
    await deleteManyModelsCache([User, Post, Comment]) // Borro cache de modelo actual y de padre
    res.status(200).json({ message: "Usuario eliminado correctamente" });
};

module.exports = { getUsers, getUserById, createUser, updateUserById, deleteById };