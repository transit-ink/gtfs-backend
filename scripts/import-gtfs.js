require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const csv = require('csv-parse/sync');

// Parse command line arguments
const args = process.argv.slice(2);
const gtfsPath = args[0];
const shouldCleanup = args.includes('--clean');

// Parse batch size from command line
const batchSizeArg = args.find(arg => arg.startsWith('--batch-size=') || arg.startsWith('-b='));
const batchSize = batchSizeArg 
  ? parseInt(batchSizeArg.split('=')[1], 10) 
  : 1000; // default batch size

if (!gtfsPath) {
  console.error('Usage: node import-gtfs.js <path-to-gtfs-files> [--clean] [--batch-size=<number>]');
  console.error('Options:');
  console.error('  --clean              Clear all existing data before importing');
  console.error('  --batch-size=<n>, -b=<n>  Number of records to import at once (default: 1000)');
  process.exit(1);
}

if (isNaN(batchSize) || batchSize < 1) {
  console.error('Error: Batch size must be a positive number');
  process.exit(1);
}

// Database configuration
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  },
});

// Validate required environment variables
const requiredEnvVars = ['DB_USER', 'DB_HOST', 'DB_NAME', 'DB_PASSWORD', 'DB_PORT'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:');
  missingEnvVars.forEach(varName => console.error(`- ${varName}`));
  console.error('\nPlease create a .env file with these variables. See .env.example for reference.');
  process.exit(1);
}

// Define the order of table imports based on dependencies
const importOrder = [
  'agency',      // No dependencies
  'stops',       // No dependencies
  'routes',      // Depends on agency
  'calendar',    // No dependencies
  'calendar_dates', // Depends on calendar
  'shapes',      // No dependencies
  'trips',       // Depends on routes, calendar
  'stop_times'   // Depends on trips, stops
];

async function cleanupTables() {
  const client = await pool.connect();
  try {
    // Disable foreign key checks temporarily
    await client.query('SET session_replication_role = replica;');
    
    // Truncate all tables in reverse order of dependencies
    const tablesToClean = [
      'stop_times',
      'trips',
      'routes',
      'stops',
      'calendar_dates',
      'calendar',
      'shapes',
      'agency'
    ];
    
    for (const table of tablesToClean) {
      await client.query(`TRUNCATE TABLE ${table} CASCADE;`);
      console.log(`Cleaned table: ${table}`);
    }
    
    // Re-enable foreign key checks
    await client.query('SET session_replication_role = DEFAULT;');
    console.log('Database cleanup completed');
  } finally {
    client.release();
  }
}

function buildInsertQuery(tableName, columns, values) {
  const escapeValue = val => {
    if (val === null) return 'NULL';
    return `'${String(val).replace(/'/g, "''")}'`; // escape single quotes
  };

  const valueRows = values.map(row => 
    `(${row.map(escapeValue).join(', ')})`
  ).join(',\n       '); // prettier spacing if you're logging it

  const columnsList = columns.join(', ');

  const query = `
    INSERT INTO ${tableName} (${columnsList})
    VALUES ${valueRows}
    ON CONFLICT DO NOTHING;
  `;

  return query.trim(); // clean up whitespace
}

function createProgressBar(total) {
  const barLength = 50;
  let current = 0;
  
  return {
    update: (increment) => {
      current += increment;
      const percentage = Math.min(100, (current / total) * 100);
      const filled = Math.floor((barLength * current) / total);
      const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);
      process.stdout.write(`\rProgress: [${bar}] ${percentage.toFixed(1)}% (${current}/${total})`);
    },
    complete: () => {
      process.stdout.write('\n');
    }
  };
}

async function importGTFSFile(filePath, tableName) {
  const client = await pool.connect();
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const records = csv.parse(fileContent, {
      columns: true,
      skip_empty_lines: true
    });

    if (records.length === 0) {
      console.log(`No data found in ${filePath}`);
      return;
    }

    const columns = Object.keys(records[0]);
    const totalRecords = records.length;
    const progressBar = createProgressBar(totalRecords);
    
    console.log(`\nImporting ${totalRecords} records into ${tableName} (batch size: ${batchSize})...`);
    
    for (let i = 0; i < totalRecords; i += batchSize) {
      const batch = records.slice(i, i + batchSize);
      const values = batch.map(record => 
        columns.map(col => record[col] || null)
      );

      const query = buildInsertQuery(tableName, columns, values);
      await client.query(query);
      
      progressBar.update(batch.length);
    }
    
    progressBar.complete();
    console.log(`Completed importing ${totalRecords} records into ${tableName}`);
  } finally {
    client.release();
  }
}

async function importGTFSData(gtfsPath) {
  try {
    if (shouldCleanup) {
      console.log('Starting database cleanup...');
      await cleanupTables();
    }
    
    const files = fs.readdirSync(gtfsPath);
    const fileMap = new Map(files.map(file => [file.replace('.txt', ''), file]));
    
    console.log('\nStarting GTFS import in dependency order...\n');
    
    for (const tableName of importOrder) {
      const file = fileMap.get(tableName);
      if (file) {
        console.log(`Processing ${file}...`);
        await importGTFSFile(path.join(gtfsPath, file), tableName);
      } else {
        console.log(`Skipping ${tableName} - file not found`);
      }
    }
    
    // Check for any remaining GTFS files that weren't in our import order
    const processedTables = new Set(importOrder);
    for (const [tableName, file] of fileMap.entries()) {
      if (!processedTables.has(tableName)) {
        console.warn(`\nWarning: Found additional GTFS file ${file} that wasn't in the import order`);
      }
    }
    
    console.log('\nGTFS import completed successfully');
  } catch (error) {
    console.error('Error importing GTFS data:', error);
    throw error;
  } finally {
    await pool.end();
  }
}

importGTFSData(gtfsPath).catch(console.error); 