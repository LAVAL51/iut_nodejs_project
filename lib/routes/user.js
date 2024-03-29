'use strict';

const Joi = require('joi');

module.exports = [
  {
    method: 'post',
    path: '/user/login',
    options: {
      auth: false,
      tags: ['api'],
      validate: {
        payload: Joi.object({
          mail: Joi.string().email({tlds: {allow: false}}).example('tartampion@gmail.com').description('Email of the user'),
          password: Joi.string().min(8).example('Qkf5fAbSm').description('Lastname of the user'),
        })
      },
    },
    handler: async (request, h) => {
      const { userService } = request.services();
      return await userService.login(request.payload);
    },
  },

  {
    method: 'get',
    path: '/users',
    options: {
      auth: {
        scope: ['user', 'admin'],
      },
      tags: ['api'],
    },
    handler: async (request, h) => {
      const { userService } = request.services();
      return await userService.getAll();
    },
  },

  {
    method: 'post',
    path: '/user',
    options: {
      auth: false,
      tags: ['api'],
      validate: {
        payload: Joi.object({
          firstName: Joi.string().required().min(3).example('John').description('Firstname of the user'),
          lastName: Joi.string().required().min(3).example('Doe').description('Lastname of the user'),
          userName: Joi.string().required().min(3).example('Johny').description('Username of the user'),
          password: Joi.string().required().min(8).example('Qkf5fAbSm').description('Lastname of the user'),
          mail: Joi.string().email({tlds: {allow: false}}).example('tartampion@gmail.com').description('Email of the user'),
        })
      }
    },
    handler: async (request, h) => {
      const { userService, mailServices } = request.services();
      const response = await userService.create(request.payload);
      mailServices.sendMail(request.payload);
      return response;
    }
  },

  {
    method: 'patch',
    path: '/user/{id}',
    options: {
      auth: {
        scope: ['admin'],
      },
      tags: ['api'],
      validate: {
        payload: Joi.object({
          id: Joi.number().integer().required().example(1).description('Id unique de l\'utilisateur'),
          firstName: Joi.string().min(3).example('John').description('Firstname of the user'),
          lastName: Joi.string().min(3).example('Doe').description('Lastname of the user'),
          userName: Joi.string().min(3).example('Johny').description('Username of the user'),
          password: Joi.string().min(8).example('Qkf5fAbSm').description('Lastname of the user'),
          role: Joi.string().valid('user', 'admin', '').example('user').description('Role of the user').default('user').optional(),
          mail: Joi.string().email({tlds: {allow: false}}).example('tartampion@gmail.com').description('Email of the user'),
        })
      },
    },
    handler: async (request, h) => {
      const { userService } = request.services();
      await userService.update(request.payload);
      return 'User edited';
    },
  },

  {
    method: 'delete',
    path: '/user/{id}',
    options: {
      auth: {
        scope: ['admin'],
      },
      tags: ['api'],
      validate: {
        payload: Joi.object({
          id: Joi.number().integer().required().example(1).description('Id unique de l\'utilisateur'),
        })
      },
    },
    handler: async (request, h) => {
      const { userService } = request.services();
      await userService.deleteUserById(request);
      return 'User is been deleted';
    },
  },

  {
    method: 'get',
    path: '/user/favorite',
    options: {
      auth: {
        scope: ['user', 'admin']
      },
      tags: ['api'],
    },
    handler: async (request, h) => {
      const { userService } = request.services();
      return await userService.getAllFavorites(request);
    }
  },

  {
    method: 'post',
    path: '/user/favorite',
    options: {
      auth: {
        scope: ['user', 'admin']
      },
      tags: ['api'],
      validate: {
        payload: Joi.object({
          idMovie: Joi.number().integer().required().example(1).description('Id of movie'),
        })
      }
    },
    handler: async (request, h) => {
      const { userService } = request.services();
      const idUser = request.auth.credentials.id;
      const { idMovie } = request.payload;
      const response = await userService.addFavorite(idUser, idMovie);
      return response;
    }
  },

  {
    method: 'delete',
    path: '/user/favorite',
    options: {
      auth: {
        scope: ['user', 'admin']
      },
      tags: ['api'],
      validate: {
        payload: Joi.object({
          idMovie: Joi.number().integer().required().example(1).description('Id of movie'),
        })
      }
    },
    handler: async (request, h) => {
      const { userService } = request.services();
      const idUser = request.auth.credentials.id;
      const { idMovie } = request.payload;
      const response = await userService.removeFavorite(idUser, idMovie);
      return response;
    },
  }
];
