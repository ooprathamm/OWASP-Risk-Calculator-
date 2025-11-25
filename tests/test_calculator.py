import unittest
from calculator import OwaspCalculator

class TestOwaspCalculator(unittest.TestCase):
    def setUp(self):
        self.calc = OwaspCalculator()

    def test_calculate_score(self):
        factors = [1, 2, 3, 4, 5, 6, 7, 8]
        # Sum = 36, Avg = 4.5
        self.assertEqual(self.calc.calculate_score(factors), 4.5)

    def test_get_level(self):
        self.assertEqual(self.calc.get_level(2.9), 'Low')
        self.assertEqual(self.calc.get_level(3.0), 'Medium')
        self.assertEqual(self.calc.get_level(5.9), 'Medium')
        self.assertEqual(self.calc.get_level(6.0), 'High')

    def test_calculate_risk_critical(self):
        # High Likelihood (>6), High Impact (>6) -> Critical
        likelihood = [9] * 8 # Avg 9
        impact = [9] * 8 # Avg 9
        result = self.calc.calculate_risk(likelihood, impact)
        self.assertEqual(result['risk_severity'], 'Critical')

    def test_calculate_risk_note(self):
        # Low Likelihood (<3), Low Impact (<3) -> Note
        likelihood = [1] * 8 # Avg 1
        impact = [1] * 8 # Avg 1
        result = self.calc.calculate_risk(likelihood, impact)
        self.assertEqual(result['risk_severity'], 'Note')

if __name__ == '__main__':
    unittest.main()
