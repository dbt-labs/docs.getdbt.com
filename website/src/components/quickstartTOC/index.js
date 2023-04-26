import React, { useEffect, useState } from "react";
import style from "./styles.module.css";

function QuickstartTOC() {
  const [tocData, setTocData] = useState([]);

  useEffect(() => {
    // Get all h2 for each step in the guide
    const steps = document.querySelectorAll("h2");

    // Create an array of objects with the id and title of each step
    const data = Array.from(steps).map((step) => ({
      id: step.id,
      title: step.innerText,
      stepNumber: Array.from(steps).indexOf(step) + 1,
    }));

    // Update state with the steps acquired from guide
    setTocData(data);

    // For each step found, wrap the step along with the content that follows it in a div until the next step is found
    steps.forEach((step, i) => {
      const nextStep = steps[i + 1];

      // If there is a next step, wrap the step and the content that follows it in a div
      if (nextStep) {
        const content = step.nextElementSibling;
        const wrapper = document.createElement("div");
        const stepId = step.id;

        // Add a data-step attribute to the step wrapper
        // This is used to show/hide the step content
        wrapper.setAttribute("data-step", stepId);

        step.parentNode.insertBefore(wrapper, step);
        wrapper.appendChild(step);
        wrapper.appendChild(content);
      }
    });
  }, []);

  return (
    <ul className={style.tocList}>
      {tocData.map((step) => (
        <li key={step.id}>
          <a href={`#${step.id}`}>
            <span>{step.stepNumber}</span> {step.title}
          </a>
        </li>
      ))}
    </ul>
  );
}

export default QuickstartTOC;
