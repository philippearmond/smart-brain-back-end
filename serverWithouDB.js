const express = require('express')
const cors = require('cors') //permite requisições do front, via localhost
const bodyParser = require('body-parser') //utilizado para trabalhar/tratar dados do body da requisição

const database = {
    users: [
        {
            id: '127',
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookie',
            entries: 0,
            joined: new Date()
        },
        {
            id: '123',
            name: 'Thomasine',
            email: 'thomasine@gmail.com',
            password: 'witch',
            entries: 0,
            joined: new Date()
        },
        {
            id: '183',
            name: 'Micha',
            email: 'micha@gmail.com',
            password: 'warrior',
            entries: 0,
            joined: new Date()
        }
    ]
}

const app = express()

app.use(bodyParser.json()) //lembre-se 'use' serve para algum tipo de middleware
app.use(cors())


app.get('/', (req, res) => {
    res.send(database.users)
})

app.post('/signin', (req, res) => {
    if(req.body.email === database.users[0].email && 
        req.body.password === database.users[0].password) {

        res.json(database.users[0]) //alterar para success quando implementar BD
    } else {
        res.status(400).json('error logging in')
    }
})

app.post('/register', (req, res) => {

    const { name, email, password } = req.body

    data = {
        id: '521',
        name,
        email,
        password, //no curso foi retirado para nao mostrar ao retornar apos registrar
        entries: 0,
        joined: new Date()
    }
    database.users.push(data)

    res.json(database.users[database.users.length - 1])
})

app.get('/posts/:id', (req, res) => {
    const { id } = req.params

    let found = false //utilizado somente para passar a msg de erro caso nao seja encontrado, se eu nao fizer dessa forma e passar simplesmente um else, vai cair sempre no catch/else!!!

    database.users.forEach( user => {
        if(user.id === id) {
            found = true
            return res.json(user) //se eu n retornar, o loop continuara msm não atendendo a condição, se por exemplo eu fizer imediatamente outra requisição, so sera atendida a 1x
        }
    })
    if(!found) {
        res.status(400).json('Not Registered!!')
    }
    
})


app.put('/image', (req, res) => {
    const { id } = req.body   //repare que na requisição do profile, eu pego id do parametro/URL, aqui pego da requisição/body
    let found = false

    database.users.forEach( user => {
        if( user.id === id ) {
            found = true
            user.entries++

            return res.json(user.entries) //se altero a resposta para ex: user, os entries nao vao retornar no front
        }
    })
    if(!found) {
        res.status(400).json('Something was fail')
    }
})

app.listen(3000)