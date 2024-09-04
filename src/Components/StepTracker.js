import React from 'react';
import PropTypes from 'prop-types';

function StepTracker({ currentStep }) {
  const steps = [
    { label: 'Cantidad' },
    { label: 'Beneficiario' },
    { label: 'Confirmación' },
  ];

  return (
    <div className="step-tracker">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`step ${index + 1 === currentStep ? 'active' : ''} ${index + 1 < currentStep ? 'completed' : ''}`}
        >
          <div className="step-circle">
            {index + 1 < currentStep ? '✓' : index + 1}
          </div>
          <div className="step-label">{step.label}</div>
          {index < steps.length - 1 && <div className="line"></div>}
        </div>
      ))}
    </div>
  );
}

StepTracker.propTypes = {
  currentStep: PropTypes.number.isRequired,
};

export { StepTracker };
