const app=require('./app');
const connectDB=require('./config/database.js');

connectDB();

const PORT = process.env.PORT || 5000; // Change 5000 to another available port if necessary
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});