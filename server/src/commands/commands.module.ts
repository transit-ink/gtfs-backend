import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { SyncDbCommand } from './sync-db.command';
import { UtilsModule } from '../utils/utils.module';

@Module({
  imports: [CommandModule, UtilsModule],
  providers: [SyncDbCommand],
})
export class CommandsModule {}
