// Scenario B3 — Movie Catalogue: Index Order, Explain and Hidden Indexes
// Run in mongosh. Sample data is transcribed from the supplied practical sheet.

use("movieDB");

db.movies.drop();

db.movies.insertMany([
  {
    _id: 1,
    title: "Silent River",
    genre: "Drama",
    rating: 8.4,
    year: 2019,
    cast: ["Asha", "Ravi"]
  },
  {
    _id: 2,
    title: "Rapid Chase",
    genre: "Action",
    rating: 7.2,
    year: 2020,
    cast: ["Vikram", "Asha"]
  },
  {
    _id: 3,
    title: "Lost Letters",
    genre: "Drama",
    rating: 7.1,
    year: 2018,
    cast: ["Meera", "Ravi"]
  },
  {
    _id: 4,
    title: "Iron Gate",
    genre: "Action",
    rating: 8.1,
    year: 2021,
    cast: ["Vikram", "Karan"]
  },
  {
    _id: 5,
    title: "Morning Song",
    genre: "Drama",
    rating: 8.8,
    year: 2022,
    cast: ["Meera", "Asha"]
  },
  {
    _id: 6,
    title: "Laugh Lane",
    genre: "Comedy",
    rating: 6.9,
    year: 2017,
    cast: ["Karan", "Meera"]
  },
  {
    _id: 7,
    title: "Night Heist",
    genre: "Action",
    rating: 8.6,
    year: 2019,
    cast: ["Vikram", "Ravi"]
  },
  {
    _id: 8,
    title: "Paper Boats",
    genre: "Drama",
    rating: 7.9,
    year: 2021,
    cast: ["Asha", "Karan"]
  }
]);

print("\n--- Confirm inserted movies ---");
print("Movie count:", db.movies.countDocuments());
db.movies.find({}, { _id: 1, title: 1, genre: 1, rating: 1 }).forEach(printjson);

// Query required by the sheet: Drama movies with rating 8 or above.
const dramaHighRating = { genre: "Drama", rating: { $gte: 8 } };

print("\n--- TASK 1: Explain WITHOUT an index ---");
db.movies.find(dramaHighRating).explain("executionStats");

// TASK 2: Correct compound index: equality field first, range field second.
print("\n--- TASK 2: Correct compound index ---");
db.movies.createIndex(
  { genre: 1, rating: -1 },
  { name: "genre_1_rating_-1" }
);
db.movies.find(dramaHighRating)
  .hint({ genre: 1, rating: -1 })
  .explain("executionStats");

// TASK 3: Reversed / poorly ordered index. Force each index with hint().
print("\n--- TASK 3: Create reversed compound index ---");
db.movies.createIndex(
  { rating: -1, genre: 1 },
  { name: "rating_-1_genre_1" }
);

print("\nCorrect index forced with hint:");
const goodPlan = db.movies.find(dramaHighRating)
  .hint("genre_1_rating_-1")
  .explain("executionStats");
printjson({
  winningStage: goodPlan.queryPlanner.winningPlan,
  nReturned: goodPlan.executionStats.nReturned,
  totalKeysExamined: goodPlan.executionStats.totalKeysExamined,
  totalDocsExamined: goodPlan.executionStats.totalDocsExamined
});

print("\nPoorly ordered index forced with hint:");
const poorPlan = db.movies.find(dramaHighRating)
  .hint("rating_-1_genre_1")
  .explain("executionStats");
printjson({
  winningStage: poorPlan.queryPlanner.winningPlan,
  nReturned: poorPlan.executionStats.nReturned,
  totalKeysExamined: poorPlan.executionStats.totalKeysExamined,
  totalDocsExamined: poorPlan.executionStats.totalDocsExamined
});

// TASK 4: Drop the poorly ordered index.
print("\n--- TASK 4: Drop poorly ordered index ---");
printjson(db.movies.dropIndex("rating_-1_genre_1"));
print("\nIndexes after dropping the poor index:");
db.movies.getIndexes().forEach(printjson);

// TASK 5: Multikey index on cast; find all movies featuring Asha.
print("\n--- TASK 5: Multikey index on cast ---");
db.movies.createIndex({ cast: 1 });
print("Movies featuring Asha:");
db.movies.find({ cast: "Asha" }, { _id: 1, title: 1, cast: 1 })
  .forEach(printjson);
print("\nExplain the Asha query:");
db.movies.find({ cast: "Asha" }).explain("executionStats");

// TASK 6: Hide the correct compound index, run query, then unhide it.
print("\n--- TASK 6: Hide compound index ---");
db.movies.hideIndex("genre_1_rating_-1");
print("Explain while compound index is hidden:");
db.movies.find(dramaHighRating).explain("executionStats");

print("\nUnhide compound index:");
db.movies.unhideIndex("genre_1_rating_-1");
print("Explain after unhiding:");
db.movies.find(dramaHighRating).explain("executionStats");

// TASK 7: Try to create the same key pattern with a different custom name.
// MongoDB versions generally reject duplicate key patterns with conflicting
// index options/names. Catch the error so the script can continue.
print("\n--- TASK 7: Attempt duplicate key pattern with custom name ---");
try {
  db.movies.createIndex(
    { genre: 1, rating: -1 },
    { name: "my_custom_genre_rating_index" }
  );
  print("Index creation returned successfully on this server version.");
} catch (error) {
  print("Expected index creation error:");
  print(error.message);
}

print("\n--- Final list of indexes ---");
db.movies.getIndexes().forEach(printjson);

print("\nB3 completed. Compare explain statistics; exact key counts can vary by MongoDB version.");
