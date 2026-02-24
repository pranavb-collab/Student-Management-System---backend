import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';

import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('events')
@UseGuards(JwtAuthGuard)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  // Admin & Teacher only
  @Post()
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'TEACHER')
  create(@Body() dto: CreateEventDto, @Req() req) {
    return this.eventsService.create(dto, req.user);
  }

  // All logged users
  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  // Admin & Teacher only
  @Patch(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'TEACHER')
  update(@Param('id') id: string, @Body() dto: UpdateEventDto) {
    return this.eventsService.update(id, dto);
  }

  // Admin & Teacher only
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('ADMIN', 'TEACHER')
  remove(@Param('id') id: string) {
    return this.eventsService.remove(id);
  }
}