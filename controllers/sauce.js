const Sauce = require('../models/Sauce');
/*For use file system of server*/
const fs = require('fs');

/*All controllers for API routes*/
/*====================================*/
/*Create a sauce*/
/*====================================*/
exports.createSauce = (req, res, next) => {
   const sauceObject = JSON.parse(req.body.sauce);
   delete sauceObject._id;
   delete sauceObject._userId;
   const sauce = new Sauce({
       ...sauceObject,
       userId: req.auth.userId,
       likes: 0,
       dislikes: 0,
       usersLiked: [],
       usersDisliked: [],
       imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
   });
 
   sauce.save()
   .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
   .catch(error => { res.status(400).json( { error })})
};
/*====================================*/
/*Modify an existing sauce*/
/*====================================*/
exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
    delete sauceObject._userId;
    Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
           if (sauce.userId != req.auth.userId) {
               res.status(401).json({ message : 'Not authorized'});
           } else {
               Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
               .then(() => res.status(200).json({message : 'Objet modifié!'}))
               .catch(error => res.status(401).json({ error }));
           }
       })
    .catch((error) => {
           res.status(400).json({ error });
});
};
/*====================================*/
/*Delete a sauce*/
/*====================================*/
exports.deleteSauce = (req, res, next) => {
   Sauce.findOne({ _id: req.params.id})
       .then(sauce => {
           if (sauce.userId != req.auth.userId) {
               res.status(401).json({message: 'Not authorized'});
           } else {
               const filename = sauce.imageUrl.split('/images/')[1];
               fs.unlink(`images/${filename}`, () => {
                   Sauce.deleteOne({_id: req.params.id})
                       .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                       .catch(error => res.status(401).json({ error }));
               });
           }
       })
       .catch( error => {
           res.status(500).json({ error });
       });
};
/*====================================*/
/*Select a specific sauce*/
/*====================================*/
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({error}));
};
/*====================================*/
/*Select all sauces*/
/*====================================*/
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({error}));
};
/*==============================================*/
/*Management of Likes/dislikes for sauces*/
/*==============================================*/
exports.likeSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
    .then(sauce => {
        /*If user hasn't made a choice Like or Dislike yet (-1 is no entry in usersLiked/usersDisliked whith "indexOf" here) */
        if(sauce.usersLiked.indexOf(req.body.userId) == -1 && sauce.usersDisliked.indexOf(req.body.userId) == -1) {
            /*If user like the sauce*/
            if(req.body.like == 1) {
                sauce.usersLiked.push(req.body.userId);
                sauce.likes += req.body.like;
            } 
            /*If user dislike the sauce*/
            else if(req.body.like == -1) {
               sauce.usersDisliked.push(req.body.userId);
                sauce.dislikes -= req.body.like; 
            };
        };
        /*Cancellation of the likes and dislikes part*/
        /*If user want to cancel his like*/
        if(sauce.usersLiked.indexOf(req.body.userId) != -1 && req.body.like == 0) {
            const likesUserList = sauce.usersLiked.findIndex(user => user === req.body.userId);
            sauce.usersLiked.splice(likesUserList, 1);
            sauce.likes -= 1;
        };
        /*If user want to cancel his Dislike*/
        if(sauce.usersDisliked.indexOf(req.body.userId) != -1 && req.body.like == 0) {
            const dislikesUserList = sauce.usersDisliked.findIndex(user => user === req.body.userId);
            sauce.usersDisliked.splice(dislikesUserList, 1);
            sauce.dislikes -= 1;
        };
    sauce.save();
    res.status(201).json({message: 'Mise à jour des likes/dislikes'});
})
    .catch(error => res.status(500).json({error}));
};