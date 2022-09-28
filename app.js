/*Import of express package*/
const express = require('express');
/*Import of mongoose package*/
const mongoose = require('mongoose');
/*Import to define the paths*/
const path = require('path');

/*import of app's routes*/
const sauceRoutes = require ('./routes/sauce');
const userRoutes = require ('./routes/user');

/*Connection to MongoDb*/
mongoose.connect('mongodb+srv://simon_amiel:P23BEyUITy6l0nkC@cluster0.rbj7mvk.mongodb.net/?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(express.json());

/*CORS and autorization*/
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

/*Management of main routes of API*/
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/sauces', sauceRoutes);
app.use('/api/auth', userRoutes);


module.exports = app;