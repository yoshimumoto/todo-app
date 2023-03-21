const express = require('express')
const app = express()

const fs = require('fs')
const PORT = 8000

app.set('view engine', 'pug')
app.use('/static', express.static('./public'))
app.use(express.urlencoded({ extended: false }))


app.get('/',(req, res) => {
    fs.readFile('./data/todos.json', (err, data) => {
        if(err) throw err

        const todos = JSON.parse(data)

        res.render('index', { todos: todos })
    }) 
})

app.listen(PORT, (err) => {
    if(err) throw err

    console.log(`This app is running on port ${ PORT }`)
})