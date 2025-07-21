import express from 'express';
import UserController from '../controllers/UserController.js';

export default function(dbAdapter) {
  const router = express.Router();
  const userController = new UserController(dbAdapter);

  router.route('/')
    .get((req, res, next) => userController.listUsers(req, res, next))
    .post((req, res, next) => userController.createUser(req, res, next));

  router.route('/:id')
    .get((req, res, next) => userController.getUser(req, res, next))
    .put((req, res, next) => userController.updateUser(req, res, next))
    .delete((req, res, next) => userController.deleteUser(req, res, next));

  return router;
}
