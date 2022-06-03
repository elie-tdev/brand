import * as path from 'path'
import * as dotenv from 'dotenv-safe'
import { DotenvConfigOutput } from 'dotenv'
import { Logger, Injectable } from '@nestjs/common'

@Injectable()
export class ConfigService {
  private readonly envConfig: DotenvConfigOutput

  constructor(filePath: string) {
    this.envConfig = dotenv.config({
      path: path.resolve(filePath),
    })
  }
  private readonly logger = new Logger(ConfigService.name)

  get(key: string): string {
    return this.envConfig.parsed[key]
  }
}
