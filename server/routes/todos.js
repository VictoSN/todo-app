const express = require('express')
const router = express.Router()
const Todo = require('../models/Todo')


router.get('/', async (req, res) => {
    const todos = await Todo.find();
    res.json(todos)
})

router.post('/', async (req, res) => {
    const todo = await Todo.create({ text: req.body.text })
    res.json(todo)
})

router.delete('/:id', async (req, res) => {
    await Todo.findByIdAndDelete(req.params.id)
    res.json({ success:true })
})

router.patch('/:id', async (req, res) => {
    await Todo.findByIdAndUpdate(req.params.id, req.body)
    res.json({ success: true })
})

module.exports = router