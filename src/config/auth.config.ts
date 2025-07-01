import { registerAs } from "@nestjs/config";

export interface AuthConfig {
  jwt: {
    secret: string;
    expiresIn: string;
  };
}

export const authConfig = registerAs('auth', () => ({
  jwt: {
    secret: process.env.JWT_TOKEN as string,
    expiresIn: process.env.JWT_EXPIRES_IN ?? '60m',
  },
}));