import express from 'express'
import con from "../utils/db.js"

const router = express.Router();

// Add an expenses
router.post('/expenses', (req, res) => {
    const params = req.body
    const sql = 'INSERT INTO expenses SET ?';

    con.query(sql, params, (err, result) => {
        if(err) {
            return res.json(err)
        }
        console.log(result);
        return res.json(result)
        
    })
})

// Get all expensess
router.get('/expenses', (req, res) => {
    const sql = 'SELECT * from expenses';

    con.query(sql, (err, result) => {
        if(err) return res.json(err)
        return res.json(result)
    })
})

// Get an expenses
router.get('/expenses/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * from expenses WHERE id = ?';

    con.query(sql,[id], (err, result) => {
        if(err) return res.json(err)
        return res.json(result)
    })
})

// Delete an expenses
router.delete('/expenses/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'delete from expenses WHERE id = ?';

    con.query(sql,[id], (err, result) => {
        if(err) return res.json(err)
        return res.json(result)
    })
})

// Update an expenses
router.put('/expenses/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'UPDATE expenses SET name = ?, amount = ?, description = ? WHERE id = ?';
    const values = [
        req.body.name,
        req.body.amount,
        req.body.description,
    ]

    con.query(sql,[...values, id], (err, result) => {
        if(err) return res.json(err)
        return res.json(result)
    })
})

export { router as expensesRouter };