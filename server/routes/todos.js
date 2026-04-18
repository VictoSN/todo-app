const express = require('express')
const router = express.Router()

let todos = []

router.get('/', (req, res) => {
    res.json(todos)
})

router.post('/', (req, res) => {
    const todo = { id: Date.now(), text: req.body.text, status: false }
    todos.push(todo)
    res.json(todo)
})

router.delete('/:id', (req, res) => {
    todos = todos.filter(t => t.id !== Number(req.params.id))
    res.json({ success:true })
})

router.patch('/:id', (req, res) => {
    todos = todos.map(t => t.id === Number(req.params.id) ? { ...t, ...req.body } : t)
    res.json({ success: true })
})

module.exports = router