import React, { useState, useEffect } from "react";
import style from "./styles.module.css";

function QuickstartTOC() {
  const [mounted, setMounted] = useState(false);
  const [tocData, setTocData] = useState([]);
  const [activeStep, setActiveStep] = useState(0);

  console.log("activeStep", activeStep);

  useEffect(() => {
    // Get all h2 for each step in the guide
    const steps = document.querySelectorAll("h2");
    const stepContainer = document.querySelector(".step-container");
    const snippetContainer = document.querySelectorAll(
      ".snippet_src-components-snippet-styles-module"
    );

    // undwrap the snippet container and remove the div leaving the children
    snippetContainer.forEach((snippet) => {
      const parent = snippet.parentNode;
      while (snippet.firstChild)
        parent.insertBefore(snippet.firstChild, snippet);
      parent.removeChild(snippet);
    });

    // Create an array of objects with the id and title of each step
    const data = Array.from(steps).map((step, index) => ({
      id: step.id,
      title: step.innerText,
      stepNumber: index + 1,
    }));

    setTocData(data);
    setMounted(true);

    // Wrap all h2 (steps), along with all of their direct siblings, in a div until the next h2
    if (mounted) {
      steps.forEach((step, index) => {
        const wrapper = document.createElement("div");
        wrapper.classList.add("step-wrapper");
        wrapper.classList.add("hidden");

        // Move the step and all its siblings into the its own div
        step.parentNode.insertBefore(wrapper, step);
        let currentElement = step;
        do {
          const nextElement = currentElement.nextElementSibling;
          wrapper.appendChild(currentElement);
          currentElement = nextElement;
          wrapper.setAttribute("data-step", index + 1);
        } while (currentElement && currentElement.tagName !== "H2");
      });

      // Wrap any non-step content in a div for the quickstart intro
      const children = stepContainer.children;
      const stepWrapper = document.createElement("div");
      stepWrapper.classList.add("intro");

      while (
        children.length &&
        children[0].classList.contains("step-wrapper") === false
      ) {
        stepWrapper.appendChild(children[0]);
      }
      stepContainer.appendChild(stepWrapper);

      const initialStep = document.querySelector(
        `.step-wrapper[data-step='${activeStep + 1}']`
      );
      if (initialStep) {
        initialStep.classList.remove("hidden");
      }
    }

    // Add Next/Prev buttons to step-wrapper divs
    if (mounted) {
      const stepWrappers = document.querySelectorAll(".step-wrapper");

      stepWrappers.forEach((stepWrapper, index) => {
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add(style.buttonContainer);
        const prevButton = document.createElement("a");
        const nextButton = document.createElement("a");

        prevButton.textContent = "Back";
        prevButton.classList.add(style.button);
        prevButton.disabled = index === 0;
        prevButton.addEventListener("click", () => handlePrev(index));

        nextButton.textContent = "Next";
        nextButton.classList.add(style.button);
        nextButton.disabled = index === stepWrappers.length - 1;
        nextButton.addEventListener("click", () => handleNext(index));

        buttonContainer.appendChild(prevButton);
        buttonContainer.appendChild(nextButton);

        stepWrapper.appendChild(buttonContainer);
      });
    }
  }, [mounted]);

  useEffect(() => {
    // Hide the intro if active step is greater than 0
    const introDiv = document.querySelector(".intro");
    
    if (activeStep > 0) {
        introDiv.classList.add("hidden");
    }
}, [activeStep]);

  const updateStep = (currentStepIndex, newStepIndex) => {
    const currentStep = document.querySelector(
      `.step-wrapper[data-step='${currentStepIndex + 1}']`
    );
    const newStep = document.querySelector(
      `.step-wrapper[data-step='${newStepIndex + 1}']`
    );
    const introDiv = document.querySelector(".intro");

    if (currentStep) {
      currentStep.classList.add("hidden");
    }
    if (newStep) {
      newStep.classList.remove("hidden");
    }
    if (introDiv) {
      if (newStepIndex === 0) {
        introDiv.classList.remove("hidden");
      } else {
        introDiv.classList.add("hidden");
      }
    }
    setActiveStep(newStepIndex);
  };

  const handleNext = (currentStepIndex) => {
    if (currentStepIndex < tocData.length - 1) {
      updateStep(currentStepIndex, currentStepIndex + 1);
    }
  };

  const handlePrev = (currentStepIndex) => {
    if (currentStepIndex > 0) {
      updateStep(currentStepIndex, currentStepIndex - 1);
    }
  };


  return (
    <ul className={style.tocList}>
      {tocData.map((step) => (
        <li key={step.id}>
          <span>{step.stepNumber}</span> {step.title}
        </li>
      ))}
    </ul>
  );
}

export default QuickstartTOC;
