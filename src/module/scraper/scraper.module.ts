import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/common'
import { ScraperService } from './scraper.service';
import { ScraperResolver } from './scraper.resolver';
import { ScraperEntity } from './scraper.entity'

@Module({
  imports: [HttpModule],
  providers: [ScraperService, ScraperResolver]
})
export class ScraperModule {}
