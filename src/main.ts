import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { LoggerService } from './module/logger/logger.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  app.useLogger(app.get(LoggerService))
  await app.listen(9000)
}
bootstrap()
