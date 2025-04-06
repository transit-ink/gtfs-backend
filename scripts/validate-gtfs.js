require('dotenv').config();
const fs = require('fs');
const path = require('path');
const csv = require('csv-parse/sync');

// Parse command line arguments
const args = process.argv.slice(2);
const gtfsPath = args[0];

if (!gtfsPath) {
  console.error('Usage: node validate-gtfs.js <path-to-gtfs-files>');
  process.exit(1);
}

// GTFS Specification requirements
const requiredFiles = ['agency.txt', 'stops.txt', 'routes.txt', 'trips.txt', 'stop_times.txt'];
const optionalFiles = [
  'calendar.txt',
  'calendar_dates.txt',
  'fare_attributes.txt',
  'fare_rules.txt',
  'shapes.txt',
  'frequencies.txt',
  'transfers.txt',
  'pathways.txt',
  'levels.txt',
  'translations.txt',
  'feed_info.txt',
  'attributions.txt',
];

// Required fields for each file
const requiredFields = {
  agency: ['agency_id', 'agency_name', 'agency_url', 'agency_timezone'],
  stops: ['stop_id', 'stop_name', 'stop_lat', 'stop_lon'],
  routes: ['route_id', 'agency_id', 'route_short_name', 'route_long_name', 'route_type'],
  trips: ['route_id', 'service_id', 'trip_id'],
  stop_times: ['trip_id', 'arrival_time', 'departure_time', 'stop_id', 'stop_sequence'],
  calendar: [
    'service_id',
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
    'start_date',
    'end_date',
  ],
  calendar_dates: ['service_id', 'date', 'exception_type'],
  fare_attributes: ['fare_id', 'price', 'currency_type', 'payment_method', 'transfers'],
  fare_rules: ['fare_id'],
  shapes: ['shape_id', 'shape_pt_lat', 'shape_pt_lon', 'shape_pt_sequence'],
  frequencies: ['trip_id', 'start_time', 'end_time', 'headway_secs'],
  transfers: ['from_stop_id', 'to_stop_id', 'transfer_type'],
  pathways: ['pathway_id', 'from_stop_id', 'to_stop_id', 'pathway_mode', 'is_bidirectional'],
  levels: ['level_id', 'level_index'],
  translations: ['table_name', 'field_name', 'language', 'translation'],
  feed_info: [
    'feed_publisher_name',
    'feed_publisher_url',
    'feed_lang',
    'feed_start_date',
    'feed_end_date',
    'feed_version',
  ],
  attributions: ['organization_name'],
};

function createProgressBar(total) {
  const barLength = 50;
  let current = 0;
  let lastPercentage = 0;

  return {
    update: increment => {
      current += increment;
      const percentage = Math.min(100, (current / total) * 100);

      // Update if enough time has passed or percentage has changed by at least 1%
      //   if (Math.floor(percentage) > lastPercentage) {
      const filled = Math.floor((barLength * current) / total);
      const bar = '█'.repeat(filled) + '░'.repeat(barLength - filled);
      process.stdout.write(`\rProgress: [${bar}] ${percentage.toFixed(1)}% (${current}/${total})`);
      lastPercentage = Math.floor(percentage);
      //   }
    },
    complete: () => {
      // Ensure we show 100% when complete
      const bar = '█'.repeat(barLength);
      process.stdout.write(`\rProgress: [${bar}] 100.0% (${total}/${total})\n`);
    },
  };
}

function validateFileExists(filePath, fileName) {
  try {
    fs.accessSync(filePath);
    return true;
  } catch (error) {
    return false;
  }
}

function validateFields(filePath, fileName) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const records = csv.parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    if (records.length === 0) {
      console.error(`❌ ${fileName}: File is empty`);
      return false;
    }

    const fileType = fileName.replace('.txt', '');
    const requiredFieldsForFile = requiredFields[fileType];

    if (!requiredFieldsForFile) {
      console.warn(`⚠️ ${fileName}: No field validation rules defined`);
      return true;
    }

    const actualFields = Object.keys(records[0]);
    const missingFields = requiredFieldsForFile.filter(field => !actualFields.includes(field));

    if (missingFields.length > 0) {
      console.error(`❌ ${fileName}: Missing required fields: ${missingFields.join(', ')}`);
      return false;
    }

    return true;
  } catch (error) {
    console.error(`❌ ${fileName}: Error reading file: ${error.message}`);
    return false;
  }
}

function validateDataFormat(filePath, fileName) {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const records = csv.parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
    });

    // Basic format validations
    for (const record of records) {
      // Validate coordinates if present
      if (
        record.stop_lat &&
        (isNaN(record.stop_lat) || record.stop_lat < -90 || record.stop_lat > 90)
      ) {
        console.error(`❌ ${fileName}: Invalid latitude value: ${record.stop_lat}`);
        return false;
      }
      if (
        record.stop_lon &&
        (isNaN(record.stop_lon) || record.stop_lon < -180 || record.stop_lon > 180)
      ) {
        console.error(`❌ ${fileName}: Invalid longitude value: ${record.stop_lon}`);
        return false;
      }

      // Validate time format if present
      if (
        record.arrival_time &&
        !/^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(record.arrival_time)
      ) {
        console.error(`❌ ${fileName}: Invalid arrival_time format: ${record.arrival_time}`);
        return false;
      }
      if (
        record.departure_time &&
        !/^([0-1][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(record.departure_time)
      ) {
        console.error(`❌ ${fileName}: Invalid departure_time format: ${record.departure_time}`);
        return false;
      }

      // Validate route_type if present
      if (record.route_type && !/^[0-9]+$/.test(record.route_type)) {
        console.error(`❌ ${fileName}: Invalid route_type: ${record.route_type}`);
        return false;
      }
    }

    console.log(`✅ ${fileName}: Valid(${records.length} records)`);
    return true;
  } catch (error) {
    console.error(`❌ ${fileName}: Error validating data format: ${error.message}`);
    return false;
  }
}

async function validateGTFS(gtfsPath) {
  console.log('Starting GTFS validation...\n');

  let isValid = true;
  const allFiles = [...requiredFiles, ...optionalFiles];
  const totalFiles = allFiles.length;

  // Check for required files
  console.log('Checking required files...');
  for (const file of requiredFiles) {
    const filePath = path.join(gtfsPath, file);
    if (!validateFileExists(filePath, file)) {
      console.error(`❌ Required file missing: ${file}`);
      isValid = false;
    } else {
      console.log(`✅ Found required file: ${file}`);
    }
  }

  // Validate all found files
  console.log('\nValidating file contents...');
  for (const file of allFiles) {
    const filePath = path.join(gtfsPath, file);
    if (validateFileExists(filePath, file)) {
      console.log(`\nValidating ${file}...`);

      const fieldsValid = validateFields(filePath, file);
      const formatValid = validateDataFormat(filePath, file);

      if (fieldsValid && formatValid) {
      } else {
        isValid = false;
      }
    }
  }

  // Check for unknown files
  const files = fs.readdirSync(gtfsPath);
  const unknownFiles = files.filter(file => file.endsWith('.txt') && !allFiles.includes(file));

  if (unknownFiles.length > 0) {
    console.warn('\n⚠️ Unknown GTFS files found:');
    unknownFiles.forEach(file => console.warn(`  - ${file}`));
  }

  console.log('\nValidation Summary:');
  if (isValid) {
    console.log('✅ GTFS feed is valid');
  } else {
    console.log('❌ GTFS feed has validation errors');
    process.exit(1);
  }
}

validateGTFS(gtfsPath).catch(error => {
  console.error('Error during validation:', error);
  process.exit(1);
});
