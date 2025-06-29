import { ConfigService } from "@nestjs/config";
import { ConfigType } from "./config.types";

export class TypeConfigService extends ConfigService <ConfigType> {}