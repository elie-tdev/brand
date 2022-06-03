import { DatabaseEntity } from '../database/database.entity'

export class BrandEntity extends DatabaseEntity {
  brandId: BrandDatabaseFields['brand_id']
  websiteUrl: BrandDatabaseFields['website_url']
  locale: BrandDatabaseFields['locale']
  hadGuidelines: BrandDatabaseFields['had_guidelines']
  isPublished: BrandDatabaseFields['is_published']
}

export interface BrandDatabaseFields {
  brand_id: string
  website_url: string
  locale: string
  had_guidelines: string
  is_published: boolean
}
