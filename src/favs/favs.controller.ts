import { Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import { Delete, HttpCode } from '@nestjs/common/decorators';
import { ApiTags } from '@nestjs/swagger';
import { FavsService } from './favs.service';

@ApiTags('Favorites')
@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Get()
  findAll() {
    return this.favsService.findAll();
  }

  @Post('track/:id')
  addTrack(@Param('id', ParseUUIDPipe) id: string) {
    return this.favsService.addItem('track', id);
  }

  @Delete('track/:id')
  @HttpCode(204)
  removeTrack(@Param('id', ParseUUIDPipe) id: string) {
    return this.favsService.removeItem('track', id);
  }

  @Post('album/:id')
  addAlbum(@Param('id', ParseUUIDPipe) id: string) {
    return this.favsService.addItem('album', id);
  }

  @Delete('album/:id')
  @HttpCode(204)
  removeAlbum(@Param('id', ParseUUIDPipe) id: string) {
    return this.favsService.removeItem('album', id);
  }

  @Post('artist/:id')
  addArtist(@Param('id', ParseUUIDPipe) id: string) {
    return this.favsService.addItem('artist', id);
  }

  @Delete('artist/:id')
  @HttpCode(204)
  removeArtist(@Param('id', ParseUUIDPipe) id: string) {
    return this.favsService.removeItem('artist', id);
  }
}
