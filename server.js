var express = require('express'),
    stylus = require('stylus'),
    mongoose = require('mongoose');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var app = express();
var bodyParser = require('body-parser');

function compile(src,path){
    return stylus(src).set('filename',path);
}

//Configuration
app.set('views', __dirname + '/server/views');
app.set('view engine', 'jade');
app.use(bodyParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(stylus.middleware({
    src : __dirname + '/public',
    compile : compile
}));
app.use(express.static(__dirname + '/public'))

//MongoDB Connect and Model
//mongoose.connect('mongodb://localhost/geekguru');
mongoose.connect('mongodb://renishb10:shivashiva@ds039960.mongolab.com:39960/geekguru');
var db = mongoose.connection;
db.on('error',console.error.bind(console,'connection error...'));
db.once('open',function callback(){
   console.log('GeekGuru db opened') ;
});
var messageSchema = mongoose.Schema({message : String});
var Message = mongoose.model('Message',messageSchema);
var mongoMessage;
Message.findOne().exec(function(err,messageDoc){
    mongoMessage = messageDoc.message;
});

//Routing
app.get('/partials/:partialPath',function(req,res){
    res.render('partials/' + req.params.partialPath)
})
app.get('*', function (req, res) {
    res.render('index',{
        mongoMessage : mongoMessage
    });
    
});

//Port Listening
var port = process.env.PORT || 3030 ;
app.listen(port);
console.log("You are at " + env);
console.log("Our Technical Training Server is running at " + port);