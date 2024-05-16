import type { UserCreateModel } from '../models/user-create-model.js';
import { userCreateSchema } from '../validators/index.js';
import type { Controller } from '@/shared/protocols/controller.js';
import type { Service } from '@/shared/protocols/service.js';
import type { Validator } from '@/shared/infra/validator/validator.js';
import type { AsyncRequestHandler } from '@/shared/protocols/handlers.js';
import { HttpStatusCode } from '@/shared/protocols/http-client.js';
import { prismaErrorHandler } from '@/shared/errors/prisma-error.js';

export class UserController implements Controller {
  create: AsyncRequestHandler = async (req, res, next) => {
    try {
      this.validator.validate(userCreateSchema, {
        body: req.body,
      });

      const response = await this.serviceCreate.execute({
        email: req.body.email,
        name: req.body.name,
        password: req.body.password,
        repeatPassword: req.body.password,
        username: req.body.username,
      });

      return res.status(HttpStatusCode.created).json(response);
    } catch (error) {
      prismaErrorHandler(error);
      next(error);
    }
  };

  constructor(
    private validator: Validator,
    private serviceCreate: Service<UserCreateModel>
  ) {}
}
