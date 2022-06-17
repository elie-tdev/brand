import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '@module/database/database.service';
import { CoverArtEntity } from './cover-art.entity';

@Injectable()
export class CoverArtService {
  constructor(
    private readonly db: DatabaseService,
  ) { }
  private readonly logger = new Logger(CoverArtService.name)

  async listCoverArt(
  ): Promise<CoverArtEntity[]> {
    return await this.db.conn.many(
      `select * from cover_art;`,
    )
  }
}
