const express = require('express')
const app = express()

const fs = require('fs')
const PORT = 8000

app.set('view engine', 'pug')
app.use('/static', express.static('./public'))
app.use(express.urlencoded({ extended: false }))


app.get('/',(req, res) => {
    fs.readFile('./data/tasks.json', (err, data) => {
        if(err) throw err

        const todos = JSON.parse(data)

        res.render('main', { todos: todos })
    }) 
})

app.post('/create', (req, res) => {
    const formData = req.body

    if (formData.todo.trim() !== '') {
        fs.readFile('./data/tasks.json', (err, data) => {
            if (err) throw err

            const todos = JSON.parse(data)

            const todo = {
                id: id(),
                description: formData.todo,
                done: false
            }

            todos.push(todo)

            fs.writeFile('./data/tasks.json', JSON.stringify(todos), (err) => {
                if (err) throw err

                fs.readFile('./data/tasks.json', (err, data) => {
                    if (err) throw err

                    const todos = JSON.parse(data)

                    res.render('main', {success: true, todos: todos})
                })
            })
        })
    } else {


        fs.readFile('./data/tasks.json', (err, data) => {
            if (err) throw err

            const todos = JSON.parse(data)

            res.render('main', {error: true, todos: todos})
        })
    }
})

app.get('/:id/update', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/tasks.json', (err, data) => {
        if (err) throw err

        const todos = JSON.parse(data)
        const todo = todos.filter(todo => todo.id === id)[0]

        const todoIdx = todos.indexOf(todo)
        const splicedTodo = todos.splice(todoIdx, 1)[0]

        splicedTodo.done = true

        todos.push(splicedTodo)

        fs.writeFile('./data/tasks.json', JSON.stringify(todos), (err) => {
            if (err) throw err

            res.render('main', { todos: todos })
        })
    })
})

app.get('/:id/deleted', (req, res) => {
    const id = req.params.id

    fs.readFile('./data/tasks.json', (err, data) => {
        if (err) throw err

        const todos = JSON.parse(data)

        const filteredTodos = todos.filter(todo => todo.id !== id)

        fs.writeFile('./data/tasks.json', JSON.stringify(filteredTodos), (err) => {
            if (err) throw err

            res.render('main', { todos: filteredTodos, deleted: true })
        })
    })
})

app.get('/api/v1/todos', (req, res) => {
    fs.readFile('./data/tasks.json', (err, data) => {
      if (err) throw err
  
      const todos = JSON.parse(data)
  
      res.json(todos)
    })
})

app.listen(PORT, (err) => {
    if(err) throw err

    console.log(`This app is running on port ${ PORT }`)
})

function id () {
    return '_' + Math.random().toString(36).substr(2, 9)
  }