# Sales Tracker CRUD Application

## Overview
This project is a CRUD application designed to track sales data. It allows users to create, read, update, and delete sales records. The application uses Prisma as an ORM to interact with a MongoDB database.

## Features
- Create new sales records
- View a list of all sales records
- Update existing sales records
- Delete sales records
- Responsive design for easy use on various devices

## File Structure
```
project2-1
├── prisma
│   └── schema.prisma        # Defines the data model for the application
├── public
│   ├── index.html           # Main HTML template for the application
│   ├── script.js            # JavaScript logic for handling form submissions and API interactions
│   └── style.css            # Styles for the application
├── routes
│   └── api.js               # API routes for the application
├── .env                      # Environment variables for database connection
├── server.js                 # Initializes the Express application
├── plan.md                   # Outline of steps for implementing changes
├── package.json              # Project dependencies and scripts
└── README.md                 # Documentation for the project
```

## Getting Started
1. **Clone the repository**: 
   ```bash
   git clone <repository-url>
   cd project2-1
   ```

2. **Install dependencies**: 
   ```bash
   npm install
   ```

3. **Set up the environment**: 
   - Create a `.env` file in the root directory and add your MongoDB connection string:
     ```
     DATABASE_URL=mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority
     ```

4. **Run the application**: 
   ```bash
   npm start
   ```

5. **Access the application**: 
   Open your browser and navigate to `http://localhost:3001`.

## Future Improvements
- Implement user authentication for secure access to sales data.
- Add filtering and sorting options for sales records.
- Enhance the UI for better user experience.

## License
This project is licensed under the MIT License.