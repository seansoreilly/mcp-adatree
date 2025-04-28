// Increase the default timeout for integration tests
jest.setTimeout(30000);

// Load environment variables from .env file
require("dotenv").config();
