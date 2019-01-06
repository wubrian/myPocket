"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("./knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");

app.use(cookieParser());

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2', 'key3'],
  maxAge: 24 * 60 * 60 * 1000 //24 hour expiry..
}));


app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));

app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));

// listen to port...
app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});

app.get("/register", (req, res) => {
  let templateVars = {
    cookie: req.session.userCookie
  }
  res.render("register", templateVars);
});


// Helped by DavidLacho L-labs here with the promises and
// issuing callbacks this certain way. 
function findUser(inputEmail, callback){
  knex.select('email', 'password')
  .from('users')
  .where('email', inputEmail)
  .then((resp) => {
    callback(null, resp);
  })
  .catch((err)=> {
    console.log('happening here');
    callback(err);
  });
}

function findLikes(){

}

app.post('/register', (req, res) => {
  let email = req.body.email;
  if (req.body.email === '' || req.body.password === '' || req.body.name === '') {
    res.send("Forms can't be left empty");
  } else {
    findUser(req.body.email, (err, goodUser) => {
      console.log("hjhh: ", goodUser);
      if (err) {
        res.send('there was an error', err);
      }
      if (goodUser.length >= 1) {
        res.status(403).send("Another user is already registered with this email ID");
      } else {
        knex('users')
          .insert({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          })
          .asCallback((err) => {
            if (err) {
              console.log(err);
            }
            req.session.userCookie = email;
            res.redirect('/');
          })
      }
    });
  }
});

app.get("/login", (req, res) => {
  let templateVars = {
    cookie: req.session.userCookie
  }
  res.render("login", templateVars);
});

app.post('/login', (req, res) => {
  let email = req.body.email;
  let password = req.body.password;
  if (email === '' || password === '') {
    res.send("Forms can't be left empty");
  } else {
      findUser(req.body.email, (err, goodUser) => {
        console.log("booooo: ", goodUser[0]);
        if (err) {
          res.send("There was a bloody error.", err);
        }
        //Check if goodUser obj has more than 0 elements
        if (goodUser.length >= 1) {
          //if it does, check the password
          if(goodUser[0].password === req.body.password) {
            req.session.userCookie = email;
            res.redirect('/');
          } else {
            res.status(403).send("Sorry, wrong credentials. Please check again");
          }
          
        }
      })
    }
});

app.get('/logout', (req, res) => {
  //clear the cookies
  res.clearCookie('session');
  res.clearCookie('session.sig');

  //destroy the session
  res.session = null;

  res.redirect('/');
})

//home request
app.get("/", (req, res) => {
  const urlsTable = knex.select('urls.id','title','description','image','users.name','categories.category','email','password')
  .from('urls')
  .leftJoin('categories','urls.category_id', 'categories.id')
  .leftJoin('users','urls.user_id', 'users.id')
  .then((event) => {
     return event;
  }).catch((err) => {
    console.log(err);
  });

  const likesTable = knex.select('url_id')
  .count('id')
  .from('likes')
  .groupBy('url_id')
  .then( (event) => {
    return event;
  }).catch((err) => {
    console.log(err);
  });

  const ratingsTable = knex.select('url_id')
  .avg('rating')
  .from('ratings')
  .groupBy('url_id')
  .then( (event) => {
    return event;
  }).catch((err) => {
    console.log(err);
  });

  const commentsTable = knex.select('*')
  .from('comments')
  .then( (event) => {
    return event;
  }).catch((err) => {
    console.log(err);
  });

  const everythingLoaded = Promise.all([likesTable, urlsTable,ratingsTable,commentsTable])
  .then((record) => {
    // console.log('likesTable' , record[0]);
    // console.log('userstable' , record[1]);
    // console.log('ratingsTable', record[2]);
    // console.log('commentsTable', record[3])
    let templatevars = {
      likes: record[0],
      urls: record[1],
      rates: record[2],
      comments: record[3],
      cookie: req.session.userCookie
    }
    res.render("index", templatevars);
  })
});


//create comment
app.post("/comment", (req, res) => {
  const comment = req.body.inputText;
  const url = req.body.attribute;
  const user = req.session.userCookie;
  if(user){
    const urlID = knex.select('id')
    .from('urls')
    .where('title', 'like', `${url}`)
    .then((event) => {
      return event;
    }).catch((err) => {
      console.log(err);
    });

    const userID = knex.select('id')
    .from('users')
    .where('email', 'like', `${user}`)
    .then( (event) => {
      return event;
    }).catch((err) => {
      console.log(err);
    });

  const everythingLoaded = Promise.all([urlID, userID])
  .then((record) => {
    console.log('urlID' , record[0][0].id);
    const urlID = record[0][0].id;
    console.log('user ID' , record[1][0].id);
    const userID = record[1][0].id;
      knex('comments').insert({
        url_id: urlID,
        user_id: userID,
        text: comment,
    }).then(() => {
      res.sendStatus(200);
    })
    .catch((err) => {
      console.log(err);
    });  
    })
  }
  else{
    res.send('Please log in to comment');
  }
  })
 

//create likes
app.post("/likes", (req, res) => {
  const url = req.body.attribute;
  const user = req.session.userCookie;
  if(user){
  const urlID = knex.select('id')
  .from('urls')
  .where('title', 'like', `${url}`)
  .then((res) => {
    return res;
  }).catch((err) => {
    console.log(err);
  });

  const userID = knex.select('id')
  .from('users')
  .where('email', 'like', `${user}`)
  .then( (res) => {
    return res;
  }).catch((err) => {
    console.log(err);
  });

  const everythingLoaded = Promise.all([urlID, userID])
  .then((record) => {
    console.log('urlID' , record[0][0].id);
    const urlID = record[0][0].id;
    console.log('user ID' , record[1][0].id);
    const userID = record[1][0].id;
      knex('likes').where({
        url_id: `${urlID}`,
        user_id: `${userID}`,
    }).then((event) =>{
      if(event.length === 0){
        //insert like
        knex('likes').insert({
          url_id: `${urlID}`,
          user_id: `${userID}`,
        }).then( () => {
          res.sendStatus(200);
        })
        .catch((err) => {
          console.log(err);
        })
      }else{
        //delete a like
        knex('likes').where({
          url_id: `${urlID}`,
          user_id: `${userID}`,
      }).del()
      .then( () => {
        res.sendStatus(200);
      })
      .catch((err) => {
        console.log(err);
      })
      }
    })
    .catch((err) => {
      console.log(err);
    });  
    })
   }
  else{
    res.send('Please log in to like');
  }
     
});

//create rating
app.post("/rating", (req, res) => {
  const userRating = req.body.rating;
  const url = req.body.attribute;
  const user = req.cookies["userCookie"];
      
  if(user){
    const urlID = knex.select('id')
    .from('urls')
    .where('title', 'like', `${url}`)
    .then((event) => {
      return event;
    }).catch((err) => {
      console.log(err);
    });

    const userID = knex.select('id')
    .from('users')
    .where('email', 'like', `${user}`)
    .then( (event) => {
      return event;
    }).catch((err) => {
      console.log(err);
    });
    const everythingLoaded = Promise.all([urlID, userID])
    .then((record) => {
      console.log('urlID' , record[0][0].id);
      const urlID = record[0][0].id;
      console.log('user ID' , record[1][0].id);
      const userID = record[1][0].id;
        knex('ratings').where({
          url_id: `${urlID}`,
          user_id: `${userID}`,
      }).then((event) =>{
        if(event.length === 0){
          //insert rating coloumn
          knex('ratings').insert({
            url_id: `${urlID}`,
            user_id: `${userID}`,
            rating: userRating
          }).then( () => {
            res.sendStatus(200);
          })
          .catch((err) => {
            console.log(err);
          })
        }else{
          //replace rating 
          knex('ratings').where({
            url_id: `${urlID}`,
            user_id: `${userID}`,
        }).update('rating', `${userRating}`)
        .then( () => {
          res.sendStatus(200);
        })
        .catch((err) => {
          console.log(err);
        })
        }
      })
      .catch((err) => {
        console.log(err);
      });  
      })
     }
  
  else{
    res.send('Please log in to rate');
  }
  
});

// Search request
app.post("/search", (req, res) => {
  const searchText = req.body.search;
  console.log(searchText)
  const urlsTable = knex.select('title','description','image','users.name','categories.category','email','password')
  .from('urls')
  .leftJoin('categories','urls.category_id', 'categories.id')
  .leftJoin('users','urls.user_id', 'users.id')
  .where('title', 'like', `%${searchText}%`)
  .orWhere('description', 'like', `%${searchText}%`)
  .then((event) => {
     return event;
  }).catch((err) => {
    console.log(err);
  });

  const likesTable = knex.select('url_id')
  .count('id')
  .from('likes')
  .groupBy('url_id')
  .then( (event) => {
    return event;
  }).catch((err) => {
    console.log(err);
  });

  const ratingsTable = knex.select('url_id')
  .avg('rating')
  .from('ratings')
  .groupBy('url_id')
  .then( (event) => {
    return event;
  }).catch((err) => {
    console.log(err);
  });

  const commentsTable = knex.select('*')
  .from('comments')
  .then( (event) => {
    return event;
  }).catch((err) => {
    console.log(err);
  });

  const everythingLoaded = Promise.all([likesTable, urlsTable,ratingsTable,commentsTable])
  .then((record) => {
    // console.log('likesTable' , record[0]);
    // console.log('userstable' , record[1]);
    // console.log('ratingsTable', record[2]);
    // console.log('commentsTable', record[3]);
    let templatevars = {
      likes: record[0],
      urls: record[1],
      rates: record[2],
      comments: record[3],
      cookie: req.session.userCookie
    }

    res.render("index", templatevars);
  })
});

//engineering category
app.get("/engineering", (req,res) => {

  const engTable = knex.select('urls.id','title','description','image','users.name','categories.category','email','password')
  .from('urls')
  .leftJoin('categories','urls.category_id', 'categories.id')
  .leftJoin('users','urls.user_id', 'users.id')
  .where('category', 'like', 'Engineering')
  .then((event) => {
    return event;
  }).catch((err) => {
    console.log(err);
  });
  const likesTable = knex.select('url_id')
  .count('id')
  .from('likes')
  .groupBy('url_id')
  .then( (event) => {
    return event;
  }).catch((err) => {
    console.log(err);
  });

  const ratingsTable = knex.select('url_id')
  .avg('rating')
  .from('ratings')
  .groupBy('url_id')
  .then( (event) => {
    return event;
  }).catch((err) => {
    console.log(err);
  });

  const commentsTable = knex.select('*')
  .from('comments')
  .then( (event) => {
    return event;
  }).catch((err) => {
    console.log(err);
  });

  const everythingLoaded = Promise.all([likesTable, engTable,ratingsTable,commentsTable])
  .then((record) => {
    // console.log('likesTable' , record[0]);
    // console.log('engTable' , record[1]);
    // console.log('ratingsTable', record[2]);
    // console.log('commentsTable', record[3]);
    let templatevars = {
      likes: record[0],
      urls: record[1],
      rates: record[2],
      comments: record[3],
      cookie: req.session.userCookie
    }
    res.render("engineering", templatevars);
  })

});

//web development category
app.get("/webDev", (req,res) => {
  const webTable = knex.select('urls.id','title','description','image','users.name','categories.category','email','password')
  .from('urls')
  .leftJoin('categories','urls.category_id', 'categories.id')
  .leftJoin('users','urls.user_id', 'users.id')
  .where('category', 'like', 'Web Dev')
  .then((event) => {
    return event;
  }).catch((err) => {
    console.log(err);
  });
  const likesTable = knex.select('url_id')
  .count('id')
  .from('likes')
  .groupBy('url_id')
  .then( (event) => {
    return event;
  }).catch((err) => {
    console.log(err);
  });

  const ratingsTable = knex.select('url_id')
  .avg('rating')
  .from('ratings')
  .groupBy('url_id')
  .then( (event) => {
    return event;
  }).catch((err) => {
    console.log(err);
  });

  const commentsTable = knex.select('*')
  .from('comments')
  .then( (event) => {
    return event;
  }).catch((err) => {
    console.log(err);
  });

  const everythingLoaded = Promise.all([likesTable, webTable,ratingsTable,commentsTable])
  .then((record) => {
    // console.log('likesTable' , record[0]);
    // console.log('webTable' , record[1]);
    // console.log('ratingsTable', record[2]);
    // console.log('commentsTable', record[3]);
    let templatevars = {
      likes: record[0],
      urls: record[1],
      rates: record[2],
      comments: record[3],
      cookie: req.session.userCookie
    }
    res.render("webDev", templatevars);
  })
});

//computer science category
app.get("/cs", (req,res) => {
  const csTable = knex.select('urls.id','title','description','image','users.name','categories.category','email','password')
  .from('urls')
  .leftJoin('categories','urls.category_id', 'categories.id')
  .leftJoin('users','urls.user_id', 'users.id')
  .where('category', 'like', 'CS')
  .then((event) => {
    return event;
  }).catch((err) => {
    console.log(err);
  });
  const likesTable = knex.select('url_id')
  .count('id')
  .from('likes')
  .groupBy('url_id')
  .then( (event) => {
    return event;
  }).catch((err) => {
    console.log(err);
  });

  const ratingsTable = knex.select('url_id')
  .avg('rating')
  .from('ratings')
  .groupBy('url_id')
  .then( (event) => {
    return event;
  }).catch((err) => {
    console.log(err);
  });

  const commentsTable = knex.select('*')
  .from('comments')
  .then( (event) => {
    return event;
  }).catch((err) => {
    console.log(err);
  });

  const everythingLoaded = Promise.all([likesTable, csTable,ratingsTable,commentsTable])
  .then((record) => {
    // console.log('likesTable' , record[0]);
    // console.log('csTable' , record[1]);
    // console.log('ratingsTable', record[2]);
    // console.log('commentsTable', record[3]);
    let templatevars = {
      likes: record[0],
      urls: record[1],
      rates: record[2],
      comments: record[3],
      cookie: req.session.userCookie
    }
    res.render("cs", templatevars);
  })
});

// MyResource page
app.get("/myresource", (req, res) => {

  const email = req.session.userCookie;
  const myReasourceTable = knex.select('urls.id','title','description','image','users.name','categories.category','email','password')
  .from('urls')
  .leftJoin('categories','urls.category_id', 'categories.id')
  .leftJoin('users','urls.user_id', 'users.id')
  .where('email', 'like', `${email}`)
  .then((event) => {
    return event;
  }).catch((err) => {
    console.log(err);
  });
  const likesTable = knex.select('url_id')
  .count('id')
  .from('likes')
  .groupBy('url_id')
  .then( (event) => {
    return event;
  }).catch((err) => {
    console.log(err);
  });

  const ratingsTable = knex.select('url_id')
  .avg('rating')
  .from('ratings')
  .groupBy('url_id')
  .then( (event) => {
    return event;
  }).catch((err) => {
    console.log(err);
  });

  const commentsTable = knex.select('*')
  .from('comments')
  .then( (event) => {
    return event;
  }).catch((err) => {
    console.log(err);
  });

  const everythingLoaded = Promise.all([likesTable, myReasourceTable,ratingsTable,commentsTable])
  .then((record) => {
    // console.log('likesTable' , record[0]);
    // console.log('myReasourceTable' , record[1]);
    // console.log('ratingsTable', record[2]);
    // console.log('commentsTable', record[3]);
    let templatevars = {
      likes: record[0],
      urls: record[1],
      rates: record[2],
      comments: record[3],
      cookie: req.session.userCookie
    }
    res.render("myresource", templatevars);
  });

});

