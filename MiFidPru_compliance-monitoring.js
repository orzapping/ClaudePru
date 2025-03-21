// Compliance Monitoring Dashboard
import React, { useState, useEffect } from 'react';

// Constants for threshold levels
const THRESHOLD_LEVELS = {
  CRITICAL: {
    label: 'Critical',
    color: 'bg-red-100 text-red-800',
    triggerPercent: 100,
    description: 'Threshold breached - immediate action required'
  },
  WARNING: {
    label: 'Warning',
    color: 'bg-yellow-100 text-yellow-800',
    triggerPercent: 90,
    description: 'Close to threshold - prepare mitigation plans'
  },
  WATCH: {
    label: 'Watch',
    color: 'bg-blue-100 text-blue-800',
    triggerPercent: 75,
    description: 'Monitor closely - consider precautionary measures'
  },
  NORMAL: {
    label: 'Normal',
    color: 'bg-green-100 text-green-800',
    triggerPercent: 0,
    description: 'Comfortable buffer maintained'
  }
};

// Helper function to determine threshold level based on percentage
const getThresholdLevel = (currentValue, thresholdValue) => {
  const percentage = (currentValue / thresholdValue) * 100;
  
  if (percentage >= THRESHOLD_LEVELS.CRITICAL.triggerPercent) {
    return THRESHOLD_LEVELS.CRITICAL;
  } else if (percentage >= THRESHOLD_LEVELS.WARNING.triggerPercent) {
    return THRESHOLD_LEVELS.WARNING;
  } else if (percentage >= THRESHOLD_LEVELS.WATCH.triggerPercent) {
    return THRESHOLD_LEVELS.WATCH;
  } else {
    return THRESHOLD_LEVELS.NORMAL;
  }
};

// Compliance Metric Card Component
const MetricCard = ({ title, currentValue, thresholdValue, formatter, increasingIsBad = true, description }) => {
  // Calculate percentage of threshold
  const percentage = thresholdValue ? (currentValue / thresholdValue) * 100 : 0;
  
  // Determine threshold level
  const thresholdLevel = getThresholdLevel(currentValue, thresholdValue);
  
  // Determine if the direction of change is bad (for styling)
  const isNegativeTrend = increasingIsBad ? percentage > 75 : percentage < 25;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${thresholdLevel.color}`}>
          {thresholdLevel.label}
        </span>
      </div>
      
      <div className="flex justify-between items-baseline mb-4">
        <div className="text-2xl font-bold">
          {formatter ? formatter(currentValue) : currentValue}
        </div>
        <div className="text-sm text-gray-500">
          of {formatter ? formatter(thresholdValue) : thresholdValue}
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${
            isNegativeTrend 
              ? `bg-red-600`
              : `bg-green-600`
          }`}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        ></div>
      </div>
      
      <p className="mt-2 text-xs text-gray-600">{description || thresholdLevel.description}</p>
    </div>
  );
};

// Helper function to format currency values
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Helper function to format percentage values
const formatPercentage = (value) => {
  return `${value.toFixed(1)}%`;
};

// Compliance Monitor component
export const ComplianceMonitor = ({ calculationData, actualValues }) => {
  const [actualOwnFunds, setActualOwnFunds] = useState(actualValues?.ownFunds || 0);
  const [actualLiquidAssets, setActualLiquidAssets] = useState(actualValues?.liquidAssets || 0);
  const [alerts, setAlerts] = useState([]);
  
  // Update state when prop values change
  useEffect(() => {
    if (actualValues) {
      setActualOwnFunds(actualValues.ownFunds || 0);
      setActualLiquidAssets(actualValues.liquidAssets || 0);
    }
  }, [actualValues]);
  
  // Generate alerts based on threshold levels
  useEffect(() => {
    if (!calculationData) return;
    
    const newAlerts = [];
    
    // Check Own Funds threshold
    const ownFundsThreshold = calculationData.ownFundsRequirement.totalOwnFundsRequirement;
    const ownFundsPercentage = (actualOwnFunds / ownFundsThreshold) * 100;
    const ownFundsLevel = getThresholdLevel(actualOwnFunds, ownFundsThreshold);
    
    if (ownFundsLevel !== THRESHOLD_LEVELS.NORMAL) {
      newAlerts.push({
        id: `own_funds_${Date.now()}`,
        timestamp: new Date(),
        level: ownFundsLevel.label,
        message: `Own Funds at ${formatPercentage(ownFundsPercentage)} of threshold (${formatCurrency(actualOwnFunds)} of ${formatCurrency(ownFundsThreshold)})`
      });
    }
    
    // Check Liquid Assets threshold
    const liquidAssetsThreshold = calculationData.liquidAssetsRequirement.liquidAssetsThresholdRequirement;
    const liquidAssetsPercentage = (actualLiquidAssets / liquidAssetsThreshold) * 100;
    const liquidAssetsLevel = getThresholdLevel(actualLiquidAssets, liquidAssetsThreshold);
    
    if (liquidAssetsLevel !== THRESHOLD_LEVELS.NORMAL) {
      newAlerts.push({
        id: `liquid_assets_${Date.now()}`,
        timestamp: new Date(),
        level: liquidAssetsLevel.label,
        message: `Liquid Assets at ${formatPercentage(liquidAssetsPercentage)} of threshold (${formatCurrency(actualLiquidAssets)} of ${formatCurrency(liquidAssetsThreshold)})`
      });
    }
    
    setAlerts(newAlerts);
  }, [calculationData, actualOwnFunds, actualLiquidAssets]);
  
  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'actualOwnFunds') {
      setActualOwnFunds(parseFloat(value) || 0);
    } else if (name === 'actualLiquidAssets') {
      setActualLiquidAssets(parseFloat(value) || 0);
    }
  };
  
  // Calculate compliance metrics
  const calculateComplianceMetrics = () => {
    if (!calculationData) return {};
    
    const ownFundsRequirement = calculationData.ownFundsRequirement.totalOwnFundsRequirement;
    const liquidAssetsRequirement = calculationData.liquidAssetsRequirement.liquidAssetsThresholdRequirement;
    
    return {
      ownFundsBuffer: (actualOwnFunds / ownFundsRequirement) * 100,
      liquidAssetsBuffer: (actualLiquidAssets / liquidAssetsRequirement) * 100,
      recoveryPlanTrigger: ownFundsRequirement * 1.1,
      windDownTrigger: ownFundsRequirement * 1.05
    };
  };
  
  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };
  
  // Get alert color based on level
  const getAlertColor = (level) => {
    switch (level) {
      case 'Critical':
        return 'bg-red-100 border-red-500 text-red-800';
      case 'Warning':
        return 'bg-yellow-100 border-yellow-500 text-yellow-800';
      case 'Watch':
        return 'bg-blue-100 border-blue-500 text-blue-800';
      default:
        return 'bg-gray-100 border-gray-500 text-gray-800';
    }
  };
  
  // Get metrics from calculation
  const metrics = calculateComplianceMetrics();
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Compliance Monitoring Dashboard</h2>
      
      {!calculationData ? (
        <p className="text-gray-500 italic">Please load calculation data to view the monitoring dashboard</p>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Actual Own Funds (£)
              </label>
              <input
                type="number"
                name="actualOwnFunds"
                value={actualOwnFunds}
                onChange={handleInputChange}
                className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                min="0"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Actual Liquid Assets (£)
              </label>
              <input
                type="number"
                name="actualLiquidAssets"
                value={actualLiquidAssets}
                onChange={handleInputChange}
                className="block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                min="0"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <MetricCard
              title="Own Funds"
              currentValue={actualOwnFunds}
              thresholdValue={calculationData.ownFundsRequirement.totalOwnFundsRequirement}
              formatter={formatCurrency}
              increasingIsBad={false}
              description={`${formatPercentage(metrics.ownFundsBuffer)} of required minimum`}
            />
            
            <MetricCard
              title="Liquid Assets"
              currentValue={actualLiquidAssets}
              thresholdValue={calculationData.liquidAssetsRequirement.liquidAssetsThresholdRequirement}
              formatter={formatCurrency}
              increasingIsBad={false}
              description={`${formatPercentage(metrics.liquidAssetsBuffer)} of required minimum`}
            />
            
            <MetricCard
              title="Recovery Plan Trigger"
              currentValue={actualOwnFunds}
              thresholdValue={metrics.recoveryPlanTrigger}
              formatter={formatCurrency}
              increasingIsBad={false}
              description="110% of Own Funds Requirement"
            />
            
            <MetricCard
              title="Wind-Down Trigger"
              currentValue={actualOwnFunds}
              thresholdValue={metrics.windDownTrigger}
              formatter={formatCurrency}
              increasingIsBad={false}
              description="105% of Own Funds Requirement"
            />
          </div>
          
          <div className="mb-6">
            <h3 className="font-semibold mb-3">Threshold Alerts</h3>
            {alerts.length > 0 ? (
              <div className="space-y-3">
                {alerts.map(alert => (
                  <div 
                    key={alert.id}
                    className={`border-l-4 p-4 rounded ${getAlertColor(alert.level)}`}
                  >
                    <div className="flex justify-between">
                      <span className="font-semibold">{alert.level} Alert</span>
                      <span className="text-sm">{formatDate(alert.timestamp)}</span>
                    </div>
                    <p className="mt-1">{alert.message}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-green-100 text-green-800 rounded">
                <p>No threshold alerts - all metrics within normal ranges</p>
              </div>
            )}
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-3">Threshold Explanations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm mb-1">Own Funds Threshold</h4>
                <p className="text-sm text-gray-600">The minimum amount of capital a firm must maintain to meet its MIFIDPRU requirements.</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-1">Liquid Assets Threshold</h4>
                <p className="text-sm text-gray-600">The minimum amount of liquid assets a firm must maintain to meet its MIFIDPRU requirements.</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-1">Recovery Plan Trigger</h4>
                <p className="text-sm text-gray-600">The level at which a firm's recovery plan should be activated (110% of own funds requirement).</p>
              </div>
              
              <div>
                <h4 className="font-medium text-sm mb-1">Wind-Down Trigger</h4>
                <p className="text-sm text-gray-600">The level at which a firm should consider implementing its wind-down plan (105% of own funds requirement).</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

// Monthly Metrics History component
export const MonthlyMetricsHistory = ({ historicalData }) => {
  const [showData, setShowData] = useState(historicalData || generateDummyHistoricalData());
  
  // Generate dummy historical data if none provided
  function generateDummyHistoricalData() {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const currentYear = new Date().getFullYear();
    
    return months.map((month, index) => {
      const baseline = 1000000 + (index * 50000);
      
      return {
        month: `${month} ${currentYear}`,
        ownFundsRequirement: baseline,
        actualOwnFunds: baseline * (1 + Math.random() * 0.5),
        liquidAssetsRequirement: baseline * 0.3,
        actualLiquidAssets: baseline * 0.3 * (1 + Math.random() * 0.5),
        kFactorRequirement: baseline * 0.7,
        fixedOverheadRequirement: baseline * 0.8
      };
    });
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Monthly Metrics History</h2>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Own Funds Req.</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual Own Funds</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buffer %</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Liquid Assets Req.</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual Liquid Assets</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Buffer %</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {showData.map((data, index) => {
              const ownFundsBuffer = (data.actualOwnFunds / data.ownFundsRequirement) * 100;
              const liquidAssetsBuffer = (data.actualLiquidAssets / data.liquidAssetsRequirement) * 100;
              
              return (
                <tr key={index}>
                  <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {data.month}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(data.ownFundsRequirement)}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(data.actualOwnFunds)}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      ownFundsBuffer >= 150 ? 'bg-green-100 text-green-800' :
                      ownFundsBuffer >= 120 ? 'bg-blue-100 text-blue-800' :
                      ownFundsBuffer >= 100 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {formatPercentage(ownFundsBuffer)}
                    </span>
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(data.liquidAssetsRequirement)}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm text-gray-500">
                    {formatCurrency(data.actualLiquidAssets)}
                  </td>
                  <td className="px-3 py-3 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      liquidAssetsBuffer >= 150 ? 'bg-green-100 text-green-800' :
                      liquidAssetsBuffer >= 120 ? 'bg-blue-100 text-blue-800' :
                      liquidAssetsBuffer >= 100 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {formatPercentage(liquidAssetsBuffer)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Main Compliance Monitoring Dashboard component
export const ComplianceMonitoringDashboard = ({ calculationData, actualValues, historicalData }) => {
  return (
    <div>
      <ComplianceMonitor calculationData={calculationData} actualValues={actualValues} />
      <MonthlyMetricsHistory historicalData={historicalData} />
    </div>
  );
};
