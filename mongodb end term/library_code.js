
db.members.insertMany([
  {
    name: "Ravi",
    address: { city: "Chennai", pin: "600001" },
    borrowed: ["Python Basics", "MongoDB Guide"],
    fee: 0
  },
  {
    name: "Kumar",
    address: { city: "Chennai", pin: "600028" },
    borrowed: [],
    fee: 0
  },
  {
    name: "Sita",
    address: { city: "Bangalore", pin: "560001" },
    borrowed: ["MongoDB Guide"],
    fee: 50
  },
  {
    name: "Lakshmi",
    address: { city: "Hyderabad", pin: "500001" },
    borrowed: ["Python Basics"],
    fee: 120
  }
]);

print("STEP 1: All Members");
printjson(db.members.find().toArray());

print("STEP 2: Chennai Members");
printjson(
  db.members.find(
    { "address.city": "Chennai" },
    { _id: 0, name: 1, address: 1 }
  ).toArray()
);

print("STEP 3: MongoDB Guide");
printjson(
  db.members.find(
    { borrowed: "MongoDB Guide" },
    { _id: 0, name: 1, borrowed: 1 }
  ).toArray()
);

print("STEP 4: Both Books");
printjson(
  db.members.find(
    { borrowed: { $all: ["Python Basics", "MongoDB Guide"] } },
    { _id: 0, name: 1 }
  ).toArray()
);

print("STEP 5: No Books");
printjson(
  db.members.find(
    { borrowed: { $size: 0 } },
    { _id: 0, name: 1 }
  ).toArray()
);

print("STEP 6: Update Sita");
printjson(
  db.members.updateOne(
    { name: "Sita" },
    { $set: { "address.city": "Chennai" } }
  )
);

print("STEP 7: Fee Count");
print(db.members.countDocuments({ fee: { $gt: 0 } }));

print("Cleanup: Drop Collection");
print(db.members.drop());