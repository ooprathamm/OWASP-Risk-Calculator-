document.addEventListener('DOMContentLoaded', () => {
    const selects = document.querySelectorAll('.factor-select');
    let riskChart = null;

    selects.forEach(select => {
        updateSelectColor(select);
    });
    calculateRisk();

    selects.forEach(select => {
        select.addEventListener('change', (e) => {
            updateSelectColor(e.target);
            calculateRisk();
        });
    });

    async function calculateRisk() {
        const likelihoodFactors = [];
        const impactFactors = [];

        document.querySelectorAll('.factor-select[data-type="likelihood"]').forEach(el => {
            likelihoodFactors.push(parseFloat(el.value));
        });

        document.querySelectorAll('.factor-select[data-type="impact"]').forEach(el => {
            impactFactors.push(parseFloat(el.value));
        });

        try {
            const response = await fetch('/calculate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    likelihood: likelihoodFactors,
                    impact: impactFactors
                })
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            updateUI(data);
            updateChart(likelihoodFactors, impactFactors);
        } catch (error) {
            console.error('Error calculating risk:', error);
        }
    }

    function updateUI(data) {
        const likelihoodScoreEl = document.getElementById('likelihood-score');
        const impactScoreEl = document.getElementById('impact-score');

        likelihoodScoreEl.textContent = data.likelihood_score;
        impactScoreEl.textContent = data.impact_score;

        updateRiskClass(likelihoodScoreEl.parentElement, data.likelihood_level);
        updateRiskClass(impactScoreEl.parentElement, data.impact_level);

        const severityEl = document.getElementById('risk-severity');
        severityEl.textContent = data.risk_severity;

        updateRiskClass(severityEl, data.risk_severity);
    }

    function updateRiskClass(element, level) {
        element.classList.remove('bg-note', 'bg-low', 'bg-medium', 'bg-high', 'bg-critical');

        if (level) {
            const className = 'bg-' + level.toLowerCase();
            element.classList.add(className);
        }
    }

    function updateSelectColor(select) {
        const val = parseInt(select.value);
        select.classList.remove('bg-low', 'bg-medium', 'bg-high');

        if (val < 3) {
            select.classList.add('bg-low');
        } else if (val < 6) {
            select.classList.add('bg-medium');
        } else {
            select.classList.add('bg-high');
        }
    }

    function updateChart(likelihoodFactors, impactFactors) {
        const ctx = document.getElementById('riskRadarChart').getContext('2d');


        const threatAgent = average(likelihoodFactors.slice(0, 4));
        const vulnerability = average(likelihoodFactors.slice(4, 8));
        const techImpact = average(impactFactors.slice(0, 4));
        const bizImpact = average(impactFactors.slice(4, 8));

        const data = {
            labels: [
                'Threat Agent',
                'Vulnerability',
                'Technical Impact',
                'Business Impact'
            ],
            datasets: [{
                label: 'Risk Factors',
                data: [threatAgent, vulnerability, techImpact, bizImpact],
                fill: true,
                backgroundColor: 'rgba(37, 99, 235, 0.2)', // Royal Blue transparent
                borderColor: 'rgb(37, 99, 235)', // Royal Blue
                pointBackgroundColor: 'rgb(37, 99, 235)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(37, 99, 235)'
            }]
        };

        if (riskChart) {
            riskChart.data = data;
            riskChart.update();
        } else {
            riskChart = new Chart(ctx, {
                type: 'radar',
                data: data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    layout: {
                        padding: 10
                    },
                    elements: {
                        line: {
                            borderWidth: 3
                        }
                    },
                    scales: {
                        r: {
                            angleLines: {
                                display: true,
                                color: 'rgba(0, 0, 0, 0.1)'
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.1)'
                            },
                            pointLabels: {
                                font: {
                                    size: 10
                                },
                                color: '#64748b'
                            },
                            ticks: {
                                backdropColor: 'transparent',
                                backdropPadding: 0,
                                font: {
                                    size: 9
                                },
                                stepSize: 2,
                                showLabelBackdrop: false
                            },
                            min: 0,
                            max: 9
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }
    }

    function average(arr) {
        if (arr.length === 0) return 0;
        return arr.reduce((a, b) => a + b, 0) / arr.length;
    }
});
