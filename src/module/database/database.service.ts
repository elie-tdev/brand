import { Injectable } from '@nestjs/common'
import * as promise from 'bluebird'
import { IMain, IDatabase, IOptions } from 'pg-promise'
import * as pgPromise from 'pg-promise'

import { IExtensions } from './database.interface'

@Injectable()
export class DatabaseService {
  // Bluebird is the best promise library available today, and is the one recommended here:

  // pg-promise initialization options:
  initOptions: IOptions<IExtensions> = {
    // Using a custom promise library, instead of the default ES6 Promise.
    // To make the custom promise protocol visible, you need to patch the
    // following file: node_modules/pg-promise/typescript/ext-promise.d.ts
    promiseLib: promise,

    schema: 'onebrand',
    // Extending the database protocol with our custom repositories;
    // API: http://vitaly-t.github.io/pg-promise/global.html#event:extend
    // extend(obj: IExtensions, dc: any) {
    // Database Context (dc) is mainly needed for extending multiple databases
    // with different access API.

    // Do not use 'require()' here, because this event occurs for every task
    // and transaction being executed, which should be as fast as possible.
    // obj.user = new UserRepository(obj, this.pgp)
    // obj.products = new ProductsRepository(obj, pgp)
    // },
  }

  // Database connection parameters:
  config = {
    host: process.env.POSTGRES_HOST_NAME,
    port: 5432,
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_APP_USER,
    password: process.env.POSTGRES_APP_PASSWORD,
  }

  pgp: IMain = pgPromise(this.initOptions)

  // Create the database instance with extensions:
  conn = this.pgp(this.config) as IDatabase<IExtensions> & IExtensions

  // // Load and initialize optional diagnostics:
  // import diagnostics = require('./diagnostics');

  // diagnostics.init(initOptions);

  // If you ever need access to the library's root (pgp object), you can do it via db.$config.pgp
  // See: http://vitaly-t.github.io/pg-promise/Database.html#.$config
}
