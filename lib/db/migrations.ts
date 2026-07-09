import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { db } from './index';
import path from 'path';

export async function runMigrations() {
  try {
    await migrate(db, {
      migrationsFolder: path.join(process.cwd(), 'lib/db/migrations'),
    });
    console.log('✓ Migrations completed successfully');
  } catch (error) {
    console.error('✗ Migration failed:', error);
    throw error;
  }
}
