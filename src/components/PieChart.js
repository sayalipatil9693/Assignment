import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const PieChart = ({ data }) => {
    const [chartData, setChartData] = useState({});

    useEffect(() => {
        const categories = data.map(item => item.category);
        const amounts = data.map(item => item.amount);

        setChartData({
            labels: categories,
            datasets: [
                {
                    label: 'Expense Distribution',
                    data: amounts,
                    backgroundColor: ['#FF5733', '#33FF57', '#3357FF', '#FF33F6', '#F6FF33'],
                },
            ],
        });
    }, [data]);

    return <Pie data={chartData} />;
};

export default PieChart;
