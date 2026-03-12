// Initialize Growth Chart
const ctx = document.getElementById('growthChart').getContext('2d');

new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['May 01', 'May 05', 'May 10', 'May 15', 'May 20', 'May 25', 'May 30'],
        datasets: [{
            label: 'Student Registrations',
            data: [12, 19, 25, 21, 15, 12, 18],
            backgroundColor: (context) => {
                const index = context.dataIndex;
                // Highlight middle bar as per the reference image
                return index === 3 ? '#FF8C00' : '#FFD6A5';
            },
            borderRadius: 8,
            borderSkipped: false,
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                beginAtZero: true,
                display: false,
            },
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#9CA3AF',
                    font: {
                        family: 'Inter',
                        size: 11
                    }
                }
            }
        }
    }
});
