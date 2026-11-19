# MongoDB Certification Practical — Scenarios B3 & B4

This repository contains beginner-friendly solutions for the two practical sheets supplied:

- **B3 — Movie Catalogue: Index Order, Explain and Hidden Indexes**
- **B4 — Ticket Booking: Backup, Restore and Disaster Recovery**

## Requirements

- MongoDB Server running locally or reachable over the network.
- `mongosh`
- MongoDB Database Tools (`mongodump`, `mongorestore`)
- For B4: an already configured **3-member replica set**. The sheet says to reuse the replica set from Scenario A4; do not create another one if you already have it.

> The commands below assume Windows and a replica set named `rs0` with members on ports `27017`, `27018`, and `27019`. Change these values if your Scenario A4 setup uses different names, hosts, or ports.

## B3 — Run the movie catalogue exercise

1. Open `mongosh`.
2. Run the complete file `B3_movie_catalogue.js`:

```javascript
load("C:/path/to/B3_movie_catalogue.js")
```

Alternatively, paste the file into `mongosh` in sections.

The script:
1. Creates `movieDB.movies` and inserts the eight supplied movie documents.
2. Runs the Drama + rating >= 8 query without an index.
3. Creates the correct compound index `{ genre: 1, rating: -1 }`.
4. Creates and tests the reversed index `{ rating: -1, genre: 1 }` using `hint()`.
5. Drops the poorly ordered index.
6. Creates a multikey index on `cast` and finds movies featuring Asha.
7. Hides and unhides the correct compound index.
8. Attempts to create the same key pattern with a custom name, catches the expected index-options conflict where applicable, and lists indexes.

**Important:** Explain-plan counters can vary slightly by MongoDB version. Compare `totalKeysExamined`, `totalDocsExamined`, and the winning stage rather than expecting every number to be identical.

## B4 — Run the ticket backup and restore exercise

### A. Seed the sample data

1. Make sure the three-node replica set from Scenario A4 is running.
2. Open `mongosh` connected to the replica set primary.
3. Run `B4_seed_ticketDB.js`.

### B. Back up the replica set

Open **PowerShell or Command Prompt**, not `mongosh`, and run the command in `B4_windows_commands.txt`.

The command reads from a secondary using `readPreference=secondary`, writes the full dump to `C:\backups\ticket_full`, and captures the oplog.

### C. Verify, simulate loss, restore

Follow the numbered commands in `B4_windows_commands.txt`.

- Verify `ticketDB\bookings.bson` and `oplog.bson` exist.
- Drop `bookings` from the primary using `mongosh`.
- Confirm the collection count is zero.
- Restore only `ticketDB.bookings` from the backup directory.
- Confirm all five booking documents are present again.

The selective collection restore intentionally does not use `--oplogReplay`: the task asks to restore only one collection. Oplog replay is for restoring the captured operations as part of a broader consistent restore.

## Three good backup practices

1. Schedule regular automated backups and retain multiple generations.
2. Store backups securely in a separate location (and encrypt them where appropriate).
3. Test restores regularly and document recovery time and recovery point objectives.

## Disaster-recovery table

| Failure | Response |
|---|---|
| Accidental collection deletion | Restore the collection from a verified backup; use point-in-time recovery if required and available. |
| Primary node failure | Allow replica-set election; investigate and repair the failed member. |
| Entire server/storage failure | Restore a verified backup to healthy infrastructure, then apply oplog/PITR data if available. |

## Safety

Do not commit real database credentials, connection strings containing passwords, private keys, production data, or backup files to GitHub. This repository uses sample data only.
