const express = require('express')
const cors = require('cors') //permite requisições do front, via localhost
const bodyParser = require('body-parser') //utilizado para trabalhar/tratar dados do body da requisição
const knex = require('knex') //utilizado para fazer requisições para o BD
const bcrypt = require('bcrypt') //criptografar a senha

//Para maior segurança devo passar a requisição a API via post e nao no front porem, ao passar p/ o back-end ela deixa de funcionar aula (system security)
const signin = require('./controllers/signin')
const register = require('./controllers/register')

const db = knex({
    client: 'pg', //npm install pg    cli do knex para postgres
    connection: {
        host : '127.0.0.1',
        user : 'postgres', //user é o dono, quando faço a query no \d
        password : 'teste', //senha definida na instalação
        database : 'smart-brain'
    }
})

const app = express()

app.use(bodyParser.json()) //lembre-se 'use' serve para algum tipo de middleware
app.use(cors())


app.post('/signin', (req, res) => { signin.handleSignin(req, res, bcrypt, db) }) //signin, register e requisição a API foram utilizados diferente para mostrar a possibilidade de modularização no back end
app.post('/register', register.handleRegister(bcrypt, db)) //exemplo 2, observe a diferença no arquivo register
//app.post('/register', register.handleRegister(bcrypt,db)(req, res)) //exemplo 3, o arquivo register ficara igual está acima


app.get('/posts/:id', (req, res) => {
    const { id } = req.params

   db.select('*').from('users').where({
       id
   })
   .then(user => { //length foi usado pq sempre vou ter um array retornado, msm nao encontrando o id, sendo assim obtendo true!
       user.length ? res.json(user[0]) : res.send('Incorret ID')
    }
   )
   .catch(err => res.status(400).json('Sft')) 
})


app.put('/image', (req, res) => {
    const { id } = req.body   //repare que na requisição do profile, eu pego id do parametro/URL, aqui pego da requisição/body

    db('users')
        .where('id', '=', id)
        //.update({ entries: 20 }) Só usaria essa query para atualizar algo, mas quero incrementar e o knex tem uma query propria
        .increment('entries', 1)
        .returning('entries')
        .then(entries => entries.length ? res.json(entries[0]) : res.send('Wrong user'))
        .catch(err => res.json('unable to get entries'))
})


app.listen(3000)