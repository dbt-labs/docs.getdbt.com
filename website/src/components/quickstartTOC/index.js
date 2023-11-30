// This component is used to build the functionality of the quickstart guides
// Each H2 (##) in the markdown file is a step in the guide

import React, { useState, useEffect } from "react";
import clsx from "clsx";
import style from "./styles.module.css";
import { useLocation, useHistory } from "@docusaurus/router";
import queryString from "query-string";
import getSvgIcon from "../../utils/get-svg-icon";

function QuickstartTOC() {
  const history = useHistory();
  const location = useLocation()
  const locationPath = useLocation().pathname;
  const queryParams = queryString.parse(location.search);

  const activeStepLocal = typeof localStorage !== "undefined" ? localStorage.getItem(locationPath) : 1;
  const activeStepParam = queryParams.step ? (queryParams.step) : activeStepLocal ? activeStepLocal : 1;

  const [mounted, setMounted] = useState(false);
  const [tocData, setTocData] = useState([]);
  const [activeStep, setActiveStep] = useState(activeStepLocal || 1);

  useEffect(() => {
    // Get all h2 for each step in the guide
    const quickstartContainer = document.querySelector(".quickstart-container");
    const steps = quickstartContainer.querySelectorAll("h2");
    const snippetContainer = document.querySelectorAll(".snippet");

    // Create an array of objects with the id and title of each step
    const data = Array.from(steps).map((step, index) => ({
      id: step.id,
      title: step.innerText,
      stepNumber: index + 1,
    }));

    setTocData(data);
    setMounted(true);
    setActiveStep(activeStepParam || parseInt(activeStepLocal) || 1);

    // Wrap all h2 (steps), along with all of their direct siblings, in a div until the next h2
    if (mounted) {
      // Add snippet container to its parent step
      snippetContainer.forEach((snippet) => {
        const parent = snippet?.parentNode;
        while (snippet?.firstChild && parent.className) {
          if (parent) {
            parent.insertBefore(snippet.firstChild, snippet);
          }
        }
      });

      steps.forEach((step, index) => {
        const wrapper = document.createElement("div");
        wrapper.classList.add(style.stepWrapper);
        wrapper.classList.add(style.hidden);

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

      // Find the active step and show it
      const activeStepWrapper = document.querySelector(
        `.${style.stepWrapper}[data-step="${activeStep}"]`
      );
      activeStepWrapper?.classList.remove(style.hidden);
    }

    // Add Next/Prev buttons to step-wrapper divs
    if (mounted) {
      const stepWrappers = document.querySelectorAll(`.${style.stepWrapper}`);

      stepWrappers.forEach((stepWrapper, index) => {
        const buttonContainer = document.createElement("div");
        buttonContainer.classList.add(style.buttonContainer);
        const prevButton = document.createElement("a");
        const nextButton = document.createElement("a");
        
        prevButton.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M7.4 273.4C2.7 268.8 0 262.6 0 256s2.7-12.8 7.4-17.4l176-168c9.6-9.2 24.8-8.8 33.9 .8s8.8 24.8-.8 33.9L83.9 232 424 232c13.3 0 24 10.7 24 24s-10.7 24-24 24L83.9 280 216.6 406.6c9.6 9.2 9.9 24.3 .8 33.9s-24.3 9.9-33.9 .8l-176-168z"/></svg> Back';
        prevButton.classList.add(clsx(style.button, style.prevButton));
        prevButton.disabled = index === 0;
        prevButton.addEventListener("click", () => handlePrev(index + 1));

        nextButton.innerHTML = 'Next <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M440.6 273.4c4.7-4.5 7.4-10.8 7.4-17.4s-2.7-12.8-7.4-17.4l-176-168c-9.6-9.2-24.8-8.8-33.9 .8s-8.8 24.8 .8 33.9L364.1 232 24 232c-13.3 0-24 10.7-24 24s10.7 24 24 24l340.1 0L231.4 406.6c-9.6 9.2-9.9 24.3-.8 33.9s24.3 9.9 33.9 .8l176-168z"/></svg>';
        nextButton.classList.add(clsx(style.button, style.nextButton));
        nextButton.disabled = index === stepWrappers.length - 1;
        nextButton.addEventListener("click", () => handleNext(index + 1));

        buttonContainer.appendChild(prevButton);
        buttonContainer.appendChild(nextButton);

        stepWrapper.appendChild(buttonContainer);

        // Hide the respective buttons on the first and last steps
        if (index === 0) {
          prevButton.classList.add(style.hidden);
        }
        if (index === stepWrappers.length - 1) {
          nextButton.classList.add(style.hidden);
        }
      });

      const quickstartTitle = document.querySelector("header h1");
      quickstartTitle.classList.add(style.quickstartTitle);
    }
  }, [mounted]);

  useEffect(() => {
    const tocItems = document.querySelectorAll(`.${style.tocItem}`);

    tocItems.forEach((item, i) => {
      const isActive = i <= activeStep - 1;

      item.classList.toggle(clsx(style.active), isActive);
    });

    // Scroll to the top of the page when the user clicks next
    if (window.scrollY > 0) {
      window.scrollTo(0, 0);
    }

    // Set local storage to the active step
    localStorage.setItem(locationPath, activeStep);

    // If on mobile, auto scroll to the active step in the TOC when activeStep updates
    const tocList = document.querySelector(`.${style.tocList}`);
    const activeItems = document.querySelectorAll(`.${style.active}`);

    // Add query param for the active step
    history.replace({
      search: queryString.stringify({
        ...queryParams,
        step: activeStep,
      }),
    });
    
    if (window.innerWidth < 996) {
      const activeItem = activeItems[activeItems.length - 1];
      
      if (activeItem) {
        const itemTop = activeItem.offsetTop;
        const itemHeight = activeItem.offsetHeight;
        const containerTop = tocList.scrollTop;
        const containerHeight = tocList.offsetHeight;
    
        if (itemTop < containerTop || itemTop + itemHeight > containerTop + containerHeight) {
          tocList.scrollTop = itemTop;
        }
      }
    }
  }, [activeStep, mounted]);

  // Handle updating the active step
  const updateStep = (currentStepIndex, newStepIndex) => {
    const currentStep = document.querySelector(
      `.${style.stepWrapper}[data-step='${currentStepIndex}']`
    );
    const newStep = document.querySelector(
      `.${style.stepWrapper}[data-step='${newStepIndex}']`
    );

    currentStep?.classList.add(style.hidden);
    newStep?.classList.remove(style.hidden);

    setActiveStep(newStepIndex);
  };

  const handleNext = (currentStepIndex) => {
    if (currentStepIndex <= tocData.length - 1) {
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
    const stepNumber = e.target.closest("li").dataset.step;

    updateStep(activeStep, stepNumber);
  };

  // Handle TOC menu click
  const handleTocMenuClick = () => {
    const tocList = document.querySelector(`.${style.tocList}`);
    const tocMenuBtn = document.querySelector(`.${style.toc_menu_btn}`);
    const tocListStyles = window.getComputedStyle(tocList);

    if (tocListStyles.display === "none") {
      tocList.style.display = "block";
      tocMenuBtn.querySelector("svg").style.transform = "rotate(0deg)";
    } else {
      tocList.style.display = "none";
      tocMenuBtn.querySelector("svg").style.transform = "rotate(-90deg)";
    }
  };

  return (
    <>
      <a onClick={handleTocMenuClick} className={style.toc_menu_btn}>
        Menu {getSvgIcon("fa-caret-down")}
      </a>
      <ul className={style.tocList}>
        {tocData.map((step) => (
          <li
            key={step.id}
            data-step={step.stepNumber}
            className={clsx(style.tocItem)}
            onClick={handleTocClick}
          >
            <span>{step.stepNumber}</span> {step.title}
          </li>
        ))}
      </ul>
    </>
  );
}

export default QuickstartTOC;
