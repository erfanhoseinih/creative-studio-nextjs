"use client";

import { useState, useEffect, useRef } from "react";
import styles from "./styles.module.css";

const Header = () => {
  const [j, setJ] = useState(0);
  const [i, setI] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const timeoutRef = useRef(null);

  const typingSpeed = 100;

  const textStatus = [
    "Loading...",
    "Unleashing ideas",
    "Crafting experiences",
    "Transforming concepts",
    "Testing boundaries",
    "Design in progress...",
    "Reimagining the future",
    "Building something amazing...",
    "Stay with us, it’s coming together.",
    "Innovating the impossible",
    "Designing the next big thing...",
    "Creating with purpose",
    "Blending creativity with technology",
    "Where ideas evolve into reality",
    "Engineering tomorrow, today",
    "Shaping the digital landscape",
    "Turning visions into design",
    "Pushing creative boundaries",
    "The journey of innovation continues...",
    "Mastering the art of design",
  ];

  useEffect(() => {
    if (j < textStatus[i % textStatus.length].length) {
      timeoutRef.current = setTimeout(() => {
        setCurrentText(
          (prev) => prev + textStatus[i % textStatus.length].charAt(j)
        );
        setJ((prevJ) => prevJ + 1);
      }, typingSpeed);
    }

    timeoutRef.current = setTimeout(() => {
      let currentTextp = currentText;
      if (i > 2) {
        currentTextp = currentText.substring(
          currentText.search("<br>") + 4,
          currentText.length
        );
      }
      setCurrentText(currentTextp + "<br>");
      setJ(0);
      setI((prevI) => prevI + 1);
    }, 450);

    return () => clearTimeout(timeoutRef.current);
  }, [j, i]);

  return (
    <div className={styles.Header}>
      <img className={styles.logo} src="./logo.svg" alt="Logo" />
      <div className={styles.text}>
        <p dangerouslySetInnerHTML={{ __html: currentText }}></p>
      </div>
      <div className={styles.menu}>
        <div className={styles.menubutten}>
          <p>ABOUT</p>
        </div>
        <div className={styles.menubutten}>
          <p>WORK</p>
        </div>
        <div className={styles.menubutten}>
          <p>CONTACT</p>
        </div>
      </div>
      <div className={styles.contact}>
        <div className={styles.contactText}>
          <p>Coding globally from France.</p>
        </div>
        <div className={styles.contactText}>
          <p> Available for freelance work → Hire me </p>
        </div>
      </div>
      <div className={styles.icons}>
        <div className={styles.icon}>
          <img src="./codepen.png" alt="" />
        </div>
        <div className={styles.icon}>
          <img src="./linkedin.png" alt="" />
        </div>
      </div>
      <div className={styles.icons}>
        <div className={styles.icon}>
          <img src="./adjust.svg" alt="" />
        </div>
      </div>
    </div>
  );
};

export default Header;
