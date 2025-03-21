// Main Application Integration
import React, { useState, useEffect } from 'react';

// Import core calculation modules
import { calculateFirmClassification } from './modules/FirmClassificationModule';
import { calculateKFactors } from './modules/KFactorModule';
import { calculateFOR } from './modules/FixedOverheadModule';
import { calculateLiquidAssetsRequirement } from './modules/LiquidAssetsModule';
import { calculateOwnFundsRequirement } from './modules/OwnFundsModule';
import { calculateICARA } from './modules/ICARAModule';

// Import enhancement modules
import { useFirmDataPersistence, FirmManager, CalculationManager } from './modules/DataPersistenceModule';
import { RegulatoryReportingDashboard } from './modules/RegulatoryReportingModule';
import { AdvancedRiskRegister, StressTesting, ConcentrationRiskAnalysis } from './modules/RiskManagementModule';
import { ComplianceMonitoringDashboard } from './modules/ComplianceMonitoringModule';
import { ICARADocumentGenerator } from './modules/ICARADocumentGenerator';

// Import necessary icons
import { Home, FileText, AlertTriangle, BarChart2, Book, Settings } from 'lucide-react';

// Main application component
const MIFIDPRUComplianceApp = () => {
  // State for all user inputs and calculation results
  const [firmData, setFirmData] = useState({
    // Firm classification inputs
    aum: 0,
    cohCash: 0,
    cohDerivatives: 0,
    asa: 0,
    cmh: 0,
    dtf: 0,
    npr: 0,
    cmg: 0,
    tcd: 0,
    balanceSheetTotal: 0,
    annualRevenue: 0,
    
    // K-factor inputs
    cmhSegregated: 0,
    cmhNonSegregated: 0,
    cohCashValue: 0,
    cohDerivativesValue: 0,
    nprValue: 0,
    cmgValue: 0,
    tcdExposureValue: 0,
    tcdRiskFactor: 1,
    tcdCVA: 1,
    dtfCashValue: 0,
    dtfDerivativesValue: 0,
    kconValue: 0,
    
    // FOR inputs
    totalExpenditure: 0,
    discretionaryBonuses: 0,
    profitShares: 0,
    otherDiscretionaryPayments: 0,
    sharedCommissions: 0,
    feesPaidToCCPs: 0,
    interestOnClientMoney: 0,
    nonRecurringExpenses: 0,
    tiedAgentFees: 0,
    
    // Liquid assets inputs
    windDownPeriod: 3,
    additionalLiquidAssetsForHarm: 0,
    
    // Own funds inputs
    firmActivity: 'other', // default to 'other'
    additionalOwnFundsForHarm: 0,
    
    // Risk assessment inputs
    identifiedHarms: [],
    
    // Actual values for monitoring
    actualOwnFunds: 0,
    actualLiquidAssets: 0,
    
    // Stress scenarios
    stressScenarios: []
  });
  
  // State for calculation results
  const [calculationResults, setCalculationResults] = useState(null);
  
  // State for navigation
  const [activeModule, setActiveModule] = useState('dashboard');
  
  // State for stress test results
  const [stressTestResults, setStressTestResults] = useState(null);
  
  // State for concentration risk results
  const [concentrationResults, setConcentrationResults] = useState(null);
  
  // Firm data persistence
  const {
    firms,
    currentFirm,
    currentCalculation,
    createFirm,
    updateFirm,
    deleteFirm,
    selectFirm,
    saveCalculation,
    loadCalculation,
    deleteCalculation,
    exportFirmData,
    importFirmData
  } = useFirmDataPersistence();
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFirmData({
      ...firmData,
      [name]: parseFloat(value) || 0
    });
  };
  
  // Handle activity selection for PMCR
  const handleActivityChange = (e) => {
    setFirmData({
      ...firmData,
      firmActivity: e.target.value
    });
  };
  
  // Handle risk assessment updates
  const handleUpdateHarms = (harms) => {
    // Calculate total additional requirements from harms
    const materialHarms = harms.filter(harm => harm.likelihood * harm.impact >= 6);
    
    const additionalOwnFunds = materialHarms.reduce(
      (total, harm) => total + (parseFloat(harm.additionalOwnFunds) || 0), 
      0
    );
    
    const additionalLiquidAssets = materialHarms.reduce(
      (total, harm) => total + (parseFloat(harm.additionalLiquidAssets) || 0), 
      0
    );
    
    setFirmData({
      ...firmData,
      identifiedHarms: harms,
      additionalOwnFundsForHarm: additionalOwnFunds,
      additionalLiquidAssetsForHarm: additionalLiquidAssets
    });
  };
  
  // Handle stress test results
  const handleStressTestResults = (results) => {
    setStressTestResults(results);
    
    // Update stress scenarios in firm data
    setFirmData({
      ...firmData,
      stressScenarios: firmData.stressScenarios ? 
        firmData.stressScenarios.map(scenario => 
          scenario.id === results.scenario.id ? results.scenario : scenario
        ) : 
        [results.scenario]
    });
  };
  
  // Handle concentration risk results
  const handleConcentrationResults = (results) => {
    setConcentrationResults(results);
    
    // Update K-CON in firm data
    setFirmData({
      ...firmData,
      kconValue: results.kcon || 0
    });
  };
  
  // Handle loading a saved calculation
  const handleLoadCalculation = (data) => {
    if (data) {
      setFirmData(data);
      // Recalculate results
      performCalculations(data);
    }
  };
  
  // Perform all calculations
  const performCalculations = (data = firmData) => {
    const firmClassification = calculateFirmClassification(data);
    const kFactorRequirements = calculateKFactors(data);
    const fixedOverheadRequirement = calculateFOR(data);
    const liquidAssetsRequirement = calculateLiquidAssetsRequirement(data);
    const ownFundsRequirement = calculateOwnFundsRequirement(data);
    const icaraSummary = calculateICARA(data);
    
    const results = {
      firmClassification,
      kFactorRequirements,
      fixedOverheadRequirement,
      liquidAssetsRequirement,
      ownFundsRequirement,
      icaraSummary,
      identifiedHarms: data.identifiedHarms
    };
    
    setCalculationResults(results);
    return results;
  };
  
  // Navigation items
  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'calculations', label: 'Calculations', icon: BarChart2 },
    { id: 'risk', label: 'Risk Management', icon: AlertTriangle },
    { id: 'reporting', label: 'Regulatory Reporting', icon: FileText },
    { id: 'monitoring', label: 'Compliance Monitoring', icon: Settings },
    { id: 'icara', label: 'ICARA Document', icon: Book }
  ];
  
  // Format currency values
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Dashboard Module
  const DashboardModule = () => {
    // Calculate results for display if not already calculated
    const results = calculationResults || performCalculations();
    
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">MIFIDPRU Compliance Dashboard</h2>
        
        <div className="mb-6">
          <FirmManager onSelectFirm={(firmId) => {
            selectFirm(firmId);
          }} />
        </div>
        
        {results && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="font-semibold mb-2">Firm Classification</h3>
                <p className="text-2xl font-bold">{results.firmClassification}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {results.firmClassification === 'SNI' 
                    ? 'Small and Non-Interconnected' 
                    : 'Non-SNI (Standard regime)'}
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="font-semibold mb-2">Own Funds Requirement</h3>
                <p className="text-2xl font-bold">
                  {formatCurrency(results.ownFundsRequirement.totalOwnFundsRequirement)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Base: {formatCurrency(results.ownFundsRequirement.baseOwnFundsRequirement)}
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="font-semibold mb-2">Liquid Assets Requirement</h3>
                <p className="text-2xl font-bold">
                  {formatCurrency(results.liquidAssetsRequirement.liquidAssetsThresholdRequirement)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  1/3 FOR: {formatCurrency(results.liquidAssetsRequirement.oneThirdFOR)}
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-4">
                <h3 className="font-semibold mb-2">Material Harms</h3>
                <p className="text-2xl font-bold">
                  {results.identifiedHarms ? results.identifiedHarms.filter(h => h.likelihood * h.impact >= 6).length : 0}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Total: {results.identifiedHarms ? results.identifiedHarms.length : 0} potential harms
                </p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="font-semibold mb-3">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                  onClick={() => setActiveModule('calculations')}
                  className="p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 flex items-center"
                >
                  <BarChart2 className="mr-2 h-5 w-5" /> 
                  Update Calculations
                </button>
                
                <button
                  onClick={() => saveCalculation(firmData)}
                  className="p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 flex items-center"
                >
                  <FileText className="mr-2 h-5 w-5" /> 
                  Save Current Calculation
                </button>
                
                <button
                  onClick={() => setActiveModule('reporting')}
                  className="p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 flex items-center"
                >
                  <FileText className="mr-2 h-5 w-5" /> 
                  Generate Regulatory Report
                </button>
              </div>
            </div>
            
            <CalculationManager 
              firmData={firmData}
              onLoadCalculation={handleLoadCalculation}
            />
          </>
        )}
      </div>
    );
  };
  
  // Calculations Module
  const CalculationsModule = () => {
    // States for tab navigation
    const [activeTab, setActiveTab] = useState(0);
    
    // Calculate button handler
    const handleCalculate = () => {
      const results = performCalculations();
      
      // Show success message
      alert('Calculations completed successfully!');
      
      return results;
    };
    
    // Tabs for calculation sections
    const tabs = [
      { id: 'firm', label: 'Firm Classification' },
      { id: 'kfactors', label: 'K-Factors' },
      { id: 'for', label: 'Fixed Overhead' },
      { id: 'liquid', label: 'Liquid Assets' },
      { id: 'ownfunds', label: 'Own Funds' }
    ];
    
    // Module components based on the original implementation
    // These are simplified versions - in the full implementation they would be imported
    
    // Module 1: Firm Classification
    const FirmClassificationModule = () => (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Firm Classification</h2>
        <p className="mb-4">Enter your firm's metrics to determine if you are a Small and Non-Interconnected (SNI) investment firm.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assets Under Management (AUM) (£)
            </label>
            <input
              type="number"
              name="aum"
              value={firmData.aum}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Client Orders Handled - Cash Trades (£/day)
            </label>
            <input
              type="number"
              name="cohCash"
              value={firmData.cohCash}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          {/* Additional input fields would go here, similar to the original implementation */}
        </div>
      </div>
    );
    
    // Module 2: K-Factor Requirements
    const KFactorModule = () => (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">K-Factor Requirements</h2>
        <p className="mb-4">Calculate your K-factor requirements based on client, market, and firm risk metrics.</p>
        
        <h3 className="font-bold mt-4 mb-2">Client Risk K-Factors</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Assets Under Management (AUM) (£)
            </label>
            <input
              type="number"
              name="aum"
              value={firmData.aum}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          {/* Additional input fields would go here, similar to the original implementation */}
        </div>
      </div>
    );
    
    // Module 3: Fixed Overhead Requirement
    const FixedOverheadModule = () => (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Fixed Overhead Requirement</h2>
        <p className="mb-4">Calculate your Fixed Overhead Requirement (FOR) based on your annual expenditure.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Expenditure (£)
            </label>
            <input
              type="number"
              name="totalExpenditure"
              value={firmData.totalExpenditure}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          </div>
          
          {/* Additional input fields would go here, similar to the original implementation */}
        </div>
      </div>
    );
    
    // Module 4: Liquid Assets Requirement
    const LiquidAssetsModule = () => (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Liquid Assets Requirement</h2>
        <p className="mb-4">Calculate your liquid assets threshold requirement based on FOR, wind-down costs, and additional requirements for potential harms.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estimated Wind-Down Period (months)
            </label>
            <input
              type="number"
              name="windDownPeriod"
              value={firmData.windDownPeriod}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              min="1"
            />
          </div>
          
          {/* Additional input fields would go here, similar to the original implementation */}
        </div>
      </div>
    );
    
    // Module 5: Own Funds Requirement
    const OwnFundsModule = () => (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4">Own Funds Requirement</h2>
        <p className="mb-4">Calculate your own funds threshold requirement based on PMCR, FOR, KFR, and additional requirements for potential harms.</p>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Firm Activity Type
          </label>
          <select
            name="firmActivity"
            value={firmData.firmActivity}
            onChange={handleActivityChange}
            className="w-full p-2 border rounded"
          >
            <option value="dealing">Dealing on own account or underwriting</option>
            <option value="holdingClientMoney">Not dealing on own account but holding client money/assets</option>
            <option value="other">Other investment firms</option>
            <option value="local">Local firms</option>
          </select>
        </div>
        
        {/* Additional input fields would go here, similar to the original implementation */}
      </div>
    );
    
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">MIFIDPRU Calculations</h2>
          <button
            onClick={handleCalculate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Calculate Requirements
          </button>
        </div>
        
        <div className="mb-6">
          <div className="flex flex-wrap border-b">
            {tabs.map((tab, index) => (
              <button 
                key={tab.id}
                className={`py-2 px-4 ${activeTab === index ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
                onClick={() => setActiveTab(index)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        {activeTab === 0 && <FirmClassificationModule />}
        {activeTab === 1 && <KFactorModule />}
        {activeTab === 2 && <FixedOverheadModule />}
        {activeTab === 3 && <LiquidAssetsModule />}
        {activeTab === 4 && <OwnFundsModule />}
        
        {calculationResults && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-bold mb-2">Calculation Results Summary:</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p><strong>Firm Classification:</strong> {calculationResults.firmClassification}</p>
              <p><strong>K-Factor Requirement:</strong> {formatCurrency(calculationResults.kFactorRequirements.totalKFR)}</p>
              <p><strong>Fixed Overhead Requirement:</strong> {formatCurrency(calculationResults.fixedOverheadRequirement.FOR)}</p>
              <p><strong>Own Funds Requirement:</strong> {formatCurrency(calculationResults.ownFundsRequirement.totalOwnFundsRequirement)}</p>
              <p><strong>Liquid Assets Requirement:</strong> {formatCurrency(calculationResults.liquidAssetsRequirement.liquidAssetsThresholdRequirement)}</p>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Risk Management Module
  const RiskManagementModule = () => {
    // States for tab navigation
    const [activeTab, setActiveTab] = useState(0);
    
    // Tabs for risk management sections
    const tabs = [
      { id: 'risk_register', label: 'Risk Register' },
      { id: 'stress_testing', label: 'Stress Testing' },
      { id: 'concentration', label: 'Concentration Risk' }
    ];
    
    return (
      <div>
        <h2 className="text-xl font-bold mb-6">Risk Management</h2>
        
        <div className="mb-6">
          <div className="flex flex-wrap border-b">
            {tabs.map((tab, index) => (
              <button 
                key={tab.id}
                className={`py-2 px-4 ${activeTab === index ? 'border-b-2 border-blue-500 font-semibold' : 'text-gray-500'}`}
                onClick={() => setActiveTab(index)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        {activeTab === 0 && (
          <AdvancedRiskRegister 
            identifiedHarms={firmData.identifiedHarms}
            onUpdateHarms={handleUpdateHarms}
          />
        )}
        
        {activeTab === 1 && (
          <StressTesting
            firmData={firmData}
            onStressTestResults={handleStressTestResults}
          />
        )}
        
        {activeTab === 2 && (
          <ConcentrationRiskAnalysis
            firmData={firmData}
            onConcentrationResults={handleConcentrationResults}
          />
        )}
      </div>
    );
  };
  
  // Regulatory Reporting Module
  const ReportingModule = () => {
    return (
      <div>
        <h2 className="text-xl font-bold mb-6">Regulatory Reporting</h2>
        
        {calculationResults ? (
          <RegulatoryReportingDashboard
            firmData={currentFirm || { name: 'Your Firm' }}
            calculationData={calculationResults}
          />
        ) : (
          <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 p-4 rounded">
            <p>Please run calculations first to generate reporting data.</p>
            <button
              onClick={() => {
                performCalculations();
              }}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Run Calculations
            </button>
          </div>
        )}
      </div>
    );
  };
  
  // Compliance Monitoring Module
  const MonitoringModule = () => {
    const [actualValues, setActualValues] = useState({
      ownFunds: firmData.actualOwnFunds || 0,
      liquidAssets: firmData.actualLiquidAssets || 0
    });
    
    // Handle actual values change
    const handleActualValuesChange = (values) => {
      setActualValues(values);
      
      // Update firm data
      setFirmData({
        ...firmData,
        actualOwnFunds: values.ownFunds,
        actualLiquidAssets: values.liquidAssets
      });
    };
    
    return (
      <div>
        <h2 className="text-xl font-bold mb-6">Compliance Monitoring</h2>
        
        {calculationResults ? (
          <ComplianceMonitoringDashboard
            calculationData={calculationResults}
            actualValues={actualValues}
            onActualValuesChange={handleActualValuesChange}
          />
        ) : (
          <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 p-4 rounded">
            <p>Please run calculations first to set up monitoring.</p>
            <button
              onClick={() => {
                performCalculations();
              }}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Run Calculations
            </button>
          </div>
        )}
      </div>
    );
  };
  
  // ICARA Document Module
  const ICARADocumentModule = () => {
    return (
      <div>
        <h2 className="text-xl font-bold mb-6">ICARA Document Generator</h2>
        
        {calculationResults ? (
          <ICARADocumentGenerator
            firmData={currentFirm || { name: 'Your Firm' }}
            calculationData={calculationResults}
            scenarios={firmData.stressScenarios || []}
            complianceMetrics={{
              ownFundsBuffer: (firmData.actualOwnFunds / calculationResults.ownFundsRequirement.totalOwnFundsRequirement) * 100,
              liquidAssetsBuffer: (firmData.actualLiquidAssets / calculationResults.liquidAssetsRequirement.liquidAssetsThresholdRequirement) * 100
            }}
          />
        ) : (
          <div className="bg-yellow-50 border border-yellow-400 text-yellow-700 p-4 rounded">
            <p>Please run calculations first to generate ICARA document.</p>
            <button
              onClick={() => {
                performCalculations();
              }}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Run Calculations
            </button>
          </div>
        )}
      </div>
    );
  };
  
  // Render the appropriate module based on navigation
  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <DashboardModule />;
      case 'calculations':
        return <CalculationsModule />;
      case 'risk':
        return <RiskManagementModule />;
      case 'reporting':
        return <ReportingModule />;
      case 'monitoring':
        return <MonitoringModule />;
      case 'icara':
        return <ICARADocumentModule />;
      default:
        return <DashboardModule />;
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">MIFIDPRU Compliance Solution</h1>
            <div className="text-gray-600">
              {currentFirm ? (
                <span className="font-medium">{currentFirm.name}</span>
              ) : (
                <span>No firm selected</span>
              )}
            </div>
          </div>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap mb-6 bg-white shadow rounded-lg overflow-hidden">
          {navigationItems.map(item => (
            <button
              key={item.id}
              className={`flex items-center py-4 px-6 ${
                activeModule === item.id 
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-500' 
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveModule(item.id)}
            >
              <item.icon className="mr-2 h-5 w-5" />
              {item.label}
            </button>
          ))}
        </div>
        
        <div className="bg-white shadow rounded-lg p-6">
          {renderModule()}
        </div>
      </div>
      
      <footer className="bg-white shadow-md mt-8 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            MIFIDPRU Compliance Solution © {new Date().getFullYear()}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default MIFIDPRUComplianceApp;
