import React from 'react';

const ExpenseTable = ({ expenses, deleteExpense, editExpense }) => {
    return (
        <table>
            <thead>
                <tr>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                    <th>Comments</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {expenses.map((expense) => (
                    <tr key={expense.id}>
                        <td>{expense.category}</td>
                        <td>{expense.amount}</td>
                        <td>{new Date(expense.created_at).toLocaleString()}</td>
                        <td>{new Date(expense.updated_at).toLocaleString()}</td>
                        <td>{expense.comments}</td>
                        <td>
                            <button onClick={() => editExpense(expense.id)}>Edit</button>
                            <button onClick={() => deleteExpense(expense.id)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ExpenseTable;
