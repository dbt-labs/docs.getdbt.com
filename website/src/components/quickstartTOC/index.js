// This component is used to build the functionality
// of the Quickstart Guides page.

import React, { useState, useEffect } from "react";
import clsx from "clsx";
import style from "./styles.module.css";
import { useLocation } from "@docusaurus/router";

function QuickstartTOC() {
  let activeStepLocal;
  const location = useLocation().pathname;

  if (window !== "undefined") {
    activeStepLocal = localStorage.getItem(location);
  }

  const [mounted, setMounted] = useState(false);
  const [tocData, setTocData] = useState([]);
  const [activeStep, setActiveStep] = useState(activeStepLocal);
  const [activeQuickstart, setActiveQuickstart] = useState(location);

  useEffect(() => {
    // Get all h2 for each step in the guide
    const steps = document.querySelectorAll("h2");
    const stepContainer = document.querySelector(".step-container");
    const snippetContainer = document.querySelectorAll(".snippet");

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
      stepNumber: index,
    }));

    setTocData(data);
    setMounted(true);
    setActiveStep(parseInt(activeStepLocal));

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
          wrapper.setAttribute("data-step", index);
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
        `.step-wrapper[data-step='${activeStep}']`
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

    // Get the active step from local storage
    // If there is no value, we start at the first step
    const activeStepLocal = localStorage.getItem(location);
    setActiveStep(parseInt(activeStepLocal) || 0);
  }, [mounted]);

  useEffect(() => {
    const introDiv = document.querySelector(".intro");

    if (activeStep > 0 && introDiv) {
      introDiv.classList.add("hidden");
    } else if (introDiv) {
      introDiv.classList.remove("hidden");
    }

    const tocItems = document.querySelectorAll(".toc-item");

    tocItems.forEach((item, i) => {
      const isActive = i <= activeStep;

      item.classList.toggle("active", isActive);
    });

    // Scroll to the top of the page when the user clicks next
    if (window.scrollY > 0) {
      window.scrollTo(0, 0);
    }

    // Set local storage to the active step
    localStorage.setItem(activeQuickstart, activeStep);
  }, [activeStep]);

  // Handle updating the active step
  const updateStep = (currentStepIndex, newStepIndex) => {
    const currentStep = document.querySelector(
      `.step-wrapper[data-step='${currentStepIndex}']`
    );
    const newStep = document.querySelector(
      `.step-wrapper[data-step='${newStepIndex}']`
    );

    currentStep?.classList.add("hidden");
    newStep?.classList.remove("hidden");

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

  // Handle TOC click
  const handleTocClick = (e) => {
    const stepNumber = parseInt(e.target.dataset.step);

    const currentStep = document.querySelector(".step-wrapper:not(.hidden)");
    currentStep?.classList.add("hidden");

    const newStep = document.querySelector(
      `.step-wrapper[data-step='${stepNumber}']`
    );
    newStep?.classList.remove("hidden");

    setActiveStep(stepNumber);
  };

  return (
    <ul className={style.tocList}>
      {tocData.map((step, index) => (
        <li
          key={step.id}
          data-step={index}
          className={clsx(style.tocItem, "toc-item")}
          onClick={handleTocClick}
        >
          <span>{step.stepNumber + 1}</span> {step.title}
        </li>
      ))}
    </ul>
  );
}

export default QuickstartTOC;
