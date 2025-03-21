# MIFIDPRU Compliance Solution
## Comprehensive User Guide

## Table of Contents
1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [Dashboard](#dashboard)
4. [Core Calculations](#core-calculations)
5. [Risk Management](#risk-management)
6. [Regulatory Reporting](#regulatory-reporting)
7. [Compliance Monitoring](#compliance-monitoring)
8. [ICARA Document Generator](#icara-document-generator)
9. [Data Management](#data-management)
10. [Best Practices](#best-practices)
11. [Troubleshooting](#troubleshooting)
12. [Glossary](#glossary)

## Introduction

The MIFIDPRU Compliance Solution is a comprehensive tool designed to help investment firms calculate their prudential requirements, assess risks, and generate regulatory reports under the FCA's MIFIDPRU regime. This solution streamlines the complex process of compliance, saving time and reducing the risk of errors.

### Key Features

- **Complete MIFIDPRU Calculations**: Calculate firm classification, K-factors, fixed overhead requirements, liquid assets requirements, and own funds requirements.
- **Advanced Risk Management**: Conduct comprehensive risk assessments, stress testing, and concentration risk analysis.
- **Regulatory Reporting**: Generate FCA reports (MIF001-MIF007) and ICARA documentation.
- **Compliance Monitoring**: Track compliance metrics and receive alerts when approaching thresholds.
- **ICARA Document Generator**: Create customizable ICARA documentation based on your firm's data.
- **Data Management**: Save and load calculations, export and import firm data.

### Regulatory Background

The FCA's Investment Firms Prudential Regime (IFPR) introduces a comprehensive prudential framework for investment firms, replacing previous regimes. MIFIDPRU rules require firms to:

- Calculate appropriate capital requirements based on activities and risks
- Maintain adequate liquid assets
- Conduct an Internal Capital and Risk Assessment (ICARA) process
- Report regularly to the FCA

This solution helps firms meet these requirements efficiently and effectively.

## Getting Started

### Initial Setup

1. **Create a Firm Profile**:
   - Navigate to the Dashboard module
   - Enter your firm's name in the "New Firm Name" field and click "Create New Firm"
   - Your firm will appear in the "Your Firms" section

2. **Set Up Basic Firm Information**:
   - Click on your firm name to edit it if needed
   - The system will automatically track when your firm profile was created and last modified

3. **Navigation**:
   - Use the navigation bar at the top of the application to switch between modules:
     - Dashboard: Overview and quick actions
     - Calculations: Core MIFIDPRU calculations
     - Risk Management: Risk register, stress testing, and concentration risk
     - Regulatory Reporting: Generate regulatory reports
     - Compliance Monitoring: Track compliance metrics
     - ICARA Document: Generate ICARA documentation

### Quick Start Guide

For a basic compliance assessment:

1. Navigate to the Calculations module
2. Enter data in all five calculation tabs (Firm Classification, K-Factors, Fixed Overhead, Liquid Assets, Own Funds)
3. Click "Calculate Requirements"
4. View the summary results
5. Go to the Regulatory Reporting module to generate reports
6. Save your calculation for future reference

## Dashboard

The Dashboard provides an overview of your firm's compliance status and quick access to key functions.

### Key Components

- **Firm Management**: Create, select, and manage firm profiles
- **Current Firm**: View and edit details of the currently selected firm
- **Compliance Metrics**: View key metrics like firm classification, own funds requirement, liquid assets requirement, and material harms
- **Quick Actions**: Access commonly used functions like updating calculations, saving data, and generating reports
- **Calculation Management**: Save, load, and manage calculation snapshots

### Using the Dashboard

1. **Manage Firm Profiles**:
   - Create new firms with the "Create New Firm" button
   - Switch between firms by clicking on them in the "Your Firms" list
   - Export firm data with the "Export" button
   - Delete firms with the "Delete" button (use with caution)

2. **Manage Calculations**:
   - Save the current calculation with a descriptive name
   - Load previous calculations by clicking on them in the list
   - Delete old calculations when no longer needed

3. **Quick Actions**:
   - Use the "Update Calculations" button to navigate to the Calculations module
   - Use the "Save Current Calculation" button to save your work
   - Use the "Generate Regulatory Report" button to create reports

## Core Calculations

The Calculations module contains the core MIFIDPRU calculations required for compliance.

### Firm Classification

This tab determines whether your firm is a Small and Non-Interconnected (SNI) investment firm or a non-SNI firm.

1. **Input Fields**:
   - Assets Under Management (AUM)
   - Client Orders Handled (COH) - Cash Trades and Derivatives
   - Assets Safeguarded and Administered (ASA)
   - Client Money Held (CMH)
   - Daily Trading Flow (DTF)
   - Net Position Risk (NPR) and Clearing Margin Given (CMG)
   - Trading Counterparty Default (TCD)
   - On- and Off-Balance Sheet Total
   - Total Annual Gross Revenue

2. **Results**:
   - Classification as SNI or non-SNI
   - Explanation of implications

### K-Factor Requirements

This tab calculates the K-factor requirement (KFR) based on client, market, and firm risk metrics.

1. **Client Risk K-Factors**:
   - K-AUM: Assets Under Management
   - K-CMH: Client Money Held (Segregated and Non-Segregated)
   - K-ASA: Assets Safeguarded and Administered
   - K-COH: Client Orders Handled (Cash and Derivatives)

2. **Market Risk K-Factors**:
   - K-NPR: Net Position Risk
   - K-CMG: Clearing Margin Given

3. **Firm Risk K-Factors**:
   - K-TCD: Trading Counterparty Default
   - K-DTF: Daily Trading Flow (Cash and Derivatives)
   - K-CON: Concentration Risk

4. **Results**:
   - Individual K-factor calculations
   - Total K-Factor Requirement

### Fixed Overhead Requirement

This tab calculates the Fixed Overhead Requirement (FOR) based on the firm's annual expenditure.

1. **Input Fields**:
   - Total Expenditure
   - Deductions:
     - Discretionary Bonuses
     - Employees', Directors', Partners' Shares in Profits
     - Other Discretionary Payments
     - Shared Commissions
     - Fees Paid to CCPs, Exchanges, and Brokers
     - Interest Paid to Customers
     - Non-Recurring Expenses
   - Additions:
     - Tied Agent Fees

2. **Results**:
   - Annual Fixed Overheads
   - Fixed Overhead Requirement (25% of annual fixed overheads)

### Liquid Assets Requirement

This tab calculates the liquid assets threshold requirement.

1. **Input Fields**:
   - Estimated Wind-Down Period (months)
   - Additional Liquid Assets for Harm (populated from Risk Assessment)

2. **Results**:
   - One-third of Fixed Overhead Requirement
   - One-third of Fixed Ongoing Costs
   - Additional Liquid Assets for Harm
   - Total Liquid Assets Threshold Requirement

3. **Eligible Liquid Assets**:
   - Information on what assets qualify as eligible liquid assets under MIFIDPRU

### Own Funds Requirement

This tab calculates the own funds threshold requirement.

1. **Input Fields**:
   - Firm Activity Type (determines Permanent Minimum Capital Requirement)
   - Additional Own Funds for Harm (populated from Risk Assessment)

2. **Results**:
   - Permanent Minimum Capital Requirement (PMCR)
   - Fixed Overhead Requirement (FOR)
   - K-Factor Requirement (KFR)
   - Base Own Funds Requirement (highest of PMCR, FOR, KFR)
   - Additional Own Funds for Harm
   - Total Own Funds Requirement
   - Required composition of own funds (CET1, AT1, T2)

### Running Calculations

1. Enter data in all relevant fields across the five tabs
2. Click the "Calculate Requirements" button at the top of the page
3. Review the summary results displayed at the bottom of the page
4. Save the calculation if needed

## Risk Management

The Risk Management module allows you to identify and assess potential harms, conduct stress testing, and analyze concentration risk.

### Risk Register

The Advanced Risk Register helps you identify, assess, and quantify potential harms to clients, markets, or the firm itself.

1. **Adding a Harm**:
   - Click "Add Potential Harm"
   - Select Category and Subcategory
   - Choose from example harms or enter a custom description
   - Rate Likelihood (1-5) and Impact (1-5)
   - Add information on controls and mitigations
   - Specify additional own funds and liquid assets required

2. **Managing Harms**:
   - Update likelihood, impact, or resource requirements as needed
   - Delete harms that are no longer relevant
   - Monitor risk ratings (Very Low, Low, Medium, High)

3. **Results**:
   - Total and Material Harms count
   - Additional Own Funds Required
   - Additional Liquid Assets Required

### Stress Testing

The Stress Testing module allows you to assess the impact of adverse scenarios on your prudential requirements.

1. **Using Default Scenarios**:
   - Select from pre-defined scenarios like Market Downturn, Operational Failure, etc.
   - Review the impacts of each scenario
   - Specify additional own funds and liquid assets required

2. **Creating Custom Scenarios**:
   - Click "Add New Scenario"
   - Define name, description, and impacts
   - Specify the percentage change for each impact factor
   - Add additional own funds and liquid assets required

3. **Running Stress Tests**:
   - Select a scenario and click "Run Stress Test"
   - Review the impact on K-Factor Requirement, Fixed Overhead Requirement, Own Funds Requirement, and Liquid Assets Requirement
   - Use the results to inform recovery and wind-down planning

### Concentration Risk Analysis

The Concentration Risk Analysis module helps you assess and manage concentration risk.

1. **Adding Exposures**:
   - Click "Add Exposure"
   - Enter counterparty name, type, exposure value, and collateral
   - Review the exposure percentage and status

2. **Managing Exposures**:
   - Update exposure values and collateral as needed
   - Monitor which exposures exceed their limits

3. **Calculating K-CON**:
   - Click "Calculate K-CON" to determine the concentration risk capital requirement
   - Review the number of exposures exceeding limits and the K-CON value
   - This value feeds into the K-Factor Requirement calculation

## Regulatory Reporting

The Regulatory Reporting module helps you generate and export regulatory reports required by the FCA.

### Available Reports

- **MIF001**: Own funds composition
- **MIF002**: Capital requirements
- **MIF003**: Group capital test
- **MIF004**: Concentration risk
- **MIF005**: Liquidity
- **MIF006**: Additional metrics
- **MIF007**: Non-K-CON threshold monitoring
- **ICARA**: ICARA questionnaire

### Generating Reports

1. **Select Report Type**:
   - Choose the report you want to generate from the dropdown

2. **Select Reporting Period End Date**:
   - Enter the end date for the reporting period

3. **Generate Report**:
   - Click "Generate Report"
   - Review the report details, including submission deadline

4. **Export Report**:
   - Export the report in CSV format for data analysis
   - Export the report in XML format for submission to the FCA

### Reporting Calendar

The Reporting Calendar shows the upcoming reporting deadlines based on the FCA's requirements, helping you plan your regulatory submissions.

## Compliance Monitoring

The Compliance Monitoring module helps you track compliance metrics and receive alerts when approaching thresholds.

### Monitoring Dashboard

1. **Input Actual Values**:
   - Enter your actual own funds and liquid assets
   - The system calculates your compliance status

2. **Metric Cards**:
   - Own Funds: Displays actual own funds versus requirement
   - Liquid Assets: Displays actual liquid assets versus requirement
   - Recovery Plan Trigger: 110% of Own Funds Requirement
   - Wind-Down Trigger: 105% of Own Funds Requirement

3. **Threshold Alerts**:
   - Critical: Threshold breached - immediate action required
   - Warning: Close to threshold - prepare mitigation plans
   - Watch: Monitor closely - consider precautionary measures
   - Normal: Comfortable buffer maintained

### Monthly Metrics History

The Monthly Metrics History section shows your compliance metrics over time, allowing you to track trends and patterns.

- View historical own funds and liquid assets requirements
- See actual own funds and liquid assets maintained
- Monitor buffer percentages over time

## ICARA Document Generator

The ICARA Document Generator helps you create a comprehensive ICARA document based on your firm's data.

### Document Sections

- **Executive Summary**: Overview of the firm, business model, and key conclusions
- **Business Model Analysis**: Description of business activities, strategy, and risks
- **Governance Arrangements**: Overview of governance structure and risk management
- **Harm Identification and Risk Assessment**: Assessment of potential harms
- **Capital Adequacy Assessment**: Analysis of own funds requirements
- **Liquidity Adequacy Assessment**: Analysis of liquid assets requirements
- **Stress Testing**: Results and impact on capital and liquidity
- **Wind-Down Analysis**: Plan for orderly wind-down
- **Recovery Plan**: Actions to recover from stress scenarios
- **Conclusions and Action Plan**: Summary of findings and actions
- **Appendices**: Supporting documentation and calculations

### Generating the Document

1. **Select Sections**:
   - Choose which sections to include in your document
   - Required sections cannot be deselected

2. **Customize Content**:
   - For each section, you can use the default generated content or customize it
   - Click "Customize Content" to edit any section
   - The editor supports Markdown formatting

3. **Generate Document**:
   - Click "Generate ICARA Document"
   - Review the document preview
   - Export as Markdown for further editing in your preferred document editor

## Data Management

The Data Management features help you save, load, export, and import firm data and calculations.

### Firm Management

1. **Creating Firms**:
   - Enter a firm name and click "Create New Firm"
   - The new firm will be selected automatically

2. **Selecting Firms**:
   - Click on a firm in the "Your Firms" list to select it
   - The current firm's details and calculations will be displayed

3. **Exporting Firm Data**:
   - Click "Export" next to the current firm
   - Save the JSON file to your computer

4. **Importing Firm Data**:
   - Click "Import Firm Data"
   - Select a previously exported JSON file
   - The imported firm will be added to your firms list

### Calculation Management

1. **Saving Calculations**:
   - Enter a name for the calculation (optional)
   - Click "Save Current Calculation"
   - The calculation will be added to the list

2. **Loading Calculations**:
   - Click on a saved calculation in the list
   - The calculation data will be loaded and results recalculated

3. **Managing Calculations**:
   - Review calculation details, including creation date and key metrics
   - Delete calculations that are no longer needed

## Best Practices

### General Recommendations

1. **Regular Updates**:
   - Update your calculations at least quarterly
   - Update immediately after material changes to your business

2. **Comprehensive Risk Assessment**:
   - Identify all potential harms to clients, markets, and the firm
   - Be thorough and conservative in your risk assessments
   - Review and update risk assessments regularly

3. **Documentation**:
   - Document your methodology and assumptions
   - Keep records of all calculations and supporting data
   - Maintain a clear audit trail for regulatory purposes

4. **Board Involvement**:
   - Ensure Board review and approval of ICARA document
   - Present regular compliance updates to the Board
   - Document Board discussions and decisions

### Data Entry Tips

1. **Accuracy First**:
   - Double-check all financial figures
   - Use validated data from accounting systems
   - Ensure consistency between different sections

2. **Conservative Approach**:
   - When in doubt, use more conservative estimates
   - Factor in potential business growth or changes
   - Include buffer margins where appropriate

3. **Completeness Check**:
   - Ensure all required fields are completed
   - Use the validation features to catch errors
   - Review calculations before finalizing

### Stress Testing Advice

1. **Scenario Selection**:
   - Include both idiosyncratic and market-wide scenarios
   - Consider severe but plausible scenarios
   - Include scenarios relevant to your specific business model

2. **Impact Assessment**:
   - Be comprehensive in assessing potential impacts
   - Consider second-order effects
   - Quantify impacts in financial terms where possible

3. **Response Planning**:
   - Develop clear action plans for each scenario
   - Assign responsibilities for implementing responses
   - Test plans periodically

## Troubleshooting

### Common Issues

1. **Calculation Errors**:
   - Check that all required fields are completed
   - Verify that numeric fields contain valid numbers
   - Ensure consistency between related fields

2. **Unexpected Results**:
   - Review input data for accuracy
   - Check for errors in the calculation methodology
   - Consider whether business changes have affected the results

3. **Loading/Saving Problems**:
   - Check browser storage settings
   - Export important data as a backup
   - Clear browser cache if persistent issues occur

### Getting Help

If you encounter issues that you cannot resolve:

1. **Check Documentation**:
   - Review this user guide for guidance
   - Check the FCA's MIFIDPRU rules for regulatory clarification

2. **Technical Support**:
   - Contact technical support at [support email]
   - Provide details of the issue and any error messages

3. **Regulatory Advice**:
   - Consult with compliance professionals
   - Consider seeking advice from the FCA's Firm Enquiries Team

## Glossary

- **ASA (Assets Safeguarded and Administered)**: The value of assets that a firm safeguards and administers for clients.
- **AUM (Assets Under Management)**: The total market value of assets that a firm manages on behalf of clients.
- **CMH (Client Money Held)**: The amount of client money held by a firm.
- **COH (Client Orders Handled)**: The value of orders that a firm handles for clients.
- **DTF (Daily Trading Flow)**: The value of transactions that a firm enters into as principal or executes in its own name for clients.
- **FOR (Fixed Overhead Requirement)**: A capital requirement equal to 25% of a firm's fixed overheads.
- **ICARA (Internal Capital and Risk Assessment)**: A process where firms assess their risks and determine appropriate financial resources.
- **K-Factors**: Metrics that measure client, market, and firm risks for calculating capital requirements.
- **K-CON (Concentration Risk K-Factor)**: Capital requirement for concentration risk exposures.
- **LATR (Liquid Assets Threshold Requirement)**: The minimum amount of liquid assets a firm must maintain.
- **MIFIDPRU**: The FCA's prudential sourcebook for MiFID investment firms.
- **OFTR (Own Funds Threshold Requirement)**: The minimum amount of capital a firm must maintain.
- **PMCR (Permanent Minimum Capital Requirement)**: The minimum capital requirement based on a firm's activities.
- **SNI (Small and Non-Interconnected)**: A classification for smaller investment firms subject to simplified requirements.
