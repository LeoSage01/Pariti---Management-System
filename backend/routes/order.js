import express from 'express'
import con from "../utils/db.js"

const router = express.Router();

// Add an order
router.post('/orders', (req, res) => {
    const params = req.body
    const sql = 'INSERT INTO orders SET ?';

    con.query(sql, params, (err, result) => {
        if(err) return res.json(err)
        return res.json(result)
    })
})

// Get all orders
router.get('/orders', (req, res) => {
    const sql = 'SELECT * from orders';

    con.query(sql, (err, result) => {
        if(err) {
            console.log(err);
            return res.json(err)
        }
        return res.json(result)
    })
})

// Get an order
router.get('/orders/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'SELECT * from orders WHERE id = ?';

    con.query(sql,[id], (err, result) => {
        if(err) return res.json(err)
        return res.json(result)
    })
})

// Delete an order
router.delete('/orders/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'delete from orders WHERE id = ?';

    con.query(sql,[id], (err, result) => {
        if(err) return res.json(err)
        return res.json(result)
    })
})

// Update an order
router.put('/orders/:id', (req, res) => {
    const id = req.params.id;
    const sql = 'UPDATE orders SET from_where = ?, to_where = ?, description = ?, amount = ?, sender_name = ?, sender_number = ?, receiver_name = ?, receiver_number = ?, referral = ? WHERE id = ?';
    const values = [
        req.body.from_where,
        req.body.to_where,
        req.body.description,
        req.body.amount,
        req.body.sender_name,
        req.body.sender_number,
        req.body.receiver_name,
        req.body.receiver_number,
        req.body.referral
    ]

    con.query(sql,[...values, id], (err, result) => {
        if(err) {
            return res.json(err)
        }
        return res.json(result)
    })
})

export { router as orderRouter };