db.orders.drop();

db.orders.insertMany([
  {
    orderId: 1,
    customer: "Arun",
    product: "Laptop",
    category: "Electronics",
    qty: 1,
    price: 55000
  },
  {
    orderId: 2,
    customer: "Divya",
    product: "Mouse",
    category: "Electronics",
    qty: 2,
    price: 500
  },
  {
    orderId: 3,
    customer: "Arun",
    product: "Notebook",
    category: "Stationery",
    qty: 20,
    price: 10
  },
  {
    orderId: 4,
    customer: "Meena",
    product: "Chair",
    category: "Furniture",
    qty: 2,
    price: 3500
  },
  {
    orderId: 5,
    customer: "Divya",
    product: "Headphones",
    category: "Electronics",
    qty: 1,
    price: 1500
  },
  {
    orderId: 6,
    customer: "Karthik",
    product: "Pen",
    category: "Stationery",
    qty: 10,
    price: 40
  }
]);

print("STEP 1: All Orders");
printjson(db.orders.find().toArray());

print("STEP 2: Electronics");
printjson(
  db.orders.aggregate([
    { $match: { category: "Electronics" } },
    { $project: { _id: 0, orderId: 1, product: 1 } }
  ]).toArray()
);

print("STEP 3: Line Total");
printjson(
  db.orders.aggregate([
    {
      $project: {
        _id: 0,
        orderId: 1,
        customer: 1,
        lineTotal: { $multiply: ["$qty", "$price"] }
      }
    }
  ]).toArray()
);

print("STEP 4: Total Quantity");
printjson(
  db.orders.aggregate([
    {
      $group: {
        _id: "$category",
        totalQty: { $sum: "$qty" }
      }
    }
  ]).toArray()
);

print("STEP 5: Revenue and Average Price");
printjson(
  db.orders.aggregate([
    {
      $group: {
        _id: "$category",
        revenue: {
          $sum: { $multiply: ["$qty", "$price"] }
        },
        avgPrice: { $avg: "$price" }
      }
    },
    { $sort: { revenue: -1 } }
  ]).toArray()
);

print("STEP 6: Top Two Customers");
printjson(
  db.orders.aggregate([
    {
      $group: {
        _id: "$customer",
        spent: {
          $sum: { $multiply: ["$qty", "$price"] }
        }
      }
    },
    { $sort: { spent: -1 } },
    { $limit: 2 }
  ]).toArray()
);