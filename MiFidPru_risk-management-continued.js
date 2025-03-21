// Continuing from the previous code segment...

              <div className="p-3 bg-blue-50 rounded-md mb-4">
                <h3 className="font-medium mb-1">Risk Rating</h3>
                <div className="flex items-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskRatingColor(newHarm.likelihood * newHarm.impact)}`}>
                    {getRiskRating(newHarm.likelihood * newHarm.impact)} ({newHarm.likelihood * newHarm.impact})
                  </span>
                  <span className="ml-2 text-sm text-gray-600">
                    Based on Likelihood ({newHarm.likelihood}) × Impact ({newHarm.impact})
                  </span>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  {newHarm.likelihood * newHarm.impact >= 6 
                    ? 'This is considered a material harm and will require additional resources.'
                    : 'This is not considered a material harm but should still be monitored.'}
                </p>
              </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCloseAddHarmModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddHarm}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add Harm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Stress Testing component
export const StressTesting = ({ firmData, onStressTestResults }) => {
  const [scenarios, setScenarios] = useState(DEFAULT_STRESS_SCENARIOS);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [showScenarioModal, setShowScenarioModal] = useState(false);
  const [newScenario, setNewScenario] = useState({
    name: '',
    description: '',
    impacts: [
      { factor: '', description: '', change: 0 }
    ],
    additionalOwnFunds: 0,
    additionalLiquidAssets: 0
  });
  const [stressResults, setStressResults] = useState(null);
  
  // Handle running a stress test
  const handleRunStressTest = (scenario) => {
    // Create a copy of the firm data to apply stress impacts
    const stressedData = JSON.parse(JSON.stringify(firmData));
    
    // Apply scenario impacts to the data
    scenario.impacts.forEach(impact => {
      switch (impact.factor) {
        case 'aum':
          stressedData.aum = firmData.aum * (1 + impact.change);
          break;
        case 'revenue':
          // Revenue might affect total expenditure in FOR calculation
          stressedData.totalExpenditure = firmData.totalExpenditure * (1 + (impact.change * -0.5)); // Simplistic reduction in expenditure
          break;
        case 'client_outflows':
          // Outflows might affect AUM
          stressedData.aum = firmData.aum * (1 - impact.change * 0.5);
          break;
        case 'operational_costs':
          // Operational costs affect expenses
          stressedData.totalExpenditure = firmData.totalExpenditure * (1 + impact.change * 0.3);
          break;
        // Add more factor types as needed
        default:
          // No direct mapping for this factor
          break;
      }
    });
    
    // Calculate stressed requirements
    const stressedKFactors = calculateKFactors(stressedData);
    const stressedFOR = calculateFOR(stressedData);
    const stressedLiquidAssets = calculateLiquidAssetsRequirement(stressedData);
    const stressedOwnFunds = calculateOwnFundsRequirement(stressedData);
    
    // Calculate the impacts
    const results = {
      scenario,
      impacts: {
        kfr: {
          baseline: calculateKFactors(firmData).totalKFR,
          stressed: stressedKFactors.totalKFR,
          change: ((stressedKFactors.totalKFR / calculateKFactors(firmData).totalKFR) - 1) * 100
        },
        for: {
          baseline: calculateFOR(firmData).FOR,
          stressed: stressedFOR.FOR,
          change: ((stressedFOR.FOR / calculateFOR(firmData).FOR) - 1) * 100
        },
        liquidAssets: {
          baseline: calculateLiquidAssetsRequirement(firmData).liquidAssetsThresholdRequirement,
          stressed: stressedLiquidAssets.liquidAssetsThresholdRequirement,
          change: ((stressedLiquidAssets.liquidAssetsThresholdRequirement / calculateLiquidAssetsRequirement(firmData).liquidAssetsThresholdRequirement) - 1) * 100
        },
        ownFunds: {
          baseline: calculateOwnFundsRequirement(firmData).totalOwnFundsRequirement,
          stressed: stressedOwnFunds.totalOwnFundsRequirement,
          change: ((stressedOwnFunds.totalOwnFundsRequirement / calculateOwnFundsRequirement(firmData).totalOwnFundsRequirement) - 1) * 100
        }
      },
      additionalRequirements: {
        ownFunds: scenario.additionalOwnFunds,
        liquidAssets: scenario.additionalLiquidAssets
      }
    };
    
    setStressResults(results);
    
    if (onStressTestResults) {
      onStressTestResults(results);
    }
  };
  
  // Handle opening the add scenario modal
  const handleOpenScenarioModal = () => {
    setShowScenarioModal(true);
    setNewScenario({
      name: '',
      description: '',
      impacts: [
        { factor: 'aum', description: 'Assets Under Management', change: 0 }
      ],
      additionalOwnFunds: 0,
      additionalLiquidAssets: 0
    });
  };
  
  // Handle closing the add scenario modal
  const handleCloseScenarioModal = () => {
    setShowScenarioModal(false);
  };
  
  // Handle new scenario form changes
  const handleNewScenarioChange = (e) => {
    const { name, value } = e.target;
    setNewScenario({
      ...newScenario,
      [name]: value
    });
  };
  
  // Handle adding a new impact to the scenario
  const handleAddImpact = () => {
    setNewScenario({
      ...newScenario,
      impacts: [...newScenario.impacts, { factor: '', description: '', change: 0 }]
    });
  };
  
  // Handle removing an impact from the scenario
  const handleRemoveImpact = (index) => {
    const updatedImpacts = [...newScenario.impacts];
    updatedImpacts.splice(index, 1);
    
    setNewScenario({
      ...newScenario,
      impacts: updatedImpacts
    });
  };
  
  // Handle impact changes
  const handleImpactChange = (index, field, value) => {
    const updatedImpacts = [...newScenario.impacts];
    updatedImpacts[index] = {
      ...updatedImpacts[index],
      [field]: field === 'change' ? parseFloat(value) : value
    };
    
    setNewScenario({
      ...newScenario,
      impacts: updatedImpacts
    });
  };
  
  // Handle adding a new scenario
  const handleAddScenario = () => {
    if (!newScenario.name || !newScenario.description) {
      alert('Please provide both a name and description for the scenario');
      return;
    }
    
    if (newScenario.impacts.some(impact => !impact.factor || !impact.description)) {
      alert('Please complete all impact factors and descriptions');
      return;
    }
    
    const newScenarioWithId = {
      ...newScenario,
      id: `scenario_${Date.now()}`
    };
    
    setScenarios([...scenarios, newScenarioWithId]);
    handleCloseScenarioModal();
  };
  
  // Handle deleting a scenario
  const handleDeleteScenario = (id) => {
    if (window.confirm('Are you sure you want to delete this scenario?')) {
      setScenarios(scenarios.filter(scenario => scenario.id !== id));
      
      if (selectedScenario && selectedScenario.id === id) {
        setSelectedScenario(null);
        setStressResults(null);
      }
    }
  };
  
  // Handle updating a scenario's additional requirements
  const handleUpdateScenarioRequirements = (id, field, value) => {
    const updatedScenarios = scenarios.map(scenario => {
      if (scenario.id === id) {
        return {
          ...scenario,
          [field]: parseFloat(value)
        };
      }
      return scenario;
    });
    
    setScenarios(updatedScenarios);
    
    if (selectedScenario && selectedScenario.id === id) {
      setSelectedScenario({
        ...selectedScenario,
        [field]: parseFloat(value)
      });
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Stress Testing</h2>
        <button
          onClick={handleOpenScenarioModal}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add New Scenario
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scenario Selection Panel */}
        <div className="col-span-1">
          <h3 className="font-semibold mb-3">Stress Scenarios</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {scenarios.map(scenario => (
              <div 
                key={scenario.id}
                className={`p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition ${selectedScenario && selectedScenario.id === scenario.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
                onClick={() => setSelectedScenario(scenario)}
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-medium">{scenario.name}</h4>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteScenario(scenario.id);
                    }}
                    className="text-red-600 hover:text-red-900 text-sm"
                  >
                    Delete
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-1">{scenario.description}</p>
                <div className="mt-2 space-y-1">
                  {scenario.impacts.map((impact, index) => (
                    <div key={index} className="text-xs text-gray-500 flex items-center">
                      <span className="mr-1">{impact.description}:</span>
                      <span className={impact.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                        {formatPercentageChange(impact.change)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Scenario Details and Results */}
        <div className="col-span-1 lg:col-span-2">
          {selectedScenario ? (
            <div>
              <div className="mb-4">
                <h3 className="font-semibold text-lg">{selectedScenario.name}</h3>
                <p className="text-gray-600 mt-1">{selectedScenario.description}</p>
                
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Scenario Impacts</h4>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Factor</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Change</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedScenario.impacts.map((impact, index) => (
                        <tr key={index}>
                          <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-900">{impact.description}</td>
                          <td className="px-3 py-2 whitespace-nowrap text-sm">
                            <span className={impact.change >= 0 ? 'text-green-600' : 'text-red-600'}>
                              {formatPercentageChange(impact.change)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Own Funds Required (£)
                    </label>
                    <input
                      type="number"
                      value={selectedScenario.additionalOwnFunds}
                      onChange={(e) => handleUpdateScenarioRequirements(selectedScenario.id, 'additionalOwnFunds', e.target.value)}
                      className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      min="0"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Additional Liquid Assets Required (£)
                    </label>
                    <input
                      type="number"
                      value={selectedScenario.additionalLiquidAssets}
                      onChange={(e) => handleUpdateScenarioRequirements(selectedScenario.id, 'additionalLiquidAssets', e.target.value)}
                      className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      min="0"
                    />
                  </div>
                </div>
                
                <div className="mt-4">
                  <button
                    onClick={() => handleRunStressTest(selectedScenario)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Run Stress Test
                  </button>
                </div>
              </div>
              
              {stressResults && stressResults.scenario.id === selectedScenario.id && (
                <div className="mt-6 bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Stress Test Results</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded border">
                      <h4 className="font-medium mb-1">K-Factor Requirement</h4>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">Baseline: {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(stressResults.impacts.kfr.baseline)}</p>
                          <p className="text-sm text-gray-600">Stressed: {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(stressResults.impacts.kfr.stressed)}</p>
                        </div>
                        <div className={`text-lg font-bold ${stressResults.impacts.kfr.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stressResults.impacts.kfr.change.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-3 rounded border">
                      <h4 className="font-medium mb-1">Fixed Overhead Requirement</h4>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">Baseline: {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(stressResults.impacts.for.baseline)}</p>
                          <p className="text-sm text-gray-600">Stressed: {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(stressResults.impacts.for.stressed)}</p>
                        </div>
                        <div className={`text-lg font-bold ${stressResults.impacts.for.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stressResults.impacts.for.change.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-3 rounded border">
                      <h4 className="font-medium mb-1">Own Funds Requirement</h4>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">Baseline: {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(stressResults.impacts.ownFunds.baseline)}</p>
                          <p className="text-sm text-gray-600">Stressed: {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(stressResults.impacts.ownFunds.stressed)}</p>
                        </div>
                        <div className={`text-lg font-bold ${stressResults.impacts.ownFunds.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stressResults.impacts.ownFunds.change.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white p-3 rounded border">
                      <h4 className="font-medium mb-1">Liquid Assets Requirement</h4>
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm text-gray-600">Baseline: {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(stressResults.impacts.liquidAssets.baseline)}</p>
                          <p className="text-sm text-gray-600">Stressed: {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(stressResults.impacts.liquidAssets.stressed)}</p>
                        </div>
                        <div className={`text-lg font-bold ${stressResults.impacts.liquidAssets.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {stressResults.impacts.liquidAssets.change.toFixed(1)}%
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-yellow-50 rounded border border-yellow-200">
                    <h4 className="font-medium mb-1">Additional Requirements for Stress Scenario</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm">Additional Own Funds: {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(stressResults.additionalRequirements.ownFunds)}</p>
                      </div>
                      <div>
                        <p className="text-sm">Additional Liquid Assets: {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(stressResults.additionalRequirements.liquidAssets)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center p-8 bg-gray-50 rounded-lg">
              <div className="text-center">
                <p className="text-lg text-gray-600">Select a scenario to view details and run a stress test</p>
                <p className="text-sm text-gray-500 mt-2">
                  Stress testing helps assess the impact of adverse scenarios on your prudential requirements
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Add Scenario Modal */}
      {showScenarioModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <h2 className="text-xl font-bold mb-4">Add Stress Scenario</h2>
            
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scenario Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={newScenario.name}
                  onChange={handleNewScenarioChange}
                  className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., Market Downturn"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scenario Description
                </label>
                <textarea
                  name="description"
                  value={newScenario.description}
                  onChange={handleNewScenarioChange}
                  className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  rows="2"
                  placeholder="Describe the stress scenario"
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Scenario Impacts
                </label>
                <div className="space-y-3">
                  {newScenario.impacts.map((impact, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-5">
                        <input
                          type="text"
                          value={impact.description}
                          onChange={(e) => handleImpactChange(index, 'description', e.target.value)}
                          className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Impact description"
                        />
                      </div>
                      <div className="col-span-3">
                        <select
                          value={impact.factor}
                          onChange={(e) => handleImpactChange(index, 'factor', e.target.value)}
                          className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        >
                          <option value="">Select factor</option>
                          <option value="aum">AUM</option>
                          <option value="revenue">Revenue</option>
                          <option value="client_outflows">Client Outflows</option>
                          <option value="operational_costs">Operational Costs</option>
                          <option value="regulatory_costs">Regulatory Costs</option>
                          <option value="legal_costs">Legal Costs</option>
                          <option value="credit_losses">Credit Losses</option>
                          <option value="recruitment_costs">Recruitment Costs</option>
                          <option value="remediation_costs">Remediation Costs</option>
                        </select>
                      </div>
                      <div className="col-span-3">
                        <div className="flex items-center">
                          <input
                            type="number"
                            value={impact.change}
                            onChange={(e) => handleImpactChange(index, 'change', e.target.value)}
                            className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            step="0.01"
                            placeholder="Change"
                          />
                          <span className="ml-1">×</span>
                        </div>
                      </div>
                      <div className="col-span-1">
                        <button
                          onClick={() => handleRemoveImpact(index)}
                          className="text-red-600 hover:text-red-900"
                          disabled={newScenario.impacts.length <= 1}
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  <button
                    onClick={handleAddImpact}
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    + Add Impact
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Enter impacts as decimal values (e.g., -0.3 for -30%, 0.5 for +50%)
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Own Funds Required (£)
                  </label>
                  <input
                    type="number"
                    name="additionalOwnFunds"
                    value={newScenario.additionalOwnFunds}
                    onChange={handleNewScenarioChange}
                    className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    min="0"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Liquid Assets Required (£)
                  </label>
                  <input
                    type="number"
                    name="additionalLiquidAssets"
                    value={newScenario.additionalLiquidAssets}
                    onChange={handleNewScenarioChange}
                    className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    min="0"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCloseScenarioModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddScenario}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add Scenario
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Concentration Risk Analysis component
export const ConcentrationRiskAnalysis = ({ firmData, onConcentrationResults }) => {
  const [exposures, setExposures] = useState([]);
  const [newExposure, setNewExposure] = useState({
    counterpartyName: '',
    counterpartyType: 'institution',
    exposureValue: 0,
    collateral: 0,
    exposurePercent: 0
  });
  const [showAddExposureModal, setShowAddExposureModal] = useState(false);
  const [concentrationResults, setConcentrationResults] = useState(null);
  
  // Calculate own funds (simplified approximation for the example)
  const calculateOwnFunds = () => {
    return firmData && firmData.additionalOwnFundsForHarm
      ? calculateOwnFundsRequirement(firmData).totalOwnFundsRequirement
      : 1000000; // Default value if no data available
  };
  
  // Calculate concentration limits
  const calculateLimits = () => {
    const ownFunds = calculateOwnFunds();
    
    return {
      institutions: ownFunds * 0.25, // 25% of own funds
      retail: ownFunds * 0.25, // 25% of own funds
      unregulated: ownFunds * 0.25, // 25% of own funds
      group: ownFunds * 0.25, // 25% of own funds
      exchange: ownFunds * 0.25, // 25% of own funds
      clearinghouse: ownFunds * 0.25, // 25% of own funds
    };
  };
  
  // Check if an exposure exceeds its limit
  const isExceedingLimit = (exposure) => {
    const limits = calculateLimits();
    const limit = limits[exposure.counterpartyType] || limits.unregulated;
    return exposure.exposureValue - exposure.collateral > limit;
  };
  
  // Calculate concentration risk (K-CON)
  const calculateKCON = () => {
    const ownFunds = calculateOwnFunds();
    const limits = calculateLimits();
    
    let kcon = 0;
    const excessExposures = exposures.filter(isExceedingLimit);
    
    excessExposures.forEach(exposure => {
      const limit = limits[exposure.counterpartyType] || limits.unregulated;
      const netExposure = exposure.exposureValue - exposure.collateral;
      const excess = netExposure - limit;
      
      if (excess > 0) {
        // Simplified K-CON calculation
        kcon += excess;
      }
    });
    
    return kcon;
  };
  
  // Update all exposure percentages based on current own funds
  const updateExposurePercentages = () => {
    const ownFunds = calculateOwnFunds();
    
    const updatedExposures = exposures.map(exposure => {
      const netExposure = exposure.exposureValue - exposure.collateral;
      const exposurePercent = (netExposure / ownFunds) * 100;
      
      return {
        ...exposure,
        exposurePercent
      };
    });
    
    setExposures(updatedExposures);
  };
  
  // Update percentages when own funds change
  useEffect(() => {
    if (exposures.length > 0) {
      updateExposurePercentages();
    }
  }, [firmData]);
  
  // Handle opening the add exposure modal
  const handleOpenAddExposureModal = () => {
    setShowAddExposureModal(true);
    setNewExposure({
      counterpartyName: '',
      counterpartyType: 'institution',
      exposureValue: 0,
      collateral: 0,
      exposurePercent: 0
    });
  };
  
  // Handle closing the add exposure modal
  const handleCloseAddExposureModal = () => {
    setShowAddExposureModal(false);
  };
  
  // Handle new exposure form changes
  const handleNewExposureChange = (e) => {
    const { name, value } = e.target;
    
    const updatedExposure = {
      ...newExposure,
      [name]: name === 'exposureValue' || name === 'collateral' ? parseFloat(value) : value
    };
    
    // Calculate exposure percent
    if (name === 'exposureValue' || name === 'collateral') {
      const ownFunds = calculateOwnFunds();
      const netExposure = updatedExposure.exposureValue - updatedExposure.collateral;
      updatedExposure.exposurePercent = (netExposure / ownFunds) * 100;
    }
    
    setNewExposure(updatedExposure);
  };
  
  // Handle adding a new exposure
  const handleAddExposure = () => {
    if (!newExposure.counterpartyName) {
      alert('Please provide a counterparty name');
      return;
    }
    
    const newExposureWithId = {
      ...newExposure,
      id: `exposure_${Date.now()}`
    };
    
    const updatedExposures = [...exposures, newExposureWithId];
    setExposures(updatedExposures);
    handleCloseAddExposureModal();
    
    // Recalculate concentration risk
    const kcon = calculateKCON();
    const results = {
      exposures: updatedExposures,
      limits: calculateLimits(),
      ownFunds: calculateOwnFunds(),
      kcon,
      exceedingExposures: updatedExposures.filter(isExceedingLimit).length
    };
    
    setConcentrationResults(results);
    
    if (onConcentrationResults) {
      onConcentrationResults(results);
    }
  };
  
  // Handle updating an exposure
  const handleUpdateExposure = (id, field, value) => {
    const updatedExposures = exposures.map(exposure => {
      if (exposure.id === id) {
        const updatedExposure = { 
          ...exposure, 
          [field]: field === 'exposureValue' || field === 'collateral' 
            ? parseFloat(value) 
            : value 
        };
        
        // Recalculate exposure percent if necessary
        if (field === 'exposureValue' || field === 'collateral') {
          const ownFunds = calculateOwnFunds();
          const netExposure = updatedExposure.exposureValue - updatedExposure.collateral;
          updatedExposure.exposurePercent = (netExposure / ownFunds) * 100;
        }
        
        return updatedExposure;
      }
      return exposure;
    });
    
    setExposures(updatedExposures);
    
    // Recalculate concentration risk
    const kcon = calculateKCON();
    const results = {
      exposures: updatedExposures,
      limits: calculateLimits(),
      ownFunds: calculateOwnFunds(),
      kcon,
      exceedingExposures: updatedExposures.filter(isExceedingLimit).length
    };
    
    setConcentrationResults(results);
    
    if (onConcentrationResults) {
      onConcentrationResults(results);
    }
  };
  
  // Handle deleting an exposure
  const handleDeleteExposure = (id) => {
    if (window.confirm('Are you sure you want to delete this exposure?')) {
      const updatedExposures = exposures.filter(exposure => exposure.id !== id);
      setExposures(updatedExposures);
      
      // Recalculate concentration risk
      const kcon = calculateKCON();
      const results = {
        exposures: updatedExposures,
        limits: calculateLimits(),
        ownFunds: calculateOwnFunds(),
        kcon,
        exceedingExposures: updatedExposures.filter(isExceedingLimit).length
      };
      
      setConcentrationResults(results);
      
      if (onConcentrationResults) {
        onConcentrationResults(results);
      }
    }
  };
  
  // Calculate the K-CON
  const handleCalculateKCON = () => {
    const kcon = calculateKCON();
    const results = {
      exposures,
      limits: calculateLimits(),
      ownFunds: calculateOwnFunds(),
      kcon,
      exceedingExposures: exposures.filter(isExceedingLimit).length
    };
    
    setConcentrationResults(results);
    
    if (onConcentrationResults) {
      onConcentrationResults(results);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Concentration Risk Analysis</h2>
        <button
          onClick={handleOpenAddExposureModal}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Exposure
        </button>
      </div>
      
      <div className="mb-6">
        <h3 className="font-semibold mb-2">Concentration Limits</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Object.entries(calculateLimits()).map(([type, limit]) => (
            <div key={type} className="p-3 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium capitalize">{type}</h4>
              <p className="text-lg font-bold">
                {new Intl.NumberFormat('en-GB', {
                  style: 'currency',
                  currency: 'GBP',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                }).format(limit)}
              </p>
              <p className="text-xs text-gray-500">25% of Own Funds</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Exposures Table */}
      {exposures.length > 0 ? (
        <div className="overflow-x-auto mb-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Counterparty</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exposure (£)</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Collateral (£)</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Net (%)</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {exposures.map(exposure => {
                const isExceeding = isExceedingLimit(exposure);
                
                return (
                  <tr key={exposure.id}>
                    <td className="px-3 py-3 text-sm font-medium text-gray-900">
                      {exposure.counterpartyName}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-500 capitalize">
                      {exposure.counterpartyType}
                    </td>
                    <td className="px-3 py-3 text-sm">
                      <input
                        type="number"
                        value={exposure.exposureValue}
                        onChange={(e) => handleUpdateExposure(exposure.id, 'exposureValue', e.target.value)}
                        className="block w-full py-1 px-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        min="0"
                      />
                    </td>
                    <td className="px-3 py-3 text-sm">
                      <input
                        type="number"
                        value={exposure.collateral}
                        onChange={(e) => handleUpdateExposure(exposure.id, 'collateral', e.target.value)}
                        className="block w-full py-1 px-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        min="0"
                      />
                    </td>
                    <td className="px-3 py-3 text-sm font-medium">
                      {exposure.exposurePercent.toFixed(1)}%
                    </td>
                    <td className="px-3 py-3 text-sm">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${isExceeding ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                        {isExceeding ? 'Exceeding' : 'Within Limit'}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-sm">
                      <button
                        onClick={() => handleDeleteExposure(exposure.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 mb-6">
          <p className="text-gray-500">No exposures have been added yet. Click "Add Exposure" to get started.</p>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <button
          onClick={handleCalculateKCON}
          disabled={exposures.length === 0}
          className={`px-4 py-2 rounded ${exposures.length > 0 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          Calculate K-CON
        </button>
        
        {concentrationResults && (
          <div className="text-right">
            <p className="text-sm text-gray-600">Exposures exceeding limits: {concentrationResults.exceedingExposures}</p>
            <p className="text-lg font-bold">
              K-CON: {new Intl.NumberFormat('en-GB', {
                style: 'currency',
                currency: 'GBP',
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              }).format(concentrationResults.kcon)}
            </p>
          </div>
        )}
      </div>
      
      {/* Add Exposure Modal */}
      {showAddExposureModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-xl w-full">
            <h2 className="text-xl font-bold mb-4">Add Exposure</h2>
            
            <div className="grid grid-cols-1 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Counterparty Name
                </label>
                <input
                  type="text"
                  name="counterpartyName"
                  value={newExposure.counterpartyName}
                  onChange={handleNewExposureChange}
                  className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="e.g., Bank ABC"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Counterparty Type
                </label>
                <select
                  name="counterpartyType"
                  value={newExposure.counterpartyType}
                  onChange={handleNewExposureChange}
                  className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="institution">Institution</option>
                  <option value="retail">Retail</option>
                  <option value="unregulated">Unregulated</option>
                  <option value="group">Group Entity</option>
                  <option value="exchange">Exchange</option>
                  <option value="clearinghouse">Clearing House</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exposure Value (£)
                </label>
                <input
                  type="number"
                  name="exposureValue"
                  value={newExposure.exposureValue}
                  onChange={handleNewExposureChange}
                  className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  min="0"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Collateral Value (£)
                </label>
                <input
                  type="number"
                  name="collateral"
                  value={newExposure.collateral}
                  onChange={handleNewExposureChange}
                  className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  min="0"
                />
              </div>
              
              <div className="p-3 bg-blue-50 rounded-md">
                <h3 className="font-medium mb-1">Exposure Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Net Exposure: {new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(newExposure.exposureValue - newExposure.collateral)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Percent of Own Funds: {newExposure.exposurePercent.toFixed(1)}%</p>
                  </div>
                </div>
                <p className="mt-1 text-sm">
                  Status: 
                  <span className={`ml-1 ${newExposure.exposurePercent > 25 ? 'text-red-600' : 'text-green-600'}`}>
                    {newExposure.exposurePercent > 25 ? 'Will exceed limit' : 'Within limit'}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleCloseAddExposureModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleAddExposure}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Add Exposure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper functions (to be imported from main calculation modules)
function calculateKFactors(firmData) {
  // Implementation imported from main application
  return { totalKFR: 0 };
}

function calculateFOR(firmData) {
  // Implementation imported from main application
  return { FOR: 0 };
}

function calculateLiquidAssetsRequirement(firmData) {
  // Implementation imported from main application
  return { liquidAssetsThresholdRequirement: 0 };
}

function calculateOwnFundsRequirement(firmData) {
  // Implementation imported from main application
  return { totalOwnFundsRequirement: 0 };
}
