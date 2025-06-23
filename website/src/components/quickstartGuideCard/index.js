import React, { useState, useEffect } from "react";
import Link from "@docusaurus/Link";
import styles from "./styles.module.css";
import getIconType from "../../utils/get-icon-type";
import getSvgIcon from "../../utils/get-svg-icon";
import { isRecentlyUpdated } from "../../utils/get-recently-updated";

export default function QuickstartGuideCard({ frontMatter, onFavoriteUpdate }) {
  const { id, title, time_to_complete, icon, last_updated } = frontMatter;
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Check if this guide is in favorites when component mounts
    const favorites = JSON.parse(
      localStorage.getItem("favoriteGuides") || "[]"
    );
    setIsFavorite(favorites.includes(id));
  }, [id]);

  const toggleFavorite = (e) => {
    e.preventDefault();
    
    const newFavoriteState = !isFavorite;
    setIsFavorite(newFavoriteState);

    // Update parent state and localStorage
    if (onFavoriteUpdate) {
      onFavoriteUpdate(id, newFavoriteState);
    }

    // Popup handling
    const existingPopup = document.querySelector(".copy-popup");
    if (existingPopup) {
      document.body.removeChild(existingPopup);
    }

    const popup = document.createElement("div");
    popup.classList.add("copy-popup");
    popup.innerText = !newFavoriteState
      ? "Guide removed from favorites!"
      : "Guide added to favorites!";
    document.body.appendChild(popup);

    setTimeout(() => {
      if (document.body.contains(popup)) {
        document.body.removeChild(popup);
      }
    }, 3000);
  };

  const rightArrow = getSvgIcon("fa-arrow-right");
  const isRecent = isRecentlyUpdated(last_updated);

  return (
    <Link to={`/guides/${id}`} className={styles.quickstartCard}>
      {icon && getIconType(icon, styles.icon)}

      <div className={styles.cardHeader}>
        <h4 className="heading-4">{title}</h4>
        {isRecent && <span className={styles.recently_updated}>Updated</span>}
        <button
          onClick={toggleFavorite}
          className={`${styles.cardFavoriteButton} ${isFavorite ? styles.favorited : ""}`}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          {getSvgIcon("fa-star")}
        </button>
      </div>

      {time_to_complete && (
        <span className={styles.time_to_complete}>{time_to_complete}</span>
      )}

      <span to={`/guides/${id}`} className={styles.start}>
        Start <span className={styles.right_arrow}>{rightArrow}</span>
      </span>
    </Link>
  );
}

// Component that handles the information under the title on the quickstart guide page
export function QuickstartGuideTitle({ frontMatter }) {
  const { id, time_to_complete, tags, level, last_updated } = frontMatter;
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    // Check if this guide is in favorites when component mounts
    const favorites = JSON.parse(
      localStorage.getItem("favoriteGuides") || "[]"
    );
    setIsFavorite(favorites.includes(id));
  }, [id]);

  const toggleFavorite = () => {
    const favorites = JSON.parse(
      localStorage.getItem("favoriteGuides") || "[]"
    );

    if (isFavorite) {
      const newFavorites = favorites.filter((fav) => fav !== id);
      localStorage.setItem("favoriteGuides", JSON.stringify(newFavorites));
    } else {
      favorites.push(id);
      localStorage.setItem("favoriteGuides", JSON.stringify(favorites));
    }

    setIsFavorite(!isFavorite);

    // Remove existing popup if it exists
    const existingPopup = document.querySelector(".copy-popup");
    if (existingPopup) {
      document.body.removeChild(existingPopup);
    }

    // Create and show the popup
    const popup = document.createElement("div");
    popup.classList.add("copy-popup");
    popup.innerText = isFavorite
      ? "Guide removed from favorites!"
      : "Guide added to favorites!";
    document.body.appendChild(popup);

    // Add close button
    const closeButton = document.createElement("span");
    closeButton.classList.add("close-button");
    closeButton.innerHTML = " &times;";
    closeButton.style.cursor = "pointer";
    closeButton.style.marginLeft = "8px";
    closeButton.addEventListener("click", () => {
      if (document.body.contains(popup)) {
        document.body.removeChild(popup);
      }
    });
    popup.appendChild(closeButton);

    // Remove popup after 3 seconds
    setTimeout(() => {
      if (document.body.contains(popup)) {
        document.body.removeChild(popup);
      }
    }, 3000);
  };

  const isRecent = isRecentlyUpdated(last_updated);

  return (
    <>
      <div className={styles.infoContainer}>
        <Link className={styles.backButton} to="/guides">
          Back to guides
        </Link>

        {isRecent && <span className={styles.recently_updated}>Updated</span>}
        {time_to_complete && (
          <span className={styles.time_to_complete}>
            {getSvgIcon("fa-clock")} {time_to_complete}
          </span>
        )}

        <div>
          <button
            onClick={toggleFavorite}
            className={`${styles.favoriteButton} ${isFavorite ? styles.favorited : ""}`}
            aria-label={
              isFavorite ? "Remove from favorites" : "Add to favorites"
            }
          >
            {getSvgIcon("fa-star")}
          </button>
        </div>
      </div>
      {(tags || level) && (
        <div className={styles.tag_container}>
          {tags &&
            tags.map((tag, i) => (
              <div className={`${styles.tag} tag`} key={i}>
                {tag}
              </div>
            ))}
          {level && <div className={`${styles.tag} tag`}>{level}</div>}
        </div>
      )}
    </>
  );
}
