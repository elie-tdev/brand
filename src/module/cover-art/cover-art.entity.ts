import { DatabaseEntity } from '../database/database.entity'

export class CoverArtEntity extends DatabaseEntity {
  coverArtId: CoverArtDatabaseFields ['cover_art_id']
  coverArtSlug: CoverArtDatabaseFields ['cover_art_slug']
  coverArtTitle: CoverArtDatabaseFields ['cover_art_title']
}

export interface CoverArtDatabaseFields {
  cover_art_id: string
  cover_art_slug: string
  cover_art_title: string
}
