import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { DbSyncService } from '../utils/db-sync.service';

@Injectable()
export class SyncDbCommand {
  constructor(private readonly dbSyncService: DbSyncService) {}

  @Command({
    command: 'sync:db',
    describe: 'Sync database columns with GTFS entities',
  })
  async sync() {
    try {
      await this.dbSyncService.syncAllEntities();
      console.log('Database sync completed successfully');
    } catch (error) {
      console.error('Database sync failed:', error);
      process.exit(1);
    }
  }
}
