import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Server } from 'http'
import { Context, Handler } from 'aws-lambda'
import { createServer, proxy } from 'aws-serverless-express'
import { eventContext } from 'aws-serverless-express/middleware'
import * as _express from 'express'

// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below
const binaryMimeTypes: string[] = []

async function bootstrapServer(): Promise<Server> {
  const app = require('express')()
  const server = await NestFactory.create(AppModule)
  server.enableCors()
  server.use(eventContext())
  await server.init()
  return createServer(app, undefined, binaryMimeTypes)
}

let cachedServer: Server
// @ts-ignore
export const handler: Handler = async (event: any, context: Context) => {
  console.log('handler event -> ', event)
  console.log('handler context -> ', context)
  if (!cachedServer) {
    console.log('Bootstraping server')
    cachedServer = await bootstrapServer()
  } else {
    console.log('Using cached server')
  }
  return proxy(cachedServer, event, context, 'PROMISE').promise
}
