import React, { useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';

const ConfettiTrigger = ({ children }) => {
  const triggerRef = useRef(null); // Use a ref to refer to the component's section

  useEffect(() => {
    const triggerConfetti = () => {
        if (event.target.closest('a, h2, h3')) {
            // Do nothing if the click is on these elements
            return;
          }
        // Configuration for the confetti
      const confettiCount = 200;
      const spread = 70;
      const startVelocity = 30;
      const scalar = 0.7;
      const gravity = 1.5;
      const decay = 0.9;

      // Launch confetti from multiple points
      for (let i = 0; i < 5; i++) {
        confetti({
          angle: 60,
          spread: spread,
          particleCount: confettiCount / 5,
          origin: { y: 0.6, x: (i + 1) * 0.2 - 0.1 },
          startVelocity: startVelocity,
          scalar: scalar,
          gravity: gravity,
          decay: decay,
          zIndex: 9999,
        });
      }
    };

    const triggerElement = triggerRef.current;
    // Add event listener to the section
    if (triggerElement) {
      triggerElement.addEventListener('click', triggerConfetti);
    }

    // Clean up the event listener on component unmount
    return () => {
      if (triggerElement) {
        triggerElement.removeEventListener('click', triggerConfetti);
      }
    };
  }, []);

  return (
    <div ref={triggerRef} style={{ width: '100%' }}>
      {children} {/* Render children passed to the component */}
    </div>
  );
};

export default ConfettiTrigger;
