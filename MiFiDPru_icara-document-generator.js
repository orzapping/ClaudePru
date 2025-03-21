// ICARA Document Generator
import React, { useState, useEffect } from 'react';

// Constants for document sections
const DOCUMENT_SECTIONS = {
  EXECUTIVE_SUMMARY: {
    id: 'executive_summary',
    title: 'Executive Summary',
    description: 'Overview of the firm, its business model, and key ICARA conclusions',
    required: true
  },
  BUSINESS_MODEL: {
    id: 'business_model',
    title: 'Business Model Analysis',
    description: 'Description of the firm\'s business model, strategy, and activities',
    required: true
  },
  GOVERNANCE: {
    id: 'governance',
    title: 'Governance Arrangements',
    description: 'Overview of the firm\'s governance structure and risk management framework',
    required: true
  },
  RISK_ASSESSMENT: {
    id: 'risk_assessment',
    title: 'Harm Identification and Risk Assessment',
    description: 'Assessment of potential harms to clients, markets, and the firm',
    required: true
  },
  CAPITAL_ADEQUACY: {
    id: 'capital_adequacy',
    title: 'Capital Adequacy Assessment',
    description: 'Analysis of own funds requirements and additional capital needed',
    required: true
  },
  LIQUIDITY_ADEQUACY: {
    id: 'liquidity_adequacy',
    title: 'Liquidity Adequacy Assessment',
    description: 'Analysis of liquid assets requirements and additional liquidity needed',
    required: true
  },
  STRESS_TESTING: {
    id: 'stress_testing',
    title: 'Stress Testing',
    description: 'Results of stress tests and their impact on capital and liquidity',
    required: true
  },
  WIND_DOWN: {
    id: 'wind_down',
    title: 'Wind-Down Analysis',
    description: 'Plan for orderly wind-down of the firm\'s business',
    required: true
  },
  RECOVERY_PLAN: {
    id: 'recovery_plan',
    title: 'Recovery Plan',
    description: 'Actions the firm will take to recover from stress scenarios',
    required: true
  },
  CONCLUSIONS: {
    id: 'conclusions',
    title: 'Conclusions and Action Plan',
    description: 'Summary of findings and actions to address identified issues',
    required: true
  },
  APPENDICES: {
    id: 'appendices',
    title: 'Appendices',
    description: 'Supporting documentation and detailed calculations',
    required: false
  }
};

// Generates the executive summary section
const generateExecutiveSummary = (firmData, calculationData) => {
  if (!firmData || !calculationData) return '';
  
  return `# Executive Summary

## Firm Overview
${firmData.name || 'The firm'} is an investment firm subject to the FCA's MIFIDPRU prudential regime. This Internal Capital and Risk Assessment (ICARA) document sets out the firm's assessment of the adequacy of its financial resources relative to the nature, scale, and complexity of its activities.

## Firm Classification
The firm is classified as a ${calculationData.firmClassification || 'Non-SNI'} investment firm under the MIFIDPRU regime.

## Key Financial Resources Requirements
The firm has determined the following key financial resources requirements:

* Own Funds Threshold Requirement (OFTR): ${formatCurrency(calculationData.ownFundsRequirement?.totalOwnFundsRequirement || 0)}
* Liquid Assets Threshold Requirement (LATR): ${formatCurrency(calculationData.liquidAssetsRequirement?.liquidAssetsThresholdRequirement || 0)}

## Material Harms
The firm has identified ${calculationData.identifiedHarms?.filter(h => h.likelihood * h.impact >= 6).length || 0} material harms that could be caused to clients, markets, or the firm itself. These harms have been assessed, and additional financial resources have been allocated where appropriate.

## Key Conclusions
The firm's assessment concludes that the current level of financial resources is ${(calculationData.actualOwnFunds || 0) >= (calculationData.ownFundsRequirement?.totalOwnFundsRequirement || 0) ? 'adequate' : 'inadequate'} to support the business and mitigate potential harms. The firm has developed appropriate wind-down and recovery plans to ensure it can exit the market in an orderly manner or recover from stress events if necessary.

## Board Approval
This ICARA document has been reviewed and approved by the firm's Board of Directors on [INSERT DATE].`;
};

// Generates the business model analysis section
const generateBusinessModelAnalysis = (firmData) => {
  return `# Business Model Analysis

## Overview of Business Activities
[Describe the firm's principal business activities, target clients, and markets served]

## Business Strategy
[Outline the firm's current business strategy and any planned changes]

## Key Dependencies
[Identify critical dependencies such as key clients, suppliers, staff, or systems]

## Group Structure
[If applicable, describe the firm's position within a wider group structure]

## Regulatory Permissions
[List the firm's main regulatory permissions and how they relate to its business activities]

## Financial Projections
[Provide a summary of financial projections for the next 1-3 years]

## Key Business Risks
[Identify the key risks associated with the business model, including market risks, operational risks, and strategic risks]`;
};

// Generates the governance arrangements section
const generateGovernanceSection = () => {
  return `# Governance Arrangements

## Board and Senior Management
[Describe the composition and responsibilities of the Board and senior management]

## Risk Management Framework
[Outline the firm's risk management framework, including key policies and procedures]

## Three Lines of Defense
[Explain how the three lines of defense model operates within the firm]

## Risk Appetite
[Summarize the firm's risk appetite and how it is applied]

## Oversight and Monitoring
[Describe how compliance with the ICARA is monitored and by whom]

## ICARA Process
[Explain the firm's process for preparing and reviewing the ICARA]

## Documentation and Record-Keeping
[Describe how ICARA documentation and supporting evidence are maintained]`;
};

// Formats the risk assessment data into a document section
const formatRiskAssessment = (harms) => {
  if (!harms || harms.length === 0) {
    return `# Harm Identification and Risk Assessment

[No potential harms have been identified. This section should identify and assess potential harms to clients, markets, and the firm.]`;
  }
  
  // Group harms by category
  const harmsByCategory = harms.reduce((acc, harm) => {
    const category = harm.category || 'other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(harm);
    return acc;
  }, {});
  
  // Format each harm
  const formatHarm = (harm) => {
    const riskScore = harm.likelihood * harm.impact;
    const riskRating = 
      riskScore >= 15 ? 'High' :
      riskScore >= 8 ? 'Medium' :
      riskScore >= 4 ? 'Low' : 'Very Low';
    
    return `### ${harm.description}

* **Risk Score**: ${riskScore} (${riskRating})
* **Likelihood**: ${harm.likelihood} - ${getLikelihoodLabel(harm.likelihood)}
* **Impact**: ${harm.impact} - ${getImpactLabel(harm.impact)}
* **Controls**: ${harm.controls || 'Not specified'}
* **Additional Own Funds Required**: ${formatCurrency(harm.additionalOwnFunds || 0)}
* **Additional Liquid Assets Required**: ${formatCurrency(harm.additionalLiquidAssets || 0)}`;
  };
  
  // Build the document section
  let riskAssessmentSection = `# Harm Identification and Risk Assessment

## Methodology
The firm has assessed potential harms using a risk-based approach, considering both the likelihood and impact of each harm. The risk score is calculated by multiplying the likelihood (1-5) by the impact (1-5), resulting in a score between 1 and 25. Harms with a risk score of 6 or higher are considered material.

## Summary of Material Harms
The firm has identified ${harms.filter(h => h.likelihood * h.impact >= 6).length} material harms out of a total of ${harms.length} potential harms.

## Detailed Risk Assessment\n`;

  // Add each category of harms
  Object.entries(harmsByCategory).forEach(([category, categoryHarms]) => {
    const categoryTitle = 
      category === 'client' ? 'Harms to Clients' :
      category === 'market' ? 'Harms to Markets' :
      category === 'firm' ? 'Harms to the Firm' : 'Other Harms';
    
    riskAssessmentSection += `\n## ${categoryTitle}\n`;
    
    categoryHarms.forEach(harm => {
      riskAssessmentSection += `\n${formatHarm(harm)}\n`;
    });
  });
  
  return riskAssessmentSection;
};

// Formats the capital calculations into a document section
const formatCapitalCalculations = (calculationData) => {
  if (!calculationData || !calculationData.ownFundsRequirement) {
    return `# Capital Adequacy Assessment

[This section should include an assessment of the firm's capital requirements.]`;
  }
  
  const {
    pmcr,
    FOR,
    totalKFR,
    baseOwnFundsRequirement,
    additionalOwnFundsForHarm,
    totalOwnFundsRequirement,
    cet1Requirement,
    at1Requirement,
    t2Requirement
  } = calculationData.ownFundsRequirement;
  
  return `# Capital Adequacy Assessment

## Regulatory Capital Requirements

### Permanent Minimum Capital Requirement (PMCR)
The PMCR for the firm is ${formatCurrency(pmcr || 0)} based on its regulatory permissions and activities.

### Fixed Overhead Requirement (FOR)
The FOR is calculated as 25% of the firm's annual fixed overheads, which amounts to ${formatCurrency(FOR || 0)}.

### K-Factor Requirement (KFR)
The total K-Factor Requirement is ${formatCurrency(totalKFR || 0)}, based on the firm's client, market, and firm risk exposures.

### Base Own Funds Requirement
The Base Own Funds Requirement is ${formatCurrency(baseOwnFundsRequirement || 0)}, which is the highest of the PMCR, FOR, and KFR.

## Additional Own Funds for Harm
Based on the firm's risk assessment, an additional ${formatCurrency(additionalOwnFundsForHarm || 0)} of own funds is required to mitigate potential harms.

## Total Own Funds Threshold Requirement (OFTR)
The firm's Total Own Funds Threshold Requirement is ${formatCurrency(totalOwnFundsRequirement || 0)}, which is the sum of the Base Own Funds Requirement and the additional own funds for harm.

## Composition of Own Funds
The firm's own funds composition requirements are:

* Common Equity Tier 1 (CET1) capital: at least ${formatCurrency(cet1Requirement || 0)} (56%)
* Additional Tier 1 (AT1) capital: up to ${formatCurrency(at1Requirement || 0)} (44%)
* Tier 2 (T2) capital: up to ${formatCurrency(t2Requirement || 0)} (25%)

## Current Capital Position
[Insert details of the firm's current own funds position, including a breakdown by capital tier]

## Capital Planning
[Describe the firm's approach to capital planning, including how it ensures it maintains adequate capital at all times]

## Conclusions
[Provide a conclusion on the adequacy of the firm's capital resources relative to its requirements]`;
};

// Formats the liquidity calculations into a document section
const formatLiquidityCalculations = (calculationData) => {
  if (!calculationData || !calculationData.liquidAssetsRequirement) {
    return `# Liquidity Adequacy Assessment

[This section should include an assessment of the firm's liquidity requirements.]`;
  }
  
  const {
    liquidAssetsThresholdRequirement,
    oneThirdFOR,
    oneThirdFixedOngoingCosts,
    additionalLiquidAssetsForHarm
  } = calculationData.liquidAssetsRequirement;
  
  return `# Liquidity Adequacy Assessment

## Regulatory Liquidity Requirements

### Basic Liquid Assets Requirement
The basic liquid assets requirement consists of:

* One-third of the Fixed Overhead Requirement: ${formatCurrency(oneThirdFOR || 0)}
* One-third of the fixed ongoing costs during wind-down: ${formatCurrency(oneThirdFixedOngoingCosts || 0)}

### Additional Liquid Assets for Harm
Based on the firm's risk assessment, an additional ${formatCurrency(additionalLiquidAssetsForHarm || 0)} of liquid assets is required to mitigate potential harms.

## Total Liquid Assets Threshold Requirement (LATR)
The firm's Total Liquid Assets Threshold Requirement is ${formatCurrency(liquidAssetsThresholdRequirement || 0)}, which is the sum of the basic requirement and the additional liquid assets for harm.

## Eligible Liquid Assets
[Insert details of the firm's eligible liquid assets under MIFIDPRU 6.3.3R, including:
* Cash and cash equivalents
* Assets qualifying under the LCR Regulation
* Short-term deposits at credit institutions
* Trade debtors and fees receivable within 30 days (with haircut)]

## Current Liquidity Position
[Insert details of the firm's current liquid assets position]

## Liquidity Planning
[Describe the firm's approach to liquidity planning, including how it ensures it maintains adequate liquid assets at all times]

## Conclusions
[Provide a conclusion on the adequacy of the firm's liquid assets relative to its requirements]`;
};

// Formats the stress testing results into a document section
const formatStressTests = (scenarios) => {
  if (!scenarios || scenarios.length === 0) {
    return `# Stress Testing

[This section should include details of the stress tests performed and their impact on capital and liquidity requirements.]`;
  }
  
  let stressTestingSection = `# Stress Testing

## Methodology
The firm has conducted stress testing to assess the impact of adverse scenarios on its financial resources. The following scenarios have been tested:

`;
  
  // Add each scenario
  scenarios.forEach((scenario, index) => {
    stressTestingSection += `## Scenario ${index + 1}: ${scenario.name}

### Description
${scenario.description}

### Key Impacts
`;
    
    // Add scenario impacts
    if (scenario.impacts && scenario.impacts.length > 0) {
      scenario.impacts.forEach(impact => {
        const changePercent = (impact.change * 100).toFixed(1);
        const changeDirection = impact.change >= 0 ? 'increase' : 'decrease';
        
        stressTestingSection += `* ${impact.description}: ${Math.abs(changePercent)}% ${changeDirection}\n`;
      });
    }
    
    // Add additional resources required
    stressTestingSection += `
### Additional Resources Required
* Additional Own Funds: ${formatCurrency(scenario.additionalOwnFunds || 0)}
* Additional Liquid Assets: ${formatCurrency(scenario.additionalLiquidAssets || 0)}

### Impact on Prudential Requirements
[Insert details of the impact on the firm's own funds and liquid assets requirements]

`;
  });
  
  stressTestingSection += `## Conclusions
[Provide a conclusion on the firm's ability to withstand the stress scenarios and the adequacy of its financial resources]`;
  
  return stressTestingSection;
};

// Generates the wind-down plan section
const generateWindDownPlan = (firmData) => {
  return `# Wind-Down Analysis

## Wind-Down Triggers
[Describe the triggers that would initiate the wind-down process]

## Wind-Down Period
The firm estimates that it would take ${firmData.windDownPeriod || 3} months to wind down its business in an orderly manner.

## Wind-Down Costs
[Quantify the costs associated with winding down the business, including:
* Fixed costs during the wind-down period
* One-off costs specific to the wind-down
* Staff retention costs
* Legal and professional fees]

## Wind-Down Process
[Outline the key steps in the wind-down process, including:
* Client notification and transfer arrangements
* Staff redundancy process
* Termination of contracts and agreements
* Disposal of assets
* Regulatory notifications]

## Financial Resources for Wind-Down
[Assess whether the firm has sufficient financial resources to fund the wind-down process]

## Governance of Wind-Down
[Describe the governance arrangements for the wind-down process, including roles and responsibilities]

## Potential Obstacles
[Identify potential obstacles to an orderly wind-down and how these would be addressed]

## Conclusions
[Provide a conclusion on the feasibility of the wind-down plan and the adequacy of resources to support it]`;
};

// Generates the recovery plan section
const generateRecoveryPlan = (firmData) => {
  return `# Recovery Plan

## Recovery Triggers
[Describe the triggers that would initiate the recovery plan, including:
* Capital-based triggers
* Liquidity-based triggers
* Profitability-based triggers
* Operational event triggers]

## Recovery Options
[Outline the key recovery options available to the firm, such as:
* Capital raising
* Cost reduction
* Business line divestment
* Strategic partnerships
* Reduction in risk-weighted assets]

## Assessment of Recovery Options
[For each recovery option, assess:
* Feasibility
* Expected financial impact
* Implementation timeline
* Potential obstacles
* Dependencies]

## Recovery Plan Implementation
[Describe how the recovery plan would be implemented, including:
* Decision-making process
* Escalation procedures
* Communication strategy
* Regulatory notifications]

## Governance of Recovery
[Describe the governance arrangements for the recovery process, including roles and responsibilities]

## Testing and Maintenance
[Explain how the recovery plan is tested and maintained to ensure it remains effective]

## Conclusions
[Provide a conclusion on the effectiveness of the recovery plan and the firm's ability to recover from stress events]`;
};

// Generates the conclusions section
const generateConclusionsSection = (complianceMetrics) => {
  return `# Conclusions and Action Plan

## Overall Assessment
[Provide an overall assessment of the firm's financial resources, considering:
* Capital adequacy
* Liquidity adequacy
* Ability to wind down in an orderly manner
* Ability to recover from stress events]

## Key Findings
[Summarize the key findings from the ICARA process, including:
* Material harms identified
* Results of stress testing
* Adequacy of financial resources
* Effectiveness of risk management arrangements]

## Action Plan
[Detail the actions the firm will take to address any findings or improvements identified during the ICARA process]

## Timeline for Implementation
[Provide a timeline for the implementation of the action plan]

## Monitoring and Reporting
[Describe how progress against the action plan will be monitored and reported to the Board]

## Next Review
[Specify when the next ICARA review will be conducted]

## Board Approval
This ICARA document, including the conclusions and action plan, was approved by the Board on [INSERT DATE].`;
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

// Helper function to get likelihood label
const getLikelihoodLabel = (value) => {
  switch (parseInt(value)) {
    case 1: return 'Rare';
    case 2: return 'Unlikely';
    case 3: return 'Possible';
    case 4: return 'Likely';
    case 5: return 'Almost Certain';
    default: return 'Unknown';
  }
};

// Helper function to get impact label
const getImpactLabel = (value) => {
  switch (parseInt(value)) {
    case 1: return 'Minimal';
    case 2: return 'Minor';
    case 3: return 'Moderate';
    case 4: return 'Major';
    case 5: return 'Catastrophic';
    default: return 'Unknown';
  }
};

// ICARA Document Generator component
export const ICARADocumentGenerator = ({ firmData, calculationData, scenarios, complianceMetrics }) => {
  const [selectedSections, setSelectedSections] = useState(
    Object.keys(DOCUMENT_SECTIONS).filter(key => DOCUMENT_SECTIONS[key].required)
  );
  const [documentContent, setDocumentContent] = useState('');
  const [customSections, setCustomSections] = useState({});
  const [showPreview, setShowPreview] = useState(false);
  
  // Handle section toggle
  const handleSectionToggle = (sectionId) => {
    if (selectedSections.includes(sectionId)) {
      // Remove if not required
      if (!DOCUMENT_SECTIONS[sectionId].required) {
        setSelectedSections(selectedSections.filter(id => id !== sectionId));
      }
    } else {
      // Add if not already selected
      setSelectedSections([...selectedSections, sectionId]);
    }
  };
  
  // Handle custom section content change
  const handleCustomSectionChange = (sectionId, content) => {
    setCustomSections({
      ...customSections,
      [sectionId]: content
    });
  };
  
  // Generate document
  const generateDocument = () => {
    let content = '';
    
    // Add title and date
    content += `# Internal Capital and Risk Assessment (ICARA)\n\n`;
    content += `**Firm Name**: ${firmData?.name || '[FIRM NAME]'}\n\n`;
    content += `**Date**: ${new Date().toLocaleDateString()}\n\n`;
    content += `---\n\n`;
    
    // Add table of contents
    content += `## Table of Contents\n\n`;
    selectedSections.forEach((sectionId, index) => {
      content += `${index + 1}. [${DOCUMENT_SECTIONS[sectionId].title}](#${sectionId})\n`;
    });
    content += `\n---\n\n`;
    
    // Add each selected section
    selectedSections.forEach(sectionId => {
      // Use custom content if available, otherwise generate
      const sectionContent = customSections[sectionId] || generateSectionContent(sectionId);
      content += sectionContent + '\n\n---\n\n';
    });
    
    setDocumentContent(content);
    setShowPreview(true);
  };
  
  // Generate content for a specific section
  const generateSectionContent = (sectionId) => {
    switch (sectionId) {
      case 'executive_summary':
        return generateExecutiveSummary(firmData, calculationData);
      case 'business_model':
        return generateBusinessModelAnalysis(firmData);
      case 'governance':
        return generateGovernanceSection();
      case 'risk_assessment':
        return formatRiskAssessment(calculationData?.identifiedHarms);
      case 'capital_adequacy':
        return formatCapitalCalculations(calculationData);
      case 'liquidity_adequacy':
        return formatLiquidityCalculations(calculationData);
      case 'stress_testing':
        return formatStressTests(scenarios);
      case 'wind_down':
        return generateWindDownPlan(firmData);
      case 'recovery_plan':
        return generateRecoveryPlan(firmData);
      case 'conclusions':
        return generateConclusionsSection(complianceMetrics);
      case 'appendices':
        return `# Appendices\n\n[Include any supporting documentation or detailed calculations here.]`;
      default:
        return `# ${DOCUMENT_SECTIONS[sectionId].title}\n\n[This section is under development.]`;
    }
  };
  
  // Export document to file
  const exportDocument = () => {
    const blob = new Blob([documentContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ICARA_${firmData?.name || 'Document'}_${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">ICARA Document Generator</h2>
      
      {!calculationData ? (
        <p className="text-gray-500 italic">Please load calculation data to generate an ICARA document</p>
      ) : (
        <>
          <div className="mb-6">
            <h3 className="font-semibold mb-2">Document Sections</h3>
            <p className="text-sm text-gray-600 mb-4">
              Select the sections to include in your ICARA document. Required sections cannot be deselected.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(DOCUMENT_SECTIONS).map(([id, section]) => (
                <div 
                  key={id}
                  className={`p-4 rounded-lg border ${
                    selectedSections.includes(id) ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`section_${id}`}
                        checked={selectedSections.includes(id)}
                        onChange={() => handleSectionToggle(id)}
                        disabled={section.required}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`section_${id}`} className="ml-2 font-medium">
                        {section.title}
                      </label>
                    </div>
                    {section.required && (
                      <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{section.description}</p>
                  
                  {selectedSections.includes(id) && (
                    <div className="mt-2 text-right">
                      <button
                        onClick={() => {
                          const defaultContent = generateSectionContent(id);
                          handleCustomSectionChange(id, defaultContent);
                          setShowPreview(false);
                          
                          // Show textarea modal for editing
                          const modal = document.getElementById(`modal_${id}`);
                          if (modal) {
                            modal.style.display = 'flex';
                          }
                        }}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Customize Content
                      </button>
                      
                      {/* Modal for customizing section content */}
                      <div
                        id={`modal_${id}`}
                        className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50 hidden"
                      >
                        <div className="bg-white rounded-lg p-6 max-w-4xl w-full h-3/4 flex flex-col">
                          <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Edit {section.title}</h2>
                            <button
                              onClick={() => {
                                const modal = document.getElementById(`modal_${id}`);
                                if (modal) {
                                  modal.style.display = 'none';
                                }
                              }}
                              className="text-gray-500 hover:text-gray-800"
                            >
                              ×
                            </button>
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-4">
                            Edit the Markdown content for this section. The template provides a starting point that you can customize.
                          </p>
                          
                          <textarea
                            value={customSections[id] || ''}
                            onChange={(e) => handleCustomSectionChange(id, e.target.value)}
                            className="flex-grow w-full p-4 border border-gray-300 rounded-md font-mono text-sm"
                          ></textarea>
                          
                          <div className="flex justify-end space-x-2 mt-4">
                            <button
                              onClick={() => {
                                const modal = document.getElementById(`modal_${id}`);
                                if (modal) {
                                  modal.style.display = 'none';
                                }
                              }}
                              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              Save Changes
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-center mb-6">
            <button
              onClick={generateDocument}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Generate ICARA Document
            </button>
          </div>
          
          {showPreview && (
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-semibold">Document Preview</h3>
                <button
                  onClick={exportDocument}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
                >
                  Export as Markdown
                </button>
              </div>
              
              <div className="border rounded-lg p-4 max-h-96 overflow-y-auto bg-gray-50">
                <pre className="whitespace-pre-wrap font-mono text-sm">{documentContent}</pre>
              </div>
              
              <p className="mt-2 text-sm text-gray-600">
                This Markdown document can be imported into your preferred document editor for further formatting and final touches.
              </p>
            </div>
          )}
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Document Guidance</h3>
            <p className="text-sm text-gray-600 mb-2">
              The generated ICARA document provides a structured framework for your assessment. Consider the following when finalizing your document:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
              <li>Replace all placeholder text (indicated by square brackets) with your firm-specific information</li>
              <li>Ensure the assessment is proportionate to the nature, scale, and complexity of your firm</li>
              <li>Include supporting data and analysis to evidence your conclusions</li>
              <li>Regularly review and update the ICARA to reflect changes in your business or the regulatory environment</li>
              <li>Ensure the document is approved by your Board or equivalent governing body</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};
