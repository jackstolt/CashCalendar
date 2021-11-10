
var express = require('express'); 
var bodyParser = require('body-parser'); 
var flash = require('connect-flash')
var session = require('express-session');
var app = express();
app.use(bodyParser.json());              
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(session({ secret: 'hello' })); 
var cookieParser=require('cookie-parser');
app.use(cookieParser());
app.use(flash());
app.use(function(req, res, next){
    res.locals.success = req.flash('success');
    res.locals.errors = req.flash('error');
    next();
});
require("dotenv").config();


var pgp = require('pg-promise')();

const PORT = process.env.PORT || 3000;


const devConfig = {
    user: process.env.PG_USER,
    //password: process.env.PG_PASSWORD,  //ONLY FOR DAWSON COMMENT THIS OUT IF I FORGET TO
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    port: process.env.PG_PORT
  };

  const proConfig = {
    connectionString: process.env.DATABASE_URL, //heroku addons
    ssl: {
        rejectUnauthorized: false
      }
  };
  
//console.log(process.env.DATABASE_URL);

  const dbConfig = process.env.NODE_ENV === "production" ? proConfig : devConfig;


var db = pgp(dbConfig);




app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/'));

app.get('/', function(req, res) {
	res.redirect('/home');
});

app.get('/home', function(req, res) {
	res.render('home');
});

app.post('/cal/delete/:id', function(req, res) {
    let user=req.cookies.user;
    if(user){
        let id=req.params.id;
        var query = `delete from transaction where id='${id}';`;
        db.task('delete-trans', task => {
            return task.batch([
                task.any(query)
            ]);
        })
        .then(function(data){;
            res.redirect('/cal');
        })
    }
    else{
        res.redirect('/login');
    }
});

app.get('/cal/transaction', function(req, res) {
    let user=req.cookies.user;
    if(user){
        var query = `select * from transaction where username='${user}';`; 
        db.task('get-everything', task => {
            return task.batch([
                task.any(query)
            ]);
        })
        .then(function(data){
            //console.log(data);
            res.json({rows: data});
        })
    }
    else{
        res.redirect('/login');
    }
});

app.get('/cal/premium', function(req, res) {
    let user=req.cookies.user;
    if(user){
        var query = `select * from users where username='${user}';`; 
        db.task('get-everything', task => {
            return task.batch([
                task.any(query)
            ]);
        })
        .then(function(data){
            //console.log(data);
            res.json({rows: data});
        })
    }
    else{
        res.redirect('/login');
    }
});

app.get('/cal', function(req, res) {
    let user=req.cookies.user;
    if(user){
        //console.log(req.cookies)
        var query = `select * from transaction where username='${user}';`; 
        db.task('get-everything', task => {
            return task.batch([
                task.any(query)
            ]);
        })
            .then(function (rows) {
                res.render('cal',{
                    my_title: "Calendar",
                    data: rows
                })

            })
            .catch(function (err) {
                console.log('error', err);
                res.redirect('/home');
            })
    }
    else{
        res.redirect('/login');
    }
});




app.post('/cal/add', function(req, res) {
    let user=req.cookies.user;
    if(user){
        var month_trans=Number(req.body.month_trans)+1;
        if(month_trans < 10){
            month_trans='0'+month_trans.toString();
        }
        var year_trans = req.body.year_trans;
        var date_trans = req.body.date_trans;
        var desc = req.body.desc;
        var price = req.body.price;
        var category = req.body.category;
        //console.log(req.body);
        var d=year_trans.toString()+month_trans.toString()+date_trans.toString();
        //console.log(`insert into transaction(dot, description, price, category) values (TO_STRING('${d}','YYYYMMDD'),'${desc}',TO_NUMBER('${price}','FM'), '${category}');`);
        var insert_statement=`insert into transaction(dot, description, price, category, username) values (TO_DATE('${d}','YYYYMMDD'),'${desc}',${price}, '${category}', '${user}');`;
        //console.log(insert_statement);
        
        var all_trans =`select * from transaction where username='${user}';`;  
        //console.log("yoyoyo")
        db.task('get-everything', task => {
            return task.batch([
                task.any(insert_statement),
                task.any(all_trans)
            ]);
        })
        .then(info => {
            res.redirect('/cal');
        }) 
        .catch(err => { 
                console.log('error', err);
                res.redirect('/home');
        });
    }
    else{
        res.redirect('/login');
    }
});

app.get('/signup', function(req, res) {
    var query='select username from users;';
    db.task('get-usernames', task => {
        return task.batch([
            task.any(query)
        ]);
    })
    .then(info => {
        //console.log("hello");
        res.render('signup',{
            my_title: "Sign up",
            data: info,
            inputs: {}
        })
    })
    .catch(err => { 
        console.log('error', err);
        res.redirect('/home');
    });

});

app.post('/signup', function(req, res){
    //console.log(req.body);
    var user = (req.body.user).toString();
    //console.log(user);
    var pw = (req.body.pass).toString();
    //console.log(pw);
    var name=req.body.name.toString();
    var email=req.body.email.toString();
    var prem=req.body.premium;
    //console.log(name,email,prem);
    var insert = `insert into users(username, password, name, email, premium) values ('${user}','${pw}','${name}','${email}', ${prem});`;
    // console.log(insert);
    db.task('get-everything', task => {
        return task.batch([
            task.any(insert)
        ]);
    })
    .then(info => {
        // console.log('signup');
        res.cookie('user',user);
        res.redirect('/cal');
    }) 
    .catch(err => { 
            console.log('error', err);
            errors='User already exists';
            res.render('signup', {
                locals: {errors},
                inputs: {name, pw, email, prem}
            })
    });
});

app.get('/logout', function(req, res){
    // console.log("logout");
    res.clearCookie('user');
    res.redirect('/home');
})


app.get('/login', function(req,res){
    if(typeof req.cookies.user != 'undefined' || req.cookies.user != null){
        // console.log(req.cookies.user);
        res.locals.errors={};
        res.redirect('/cal');
    }
    else{
        var query='select * from users;';
        db.task('get', task => {
            return task.batch([
                task.any(query)
            ])
        })
        .then(info => {
            // console.log(info);
            res.render('login');
        })
        .catch(err => { 
                console.log('error', err);
                res.send(db);
        });
    }
})


app.post('/login', function(req,res){
    if(typeof req.cookies.user != 'undefined' || req.cookies.user != null){
        // console.log(req.cookies.user);
        res.redirect('/home');
    }
    else{
        var username=req.body.username;
        var password=req.body.password;
        var query=`select count(*) from users where username='${username}' and password='${password}';`;
        db.task('get-everything', task => {
            return task.batch([
                task.any(query)
            ]);
        })
        .then(info => {
            // console.log('info:',info);
            // console.log(info[0][0]);
            if(info[0][0].count != 1){
                res.locals.errors= req.flash('error', 'User does not exist or password is incorrect');
                res.redirect('/login');
            }
            else{
                res.cookie('user',username);
                res.redirect('/cal');
            }
        }) 
        .catch(err => { 
                console.log('error', err);
                res.redirect('/home');
        });
    }
});


app.get('/profile', function(req,res){
    if(typeof req.cookies.user == 'undefined' || req.cookies.user == null){
        res.redirect('/login');
    }
    else{
        var username=req.cookies.user;
        var query=`select * from users where username='${username}';`;
        db.task('get-everything', task => {
            return task.batch([
                task.any(query)
            ]);
        })
        .then(info => {
            // console.log('info:',info);
            // console.log(info[0][0]);
            res.render('profile', {
                data: info[0][0]
            });
        }) 
        .catch(err => { 
                console.log('error', err);
                res.redirect('/home');
        });
    }
})

app.post('/profile', function(req,res){
    if(typeof req.cookies.user == 'undefined' || req.cookies.user == null){
        res.redirect('/login');
    }
    else{
        var username=req.cookies.user;
        var new_pass=req.body.change_password;
        var new_email=req.body.change_email;
        var premium=req.body.premium;
        var query=`update users set password='${new_pass}', email='${new_email}', premium=${premium} where username='${username}';`;
        //console.log(query);
        db.task('get-everything', task => {
            return task.batch([
                task.any(query)
            ]);
        })
        .then(info => {
            res.redirect('/profile');
        }) 
        .catch(err => { 
            console.log('error', err);
            res.redirect('/home');
        });
    }
})

console.log(`port ${PORT} is magic`);
app.listen(PORT);