import express from 'express';
import { engine } from 'express-handlebars';
import bodyParser from 'body-parser';
import fetch from 'node-fetch';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configuração do body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Configuração do handlebars
app.engine('handlebars', engine({ defaultLayout: 'principal' }));
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static(path.join(__dirname, '/publico')));

// Rota principal
app.get('/', (req, res) => {
  fetch('http://localhost:3000/clientes', { method: 'GET' })
    .then((resposta) => resposta.json())
    .then((resposta) => res.render('inicio', { dados: resposta }));
});

app.post('/cadastrar', function (req, res){
    let nome = req.body.nome;
    let idade = req.body.idade;

    let dados = {'nome':nome, 'idade':idade};

    fetch('http://localhost:3000/clientes', {
        method:'POST',
        body:JSON.stringify(dados),
        headers:{'Content-Type':'application/json'}
    })
    .then(res.redirect('/'));
})

app.get('/selecionar/:id', function(req, res){
    let id = req.params.id;

    fetch('http://localhost:3000/clientes/'+id, {method:'GET'})
    .then(resposta => resposta.json())
    .then(resposta => res.render('selecionar', {dados:resposta}))
});

app.post('/editar', function(req, res){
    let nome = req.body.nome;
    let idade = req.body.idade;
    let id = req.body.id;

    fetch('http://localhost:3000/clientes/'+id, {
        method:'PUT',
        body:JSON.stringify({'nome':nome, 'idade':idade}),
        headers:{'Content-Type':'application/json'}
    })
    .then(res.redirect('/'));
});

app.get('/remover/:id', function(req, res){
    let id = req.params.id;

    fetch('http://localhost:3000/clientes/'+id, {method:'DELETE'})
    .then(res.redirect('/'));
});


app.listen(8080);
