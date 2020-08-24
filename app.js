const express = require('express');
const app = express();
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.urlencoded({
    extended: true
}));



// Add the credentials to access your database
const mysql = require('mysql');
const connection = mysql.createConnection({
    host: 'database',
    port: '3306',
    database: 'knjige5',
    user: 'dmilet',
    password: '1234',
    insecureAuth: true
});

/*connection.connect((err) => {
    if (err) {
        console.log('failed!')
        console.log(err)
    }
    else
        console.log('Connected!');
});*/

let retries = 3


const interval = setInterval(() => connection.connect((err) => {
    if (!!err && retries > 0) {
        console.log('connection failed')
        console.log(err)
        retries -= 1
        console.log("Retries left: ", retries)
    }
    else if (!err && retries > 0) {
        console.log('Connected!');
        clearInterval(interval)
    }
    else {
        console.log("Connection failed!")
        clearInterval(interval)
        throw err
    }
}), 2000)




/*
// Podaci koji se daju server
//const books = [
    //{id:1, naslov:'Uspavanka', autor: 'Leila Slimani'},
    //{id:2, naslov:'Kronosova žetva', autor: 'Mojca Kuerdej'},
    //{id:3, naslov:'Krivo je jugo', autor: 'Nataša Draginić'},
    //{id:4, naslov:'Žene koje kupuju cvijeće', autor: 'Vanessa Montfort'},
    //{id:5, naslov:'Jakovljeve ljestve', autor: 'Ljudmila Ulicka'},
    //{id:6, naslov:'Nit koja nas veže', autor: 'Samanta Schweblin'},
    //{id:7, naslov:'Knjige Jakubove', autor: 'Olga Tokarczuk'},
    //{id:8, naslov:'Lisica', autor: 'Dubravka Ugresšić'},
//]
*/
// READ REQUEST HANDLER
// DISPLAY THE MESSAGE WHEN THE URL CONSIST OF '/'


// GET METODA
app.get('/', (req, res) => {    // req = HTTP request argument
    res.send('Dobrodosli u REST API ovog ljeta'); // res = HTTP response argument
});
app.listen(8080, () => {
    console.log('MY REST API running on port 8080!');
});
app.get('/knjige', (req, res) => {
    connection.query('SELECT * FROM knjizice', (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});


app.get('/knjige/:id', (req, res) => {
    connection.query('SELECT * FROM knjizice WHERE knjiga_id = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send(rows);
        else
            console.log(err);
    })
});



// DELETE METODA

app.delete('/knjige/:id', (req, res) => {
    connection.query('DELETE FROM `knjizice` WHERE `knjiga_id` = ?', [req.params.id], (err, rows, fields) => {
        if (!err)
            res.send('Deleted successfuly.');
        else
            console.log(err);
    })
});


// POST METODA

//rest api to create a new record into mysql database
app.post('/knjige', bodyParser.json(), (req, res) => {
    console.log(req.body);
    //var {knjiga_id, naslov, autor} = req.body;
    var knjiga_id = req.body.knjiga_id;
    var naslov = req.body.naslov;
    var autor = req.body.autor;
    console.log(req.body.knjiga_id);
    //if (knjiga_id && naslov && autor)
        connection.query('INSERT INTO knjizice (knjiga_id, naslov, autor) VALUES (?, ?, ?)',[knjiga_id, naslov, autor], (err, rows, fields) => {
            //console.log(err);
        })
    //else
        // console.log(req.body);
    
});

 
 // UPDATE METODA

//rest api to update record into mysql database
app.put('/knjige/:id',bodyParser.json(),(req, res) => {
    console.log(req.body);
    var knjiga_id = req.body.knjiga_id;
    var naslov = req.body.naslov;
    var autor = req.body.autor;
    console.log(req.body.knjiga_id);
   connection.query('UPDATE knjizice SET knjiga_id=?,naslov=?,autor=? where knjiga_id=?', [knjiga_id,naslov,autor,req.params.id], function (error, results, fields) {
	  if (error) throw error;
	  res.end(JSON.stringify(results));
	});
});
 





/*
// 2. POST METHOD
// DODAVANJE NOVE KNJIGE
app.post('/api/knjige', (req, res)=> {
    const knjiga = {
        id: books.length +1,
        naslov: req.body.naslov,
        autor: req.body.autor ,
    };

    books.push(knjiga);
    res.send(knjiga);

});

// Ispis knjiga za ovo ljeto
//  1. GET METHOD
app.get('/api/knjige', (req,res) => {
    res.send(books);
});

// POST METHOD
//app.post('/api/knjige',(req,res) => {
    //code to perform particular action.
    //To access POST variable use req.body()methods.
   // console.log(req.body);
//});


// Dobivanje informacija o pojedinoj knjizi na temelju njenog id-a
app.get('/api/knjige/:id', (req, res) => {
    const knjiga = books.find(c => c.id === parseInt(req.params.id));
    res.send(knjiga);
});
// 3.UPDATE METHOD
// AZURIRANJE PODATAKA
app.put('/api/knjige/:id', (req, res) => {
    const knjiga = books.find(c=> c.id === parseInt(req.params.id));

    knjiga.id = req.body.id
    knjiga.naslov = req.body.naslov;
    knjiga.autor = req.body.autor;
    res.send(knjiga);

});

//4.DELETE METHOD
// BRISANJE PODATAKA
app.delete('/api/knjige/:id', (req, res) => {
    const knjiga = books.find(c => c.id === parseInt(req.params.id));

    const index = books.indexOf(knjiga);
    books.splice(index,1);

    res.send(knjiga);
});



//app.get('/', (req, res) =>
    //res.send('hello dino fesb'));

app.listen(3000, () => {
    console.log('My REST API running on port 3000!');
});
*/


