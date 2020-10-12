var https = require('https');

module.exports = function(app, passport, db, multer, ObjectId) {

// Image Upload Code =========================================================================
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images/uploads')
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + '-' + Date.now() + ".png")
    }
});
var upload = multer({storage: storage});


// normal routes ===============================================================



// show the home page (will also have our login links)
app.get('/', function(req, res) {
    res.render('index.ejs');
});

app.get('/test', isLoggedIn, function(req, res) {
    let uId = ObjectId(req.session.passport.user)
    db.collection('vacations').find({'planner': uId}).toArray((err, result) => {
      if (err) return console.log(err)
      res.render('event.ejs', {
        user : req.user,
        vacations: result
      })
    })
});

// New PROFILE SECTION =========================
app.get('/profile', isLoggedIn, function(req, res) {
    let uId = ObjectId(req.session.passport.user)
    db.collection('vacations').find({'planner': uId}).toArray((err, result) => {
      if (err) return console.log(err)
      res.render('home/index.ejs', {
        user : req.user,
        vacations: result
      })
    })
});



//=========Possible-World-Vacation-Page=========//
app.get('/feed', isLoggedIn, function(req, res) {
    db.collection('vacations').find().toArray((err, result) => {
      if (err) return console.log(err)
      //====Renders All Vacations====//
      res.render('allVacations.ejs', {
        user : req.user,
        vacations: result
      })
    })
});

let mapsRoute = (vacationId, city, searchQuery, callBack)=>{

db.collection('vacations').find({_id:ObjectId(vacationId)}).toArray((err, result2) =>{

db.collection('venues').find({
  location: {'city': city}
}).toArray((err, result) =>{
//Need for future feature//
if (result.length===0){

let latlon = result2[0].location.reverse().join()
  https.get(`https://api.foursquare.com/v2/venues/search?client_id=CRK3M3QSQ4SSNTAJ34HBSHLYURAPOYHYQ0PVJHKTSNCPIYC2&client_secret=ZRZQNU3GQY3FXA4L2ASD5G03AF0RS34CAATEIMBJHJZWLJUZ&ll=${latlon}&query=${searchQuery}&radius=100000&limit=10&v=20200901`, (resp) => {
    let data = '';
    resp.on('data', (obj) => {
      data += obj;
    });
    resp.on('end', () => {

let parseData = JSON.parse(data).response.venues
//======Sends-Data-Back======//
    callBack(parseData)

    });
  }).on("error", (err) => {
    console.log("Error: " + err.message);
  })
}else{console.log('Warning,Somthing weird')}
})
})

}

let secondMapsRoute = (ids,callBack) =>{



let promises = Promise.all(
  //Slice for a limiter//
    ids.slice(0,2).map((y,i)=>{
      return https.get(`https://api.foursquare.com/v2/venues/${y}?client_id=CRK3M3QSQ4SSNTAJ34HBSHLYURAPOYHYQ0PVJHKTSNCPIYC2&client_secret=ZRZQNU3GQY3FXA4L2ASD5G03AF0RS34CAATEIMBJHJZWLJUZ&v=20200901`, (resp) => {
        let data = '';
        resp.on('data', (obj) => {
          data += obj;
        });
        resp.on('end', () => {

let parseData = JSON.parse(data).response.venue
//=============Sends back venue data=======//
  callBack(parseData)
      });
    }).on("error", (err) => {
      console.log("Error: " + err.message);
    })


    })


  ).then(x=>{
    //====Opportunity for later feature===//
  })

}




app.put('/maps', isLoggedIn, function(req,res){
let vacationId = req.body.vacation
let city = req.body.city
let searchQuery = req.body.search.replace(/ /g,'%20')

res.send(mapsRoute(vacationId,city,searchQuery))
});

app.post('/newVacation', isLoggedIn, function(req, res) {
//Save Vacation
  db.collection('vacations').save(
    {
      planner: req.user._id,
      name: req.body.name,
      location: req.body.location,
      localName: req.body.localName,
    }, (err, result) => {
      if (err) {
        res.end(`You got an error here -> ${err}`)
        res.status(500)
        return
      }
      console.log('saved to database')

//Find ID in Vacation
db.collection('vacations').find({
  planner: req.user._id,
  name: req.body.name,
}).toArray((err, result3) => {
  if (err) return console.log(err)
  console.log(result3[0])
let pics = ['https://i.imgur.com/8J8Jow7.jpg','https://i.imgur.com/Lqt5gJ2.jpg']
//Save Event
  db.collection('events').save(
    {
      vacationId: result3[0]._id,
      vacationName: result3[0].name,
      planner: req.user._id,
      name: 'Arriving at '+ req.body.localName,
      link: '#',
      dateTime: '',
      img: pics[Math.floor(Math.random()*2)],
      category: ['Vacation Started','https://i.imgur.com/VjKWG1G.png'],
      location: req.body.location,
      localName: req.body.localName,
      distance: '0',
    }, (err, result) => {
      if (err) {
        res.end(`You got an error here -> ${err}`)
        res.status(500)
        return
      }
      console.log('saved to database')

// TODO: One of these are extra, if you have some time. Please come back and refactor//

      db.collection('events').find({
        'vacationId': result3[0]._id
      }).toArray((err, result2) => {
        if (err) return console.log(err)
        res.send(result3[0]._id)
      })
    })
  })
})

});


app.post('/vacation/newEvent', isLoggedIn, function(req, res) {

  db.collection('events').save(
    {
      planner: req.user._id,
      vacationId: ObjectId(req.body.id),
      name: req.body.name,
      link: req.body.link,
      dateTime: req.body.dateTime,
      img: req.body.img||'https://placekitten.com/',
      category: req.body.category,
      distance: req.body.distance,
      localName: req.body.location,
    }, (err, result) => {
      if (err) {
        res.end(`You got an error here -> ${err}`)
        res.status(500)
        return
      }
      console.log('saved to database')
    }
  )

res.redirect()

});

app.get('/browse/:query/:vacationId', isLoggedIn, function(req, res) {

    let query = req.params.query
    let vId = ObjectId(req.params.vacationId)
    mapsRoute(vId,'city',query.replace(/ /g,'%20'),(parseData)=>{
    let cards=[]
    console.log(parseData.map(x=>x.id))
    secondMapsRoute(parseData.map(x=>x.id),(extraData)=>{
      cards.push(extraData)
    })
    setTimeout(()=>{
      res.render('browse.ejs', {
        user : req.user,
        cards: parseData.filter(x=>x.categories[0]!==undefined).sort((a,b)=>a.location.distance-b.location.distance).slice(0,2),
        id:vId,
        extraData: cards
      })


    },1000)
//     https.get(`https://api.foursquare.com/v2/venues/${parseData[0].id}?client_id=CRK3M3QSQ4SSNTAJ34HBSHLYURAPOYHYQ0PVJHKTSNCPIYC2&client_secret=ZRZQNU3GQY3FXA4L2ASD5G03AF0RS34CAATEIMBJHJZWLJUZ&v=20200901`, (resp) => {
//       let data = '';
//       resp.on('data', (obj) => {
//         data += obj;
//       });
//       resp.on('end', () => {
// let extraData = JSON.parse(data)
// let allData = (extraData.response.venue)
// let city = (extraData.response.venue.location.city)
// let state = (extraData.response.venue.location.state)
// let img = extraData.response.venue.bestPhoto.prefix+extraData.response.venue.bestPhoto.width+extraData.response.venue.bestPhoto.suffix
// let category = [extraData.response.venue.categories[0].name,extraData.response.venue.categories[0].icon.prefix+64+extraData.response.venue.categories[0].icon.suffix]
// let url = extraData.response.venue.url
// let canon = extraData.response.venue.canonicalURL
// console.log(allData)
// console.log(city,state,img,category)
// console.log(url,canon)
// // let city = extraData.location.city
// // let state = extraData.location.state
// // let img = extraData.bestPhoto.prefix+extraData.bestPhoto.width+extraData.bestPhoto.suffix
// // let category = [extraData.categories[0].name,extraData.categories[0].icon.prefix+64+extraData.categories[0].icon.suffix]
// // let url = extraData.url
// // let canon = extraData.canonicalURL
//     // console.log(city,state,img,category,url,canon)
//     // console.log(data.response.venue.url)
//     // console.log(data.response.venue.canonicalURL)
//     // console.log(data.response.venue.bestPhoto.prefix+data.response.venue.bestPhoto.width+data.response.venue.bestPhoto.suffix)
//
//
//     });
//   }).on("error", (err) => {
//     console.log("Error: " + err.message);
//   })

    })


});

app.get('/vacation/:vacationId', isLoggedIn, function(req, res) {
    let vId = ObjectId(req.params.vacationId)
    db.collection('events').find({'vacationId': vId}).toArray((err, result) => {
      if (err) return console.log(err)
      res.render('home/vacations.ejs', {
        user : req.user,
        events: result,
        id: req.params.vacationId,
      })
    })
});

app.get('/events/:eventId', isLoggedIn, function(req, res) {
    let eventId = ObjectId(req.params.eventId)
    db.collection('events').find({'_id': eventId}).toArray((err, result) => {
      if (err) return console.log(err)
      res.render('event.ejs', {
        user : req.user,
        event: result,
        id: eventId,
      })
    })
});








// LOGOUT ==============================
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
