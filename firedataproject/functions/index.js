const functions = require("firebase-functions");

const express = require('express');
const engines = require('consolidate');
var hbs = require('handlebars');
const admin = require('firebase-admin');

//var serviceAccount = require("./lastfirebaseproject-firebase-adminsdk-w25d0-469b0bb00a.json");
//admin.initializeApp({
//credential: admin.credential.cert(serviceAccount),
//databaseURL: "https://lastfirebaseproject-default-rtdb.firebaseio.com"
//});

admin.initializeApp(functions.config().firebase);

const app = express();
app.engine('hbs',engines.handlebars);
app.set('views','./views');
app.set('view engine','hbs');


async function getFirestore(){
    const firestore_con  = await admin.firestore();
    const sonuc = firestore_con.collection('sample').doc('sample_doc').get().then(doc => {
    if (!doc.exists) { console.log('Veri Yok'); }
    else {return doc.data();}})
    .catch(err => { console.log('Hata', err);});
    return sonuc
    }

    async function Dataekleme(request){
        const sonuc = await admin.firestore().collection('form_data').add({
        firstname: request.body.firstname,
        lastname: request.body.lastname
        })
        .then(function() {console.log("Dosya basarili bir sekilde yazildi");})
        .catch(function(error) {console.error("Hata ", error);});
        }

app.get('/',async (request,response) =>{
    var db_result = await getFirestore();
    response.render('index',{db_result});
    });

app.post('/ekle_data',async (request,response) =>{
    var insert = await Dataekleme(request);
    response.sendStatus(200);
    });




exports.app = functions.https.onRequest(app);