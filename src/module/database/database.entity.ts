/* tslint:disable */

export abstract class DatabaseEntity {
  public updatedAt: databaseTimestamps.updated_at
  public createdAt: databaseTimestamps.created_at
  public archivedAt: databaseTimestamps.archived_at
  public deletedAt: databaseTimestamps.deleted_at
}

export namespace databaseTimestamps {
  export type updated_at = Date | string
  export type created_at = Date | string
  export type archived_at = Date | null
  export type deleted_at = Date | null
}
