var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var nodemailer = require("nodemailer");

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride());
// habilitacion de cors
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, agencia, authorization, clientid, clientsecret, pid, rid, uid, uname, usector"
    );
    next();
});

const PORT = process.env.PORT || 3000;
//start application server on port 3000
app.listen(PORT, console.log(`The server started on port ${PORT}`));

app.get("/", function(req, res) {
    console.log("prueba servicio");
    res.send("hola mundo");
});

// define a sendmail endpoint, which will send emails and response with the corresponding status
app.post("/sendmail", (req, res) => {
    console.log("request came", req.body);
    var user = req.body;
    sendMail(user, (err, info) => {
        if (err) {
            console.log(err);
            res.status(400);
            res.send({ error: "Failed to send email" });
        } else {
            console.log("Email has been sent");
            res.send(info);
        }
    });
});

var sendMail = (user, callback) => {
    var transporter = nodemailer.createTransport({
        // host: "smtp.gmail.com",
        host: "smtp.live.com",
        port: 587,
        secure: false,
        auth: {
            user: "josemaria_llanos@hotmail.com",
            pass: "dragon14",
        },
    });
    let date = new Date();
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    var mailOptions = {
        from: `<josemaria_llanos@hotmail.com>`, //"<Sender’s name>", "<Sender’s email>"
        to: `<alexr.torob@hotmail.com>`,
        subject: `${user.codigoCaso}`,
        html: ` <div class="row no-gutters border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
                    <div class="col p-4 d-flex flex-column position-static">
                    <h3 class="mb-0"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;"><span style="color: blue;">Caso:</span>  ${user.codigoCaso}</font></font></h3>
                    <h3 class="mb-0"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;"><span style="color: blue;"> Fecha de envio: </span>${day}/${month}/${year}</font></font></h3>
                    <br>
                    <h3 class="mb-0"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;"><span style="color: blue;">Cliente:</span> ${user.nombres}</font></font></h3> 
                    <h3 class="mb-0"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;"><span style="color: blue;">Celular:</span> ${user.celular}</font></font></h3>
                    <h3 class="mb-0"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;"><span style="color: blue;">Correo:</span> ${user.correo}</font></font></h3>
                    <h3 class="mb-0"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;"><span style="color: blue;">Descripción:</span> </font></font></h3>
                    <p class="card-text mb-auto"><font style="vertical-align: inherit;"><font style="vertical-align: inherit;">${user.descripcion}</font></font></p>                    
                    </div>                    
                </div>`,
    };

    transporter.sendMail(mailOptions, callback);
};