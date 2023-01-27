const mongoose = require('mongoose')

const voitureSchema = mongoose.Schema({
    marque : {type:"String",required:true},
    modele : {type:"String",required:true},
    annee : {type:"Number",required:true},
    immatriculation : {type:"String",required:true,unique:true},
    description : {type:"String"},
    mise_en_service : {type:"Date"},

})

module.exports= mongoose.model("Voiture",voitureSchema)