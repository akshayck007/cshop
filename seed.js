const mongoose = require("mongoose");
const Product = require("./models/Product");

const products = [
  {
    name: "iphone 15 Pro",
    img: "https://images.unsplash.com/photo-1695048132832-b41495f12eb4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTF8fGlwaG9uZSUyMDE1fGVufDB8fDB8fHww",
    price: 124000,
    desc: "good Condition",
  },
  {
    name: "MacBook Pro",
    img: "https://images.unsplash.com/photo-1485988412941-77a35537dae4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTV8fG1hY2Jvb2slMjBwcm98ZW58MHx8MHx8fDA%3D",
    price: 230000,
    desc: "nice Condition",
  },
  {
    name: "Apple pencil",
    img: "https://images.unsplash.com/photo-1502404768591-f24d06b7a366?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXBwbGUlMjBwZW5jaWx8ZW58MHx8MHx8fDA%3D",
    price: 10000,
    desc: "I can write",
  },
];

async function seedDB() {
  await Product.insertMany(products);
  console.log("db seeded");
}

module.exports = seedDB;
 