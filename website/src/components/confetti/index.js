import React from 'react';
import confetti from 'canvas-confetti';
/**

 * @param {*} param0 
 * @returns 
 */
const ConfettiTrigger = ({ children }) => {
    const triggerConfetti = (event) => {
      if (event?.target?.closest('a, h2, h3')) {
            // Do nothing if the click is on these elements
            return;
          }
        // config for the confetti w spread operator
        const confettiCount = 200;
        const confettiSettings = {
              spread: 70,
              startVelocity: 30,
              scalar: 0.7,
              gravity: 1.5,
              decay: 0.9,
        }

      // Launch confetti from multiple points
      for (let i = 0; i < 5; i++) {
        confetti({
          angle: 60,
          particleCount: confettiCount / 5,
          origin: { y: 0.6, x: (i + 1) * 0.2 - 0.1 },
          zIndex: 9999,
          ...confettiSettings,
        });
      }
    };
  // add an OnClick event to trigger the confetti instead of listing EventListeners with useEffect
  return (
    <div onClick={triggerConfetti} style={{ width: '100%' }}>
      {children} {/* Render children passed to the component */}
      </div>
  );
};

export default ConfettiTrigger;
