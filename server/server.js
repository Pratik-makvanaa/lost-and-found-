// server.js

// Load environment variables
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectToMongo = require("./config/connectToMongo");
const itemController = require("./routes/itemController");
const userController = require("./routes/userController");
const claimantController = require("./routes/claimantController");
const helperController = require("./routes/helperController");
const requireAuth = require("./middleware/requireAuth");
const errorHandler = require("./middleware/errorHandler");
const {
  validateSignup,
  validateLogin,
  validateItem,
  validateClaimant,
  validateHelper,
} = require("./middleware/validationMiddleware");

// Create an express app
const app = express();

// Configure express app
app.use(express.json({ limit: "500mb" })); // Adjust the limit as needed based on image
app.use(express.urlencoded({ limit: "500mb", extended: true }));
app.use(cookieParser());

const allowedOrigins = ["http://localhost:3000", process.env.CLIENT_ORIGIN].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Origin is not allowed by CORS"));
    },
    credentials: true,
  })
);

// Connect to the database
connectToMongo();

// Routing
app.post("/signup", validateSignup, userController.signup);
app.post("/login", validateLogin, userController.login);
app.get("/logout", userController.logout);
app.get("/fetchuser/:id", userController.fetchUser);
app.get("/check-auth", requireAuth, userController.checkAuth);

app.post("/item/:id", validateItem, itemController.createItem);
app.put("/item/:id", validateItem, itemController.updateItem);
app.get("/item/user/:id", itemController.fetchUserSpecificItems);
app.get("/item/", itemController.fetchItems);
app.get("/item/:id", itemController.fetchItem);
app.delete("/item/:id", itemController.deleteItem);

app.post("/claimant", validateClaimant, claimantController.createClaimant);
app.put("/claimant/:id", validateClaimant, claimantController.updateClaimant);
app.get("/claimant", claimantController.fetchClaimants);
app.get("/claimant/:id", claimantController.fetchClaimant);
app.delete("/claimant/:id", claimantController.deleteClaimant);

app.post("/helper", validateHelper, helperController.createHelper);
app.put("/helper/:id", validateHelper, helperController.updateHelper);
app.get("/helper", helperController.fetchHelpers);
app.get("/helper/:id", helperController.fetchHelper);
app.delete("/helper/:id", helperController.deleteHelper);

// Error handling middleware
app.use(errorHandler);

// Start our server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
