import React, { useState } from 'react';

const AddExpense = ({ addExpense }) => {
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [comments, setComments] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newExpense = {
            category,
            amount: parseFloat(amount),
            comments,
        };
        addExpense(newExpense);
        setCategory('');
        setAmount('');
        setComments('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Category:</label>
                <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} required />
            </div>
            <div>
                <label>Amount:</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </div>
            <div>
                <label>Comments:</label>
                <textarea value={comments} onChange={(e) => setComments(e.target.value)} />
            </div>
            <button type="submit">Add Expense</button>
        </form>
    );
};

export default AddExpense;
