import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AddExpense from './components/AddExpense';
import ExpenseTable from './components/ExpenseTable';
import PieChart from './components/PieChart';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  
  useEffect(() => {
    axios.get('/api/expenses')
      .then(response => setExpenses(response.data))
      .catch(error => console.error('Error fetching expenses', error));

    axios.get('/api/expenses/distribution')
      .then(response => setCategories(response.data))
      .catch(error => console.error('Error fetching category data', error));
  }, []);

  return (
    <div className="App">
      <h1>Expense Tracker</h1>
      <AddExpense setExpenses={setExpenses} />
      <ExpenseTable expenses={expenses} setExpenses={setExpenses} />
      <PieChart categories={categories} />
    </div>
  );
}

export default App;
