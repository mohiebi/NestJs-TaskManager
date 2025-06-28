import { registerAs } from "@nestjs/config"

export interface AppConfig {
  port: number;
  dbUri: string;
}

export const appConfig = registerAs('app', () => ({
  port: process.env.PORT,
  dbUri: process.env.DB_URI,
}));