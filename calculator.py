class OwaspCalculator:
    def __init__(self):
        self.risk_matrix = {
            'Low': {'Low': 'Note', 'Medium': 'Low', 'High': 'Medium'},
            'Medium': {'Low': 'Low', 'Medium': 'Medium', 'High': 'High'},
            'High': {'Low': 'Medium', 'Medium': 'High', 'High': 'Critical'}
        }

    def calculate_score(self, factors):
        """Calculates the average score from a list of factors."""
        if not factors:
            return 0.0
        return sum(factors) / len(factors)

    def get_level(self, score):
        """Maps a numerical score to a severity level."""
        if score < 3:
            return 'Low'
        elif score < 6:
            return 'Medium'
        else:
            return 'High'

    def calculate_risk(self, likelihood_factors, impact_factors):
        likelihood_score = self.calculate_score(likelihood_factors)
        impact_score = self.calculate_score(impact_factors)

        likelihood_level = self.get_level(likelihood_score)
        impact_level = self.get_level(impact_score)

        risk_severity = self.risk_matrix[impact_level][likelihood_level]

        return {
            'likelihood_score': round(likelihood_score, 3),
            'likelihood_level': likelihood_level,
            'impact_score': round(impact_score, 3),
            'impact_level': impact_level,
            'risk_severity': risk_severity
        }
