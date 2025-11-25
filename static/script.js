document.addEventListener('DOMContentLoaded', () => {
    const selects = document.querySelectorAll('.factor-select');
    let riskChart = null;

    // Initial calculation
    calculateRisk();

    // Add event listeners
    selects.forEach(select => {
        select.addEventListener('change', calculateRisk);
    });

    async function calculateRisk() {
        const likelihoodFactors = [];
        const impactFactors = [];

        // Collect values for calculation
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
        // Update Scores
        document.getElementById('likelihood-score').textContent = data.likelihood_score;
        document.getElementById('impact-score').textContent = data.impact_score;

        // Update Severity
        const severityEl = document.getElementById('risk-severity');
        severityEl.textContent = data.risk_severity;

        // Reset classes and add new one
        severityEl.className = 'severity-display';
        severityEl.classList.add(data.risk_severity.toLowerCase());
    }

    function updateChart(likelihoodFactors, impactFactors) {
        const ctx = document.getElementById('riskRadarChart').getContext('2d');

        // Labels for the 8 factors
        // Likelihood: Skill, Motive, Opp, Size, Discovery, Exploit, Awareness, Detection
        // Impact: Conf, Integ, Avail, Account, Fin, Rep, Compliance, Privacy
        // To make the radar chart readable, we might want to average them into the 4 sub-groups or show all 8?
        // Showing all 16 is too much. Let's show the 8 sub-groups (averages) or just the 2 main scores?
        // Better: Show the 8 factors from the UI groups (4 Likelihood, 4 Impact).

        // Actually, the UI has 8 inputs for Likelihood and 8 for Impact.
        // Let's group them by the 4 sub-headers in the UI:
        // 1. Threat Agent (Avg of first 4 Likelihood)
        // 2. Vulnerability (Avg of last 4 Likelihood)
        // 3. Technical Impact (Avg of first 4 Impact)
        // 4. Business Impact (Avg of last 4 Impact)

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
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                borderColor: 'rgb(59, 130, 246)',
                pointBackgroundColor: 'rgb(59, 130, 246)',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: 'rgb(59, 130, 246)'
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
                    elements: {
                        line: {
                            borderWidth: 3
                        }
                    },
                    scales: {
                        r: {
                            angleLines: {
                                display: false
                            },
                            suggestedMin: 0,
                            suggestedMax: 9,
                            ticks: {
                                stepSize: 3
                            }
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
