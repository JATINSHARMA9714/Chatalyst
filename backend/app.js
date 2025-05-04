import express from 'express';
import morgan from 'morgan';
import connectDB from './db/db.js';
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';


connectDB(); // Connect to MongoDB

const app = express();

app.use(cors()); // Enable CORS for all specific routes
app.use(morgan('dev'));//for logs(shows which url was hit and what status code was returned)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Parse cookies from request headers


app.use("/users", userRoutes); // Use user routes for all requests starting with /users
app.use("/projects", projectRoutes); // Use project routes for all requests starting with /projects
app.use("/ai", aiRoutes); // Use AI routes for all requests starting with /ai


app.get('/', (req, res) => {
  res.send('Hello World!');
});

// not listening here(cause of socket io easily gets integrated with http server)
export default app;