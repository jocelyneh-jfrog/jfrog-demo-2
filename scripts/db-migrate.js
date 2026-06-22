#!/usr/bin/env node
// ⚠️  DEMO FILE — hardcoded secrets intentionally present for JFrog Secret Detection demo

const mysql = require('mysql');
const mongoose = require('mongoose');

// ⚠️  Hardcoded DB credentials — should use env vars or a secrets manager
const PROD_DB = {
  host: 'prod-mysql.internal.company.com',
  user: 'root',
  password: 'R00tP@ssw0rdDEMO!',
  database: 'app_production'
};

// ⚠️  MongoDB URI with embedded credentials
const MONGO_URI = 'mongodb+srv://demo_admin:DEMO_Mongo$ecret@cluster0.demo123.mongodb.net/app';

// ⚠️  Backup S3 bucket credentials hardcoded
const S3_BACKUP = {
  accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
  secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
  bucket: 'demo-db-backups-prod'
};

async function runMigrations() {
  console.log('Connecting to database...');

  const connection = mysql.createConnection(PROD_DB);
  connection.connect((err) => {
    if (err) {
      console.error('DB connect failed (demo — expected):', err.message);
      return;
    }
    console.log('Connected. Running migrations...');
    connection.query('SELECT 1', () => connection.end());
  });

  console.log('Migration script complete (demo)');
}

runMigrations().catch(console.error);
