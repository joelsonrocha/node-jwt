const express = require("express");
const cors = require('cors');
require("dotenv/config");
const jwt = require("jsonwebtoken");
const app = express();
var corsOptions = {
  origin: 'http://localhost:8080',
  optionsSuccessStatus: 200, // For legacy browser support
  methods: "GET, PUT",
}
app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("<h1>Servidor OK</h1>");
});

//authentication
app.post("/login", (req, res, next) => {
  console.log('login');
  //verifica se o usuário existe no banco
  if (req.body.user === "joelson" && req.body.password === "123456") {
    //auth ok
    const id = 46; //id do usuário usado para criar o token
    const token = jwt.sign({ id }, process.env.SECRET, {
      expiresIn: 31536000, // tempo de expiração do token em segundos, aqui é um ano.
    });
    return res.json({ auth: true, token: token });
  }

  res.status(500).json({ message: "Login inválido!" });
});

app.post("/logout", function (req, res) {
  res.json({ auth: false, token: null });
});

function verifyTokenJWT(req, res, next) {
  const token = req.headers["x-access-token"];
  if (!token)
    return res.status(401).json({ auth: false, message: "Nenhum token informado" });

  jwt.verify(token, process.env.SECRET, function (err, decoded) {
    if (err)
      return res
        .status(500)
        .json({ auth: false, message: "Falha ao verificar token." });
    req.userId = decoded.id;
    next();
  });
}

app.get('/list', verifyTokenJWT, (req, res, next) => { 
  console.log("Sucesso list!");
  res.json([{id:1,nome:'Joelson'}]);
})

module.exports = app;
