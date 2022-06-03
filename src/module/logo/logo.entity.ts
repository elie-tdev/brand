import { DatabaseEntity } from '@module/database/database.entity'

export class LogoEntity extends DatabaseEntity {
  logoId: LogoDatabaseFields['logo_id']
  brandId: LogoDatabaseFields['brand_id']
  logoUrl: LogoDatabaseFields['logo_url']
}

export interface LogoDatabaseFields {
  logo_id: string
  brand_id: string
  logo_url: string
}
