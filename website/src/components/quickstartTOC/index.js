import React, { useEffect, useState } from "react";
import style from "./styles.module.css";

function QuickstartTOC() {
  const [mounted, setMounted] = useState(false);
  const [tocData, setTocData] = useState([]);
  const [activeStep, setActiveStep] = useState(1);

  useEffect(() => {
    // Get all h2 for each step in the guide
    const steps = document.querySelectorAll("h2");
    const quickstartContainer = document.querySelector(".quickstart-container");
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
    const data = Array.from(steps).map((step) => ({
      id: step.id,
      title: step.innerText,
      stepNumber: Array.from(steps).indexOf(step) + 1,
    }));

    setTocData(data);
    setMounted(true);

    // Wrap all h2 (steps), along with all of their direct siblings, in a div until the next h2
    if (mounted) {
      steps.forEach((step) => {
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
          wrapper.setAttribute("data-step", step.id);
        } while (currentElement && currentElement.tagName !== "H2");
      });

    }

  }, [mounted]);


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
