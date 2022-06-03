import * as winston from 'winston'
import * as PrettyError from 'pretty-error'
import { Logger, LoggerOptions } from 'winston'
import { DateTime } from 'luxon'

const timestamp = DateTime.local().toString()

export class LoggerService {
  public static loggerOptions: LoggerOptions = {
    transports: [new winston.transports.Console()],
  }
  constructor(private context: string) {
    this.logger = (winston as any).createLogger(LoggerService.loggerOptions)
    this.prettyError.skipNodeFiles()
    this.prettyError.skipPackage('express', '@nestjs/common', '@nestjs/core')
  }
  private readonly logger: Logger
  private readonly prettyError = new PrettyError()
  get Logger(): Logger {
    return this.logger // idk why i have this in my code !
  }
  static configGlobal(options?: LoggerOptions) {
    this.loggerOptions = options
  }
  log(message: string): void {
    this.logger.info(message, {
      '@timestamp': timestamp,
      caller: this.context,
    })
  }
  error(message: string, trace?: any): void {
    // i think the trace should be JSON Stringified
    this.logger.error(`${message} -> (${trace || 'trace not provided !'})`, {
      '@timestamp': timestamp,
      caller: this.context,
    })
  }
  warn(message: string): void {
    this.logger.warn(message, {
      '@timestamp': timestamp,
      caller: this.context,
    })
  }
  overrideOptions(options: LoggerOptions) {
    this.logger.configure(options)
  }
}
