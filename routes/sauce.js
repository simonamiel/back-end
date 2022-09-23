/*Configuration of sauces routes*/
const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const sauceCtrl = require('../controllers/sauce');
const multer = require('../middleware/multer-config');


/*All routes for CRUD*/

/*Get all sauces data into Database*/
router.get('/', auth, sauceCtrl.getAllSauces);
/*Save data into Database*/
router.post('/', auth, multer, sauceCtrl.createSauce);
/*Get one sauce data into Database*/
router.get('/:id', auth, sauceCtrl.getOneSauce);
/*Modify data into Database*/
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
/*Delete data into Database*/
router.delete('/:id', auth, sauceCtrl.deleteSauce);
/*Management Likes/Dislikes into Database*/
router.post('/:id/like', auth, sauceCtrl.likeSauce);

module.exports = router;