const express = require('express')
const router = express.Router()
const Todo = require('../models/Todo')


router.get('/', async (req, res) => {
    try {
        const todos = await Todo.find();
        res.json(todos)
    } catch (err) {
        next(err);
    }
})

router.post('/', async (req, res) => {
    try {
        const todo = await Todo.create({ text: req.body.text })
        res.json(todo)
    } catch (err) {
        next(err);
    }
})

router.delete('/:id', async (req, res) => {
    try {
        await Todo.findByIdAndDelete(req.params.id)
        res.json({ success:true })
    } catch (err) {
        next(err);
    }
})

router.patch('/:id', async (req, res) => {
    try {
        await Todo.findByIdAndUpdate(req.params.id, req.body)
        res.json({ success: true })
    } catch (err) {
        next(err);
    }
})

module.exports = router