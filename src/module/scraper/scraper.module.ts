import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/common'
import { ScraperService } from './scraper.service';
import { ScraperResolver } from './scraper.resolver';
import { LogoModule } from '@module/logo/logo.module';
import { LogoService } from '@module/logo/logo.service';

@Module({
  imports: [HttpModule, LogoModule],
  providers: [ScraperService, ScraperResolver, LogoService]
})
export class ScraperModule { }
