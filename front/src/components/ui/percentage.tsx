import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export const data = (cals: number) => {
    return {
        labels: ['Calories consumed', 'Calories til daily cap'],
        datasets: [
            {
                label: '# of calories',
                data: [cals <= 2500 ? cals : 2500, 2500 - (cals <= 2500 ? cals : 2500)],
                backgroundColor: [
                    'rgb(50,205,50)',
                    'rgb(105,105,105)'
                ],
                borderColor: [
                    'rgb(34,139,34)',
                    'rgb(105,105,105)',
                ],
                borderWidth: 1,
            },
        ],
    };
}

export function App({ cals }: { cals: number }) {
    return <Pie data={data(cals)} />;
}
export default App;