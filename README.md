# OWASP Risk Calculator

## Overview
This application is a web-based tool designed to calculate the risk severity of security vulnerabilities using the standard OWASP Risk Rating Methodology. It helps security professionals and developers assess the Likelihood and Impact of a vulnerability to determine its overall Risk Severity (No, Low, Medium, High, Critical).

## Working

The application follows a structured three-step process:

### 1. Inputs (Risk Factors)
The user provides input for 16 specific risk factors, divided into two main categories:

*   Likelihood Factors (0-9 scale):
    *   Threat Agent Factors: Skill Level, Motive, Opportunity, Size.
    *   Vulnerability Factors: Ease of Discovery, Ease of Exploit, Awareness, Intrusion Detection.
*   Impact Factors (0-9 scale):
    *   Technical Impact: Loss of Confidentiality, Integrity, Availability, Accountability.
    *   Business Impact: Financial Damage, Reputation Damage, Non-Compliance, Privacy Violation.

Each factor is selected via a dropdown menu. The dropdowns are color-coded to give immediate visual feedback on the severity of each individual selection.

### 2. Calculation Logic
The backend logic processes the inputs using the following standard OWASP formulas:

1.  Likelihood Score: The average of all 8 Likelihood factors.
2.  Impact Score: The average of all 8 Impact factors.
3.  Levels: The numerical scores are mapped to levels (Low, Medium, High).

### 3. Risk Determination
The final Risk Severity is determined by mapping the Likelihood Level and Impact Level against the standard OWASP Risk Matrix.

A Radar Chart is generated to visualize the 4 key dimensions of the risk:
1.  Threat Agent
2.  Vulnerability
3.  Technical Impact
4.  Business Impact

