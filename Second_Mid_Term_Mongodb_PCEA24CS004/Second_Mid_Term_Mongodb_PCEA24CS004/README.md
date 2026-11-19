# MongoDB Practicals – B3 & B4

This repository contains my solutions for two MongoDB practicals.

## B3 – Movie Catalogue

- Inserted the given movie records.
- Used explain() to check query performance.
- Created and compared compound indexes.
- Used hint() to test index order.
- Created a multikey index on the cast field.
- Practised hiding and unhiding indexes.

File: B3_movie_catalogue.js

## B4 – Ticket Booking

- Inserted the given booking records.
- Created a backup of the database.
- Simulated accidental collection deletion.
- Restored the bookings collection from the backup.
- Verified that all five records were restored.

Files:

- B4_seed_ticketDB.js – inserts the booking data.
- B4_windows_commands.txt – contains backup and restore commands.

## Requirements

- MongoDB
- mongosh
- MongoDB Database Tools (mongodump and mongorestore)
- A three-member replica set for B4 (using the setup from Scenario A4).

## How to Run

1. Start MongoDB and open mongosh.
2. Run B3_movie_catalogue.js for B3.
3. For B4, first run B4_seed_ticketDB.js.
4. Run the backup and restore commands from B4_windows_commands.txt in Command Prompt or PowerShell.

Note: B4 backup and restore commands require the replica set to be running. Update the connection details in the commands if your Scenario A4 setup uses different ports or replica-set names.
