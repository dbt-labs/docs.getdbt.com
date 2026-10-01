import React from 'react';

const AvailabilityContext = React.createContext({
  availability: null,
  renderAfterH1: false,
});

export default AvailabilityContext;
