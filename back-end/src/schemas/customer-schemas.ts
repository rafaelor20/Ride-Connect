import Joi from 'joi';
import { CreateCustomerParams } from '@/services/users-service';

export const createCustomerSchema = Joi.object<CreateCustomerParams>({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
