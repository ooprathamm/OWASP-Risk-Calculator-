from flask import Flask, render_template, request, jsonify
from calculator import OwaspCalculator

app = Flask(__name__)
calculator = OwaspCalculator()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.json
    
    try:
        likelihood_factors = [float(x) for x in data.get('likelihood', [])]
        impact_factors = [float(x) for x in data.get('impact', [])]
        
        if len(likelihood_factors) != 8 or len(impact_factors) != 8:
            return jsonify({'error': 'Invalid number of factors. Expected 8 for each.'}), 400

        result = calculator.calculate_risk(likelihood_factors, impact_factors)
        return jsonify(result)
    except ValueError:
        return jsonify({'error': 'Invalid input values. Must be numbers.'}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
