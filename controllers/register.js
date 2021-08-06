const handleRegister = (bcrypt, db) => (req, res) => {
    const { name, email, password } = req.body
    //if(!name || !email || !password) res.status(400).json('blank input')
    //else                            utilizado para validar se os campos estao preenchidos
    const hash = bcrypt.hashSync(password, 10) //10 corresponde ao salt do bcrypt

    db.transaction(trx => { //transaction é o join/inner join do SQL
        return db('login')
            .transacting(trx)
            .insert({ hash, email })
            .returning('email') //chave estrangeira de login / comum entre as 2 tabelas
            .then(loginEmail => {
                return db('users')
                    .insert({
                        email: loginEmail[0],
                        name,
                        joined: new Date()
                    })
                    .returning('*')
                })
                .then(trx.commit) //obrigatorio para transaction, abaixo tb!
                .catch(err => trx.rollback())
    })
    .then(user => {
        res.json(user[0]) //sempre que do returning ou select ele vem pra mim na resp da promise
    })
    .catch(err => {
        res.status(400).json('Check email, cant register!')
    });
}

module.exports = {
    handleRegister: handleRegister
}