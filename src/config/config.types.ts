import * as Joi from "joi";
import { appConfig, AppConfig } from "./app.config";
import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export interface ConfigType {
  app: AppConfig;
  database: TypeOrmModuleOptions;
}

export const appConfigSchema = Joi.object({
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default('5432'),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
});
