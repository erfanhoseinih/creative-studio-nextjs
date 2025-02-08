"use client";

import { useState, useEffect, useRef } from "react";
import anime from "animejs";
import styles from "./style.module.css";

const LogoAnimation = () => {
  
  const svgRef = useRef(null);
  const logoSpaceRef = useRef(null);
  const [showLogo, setShowLogo] = useState(false);
  const [showLogoSpace, setShowLogoSpace] = useState(true);  

  useEffect(() => {
    if (!svgRef.current) return;

    const lines = svgRef.current.querySelectorAll(`.${styles.cls1}`);

    lines.forEach((line) => {
      const length = line.getTotalLength();
      line.style.strokeDasharray = length;
      line.style.strokeDashoffset = length;
    });

    anime
      .timeline({
        easing: "easeInOutSine",
      })
      .add({
        targets: lines,
        strokeDashoffset: [anime.setDashoffset, 0],
        duration: (el) => (el.getTotalLength() / 200) * 700,
        delay: (el, i) => i * 100,
      })
      .add({
        targets: lines,
        strokeDashoffset: [0, anime.setDashoffset],
        duration: (el) => (el.getTotalLength() / 200) * 700,
        delay: 700,
      })
      .add({
        targets: logoSpaceRef.current,
        opacity: [1, 0], 
        display: ["block","none"],
        duration: 1200,
        easing: "easeOutQuad",
        complete: () => {
          setShowLogoSpace(false);  
        },
      });
    setShowLogo(true);
  }, []);

  return showLogoSpace ? (
    <div ref={logoSpaceRef} className={styles.logoSpace}>
      <svg
        ref={svgRef}
        className={styles.logo}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 325.27 325.57"
        style={{
          opacity: showLogo ? 1 : 0,
        }}
      >
        <polyline
          className={styles.cls1}
          points="73.69 325.57 73.69 177.59 162.37 28.32 283.44 215.08"
        />
        <polyline
          className={styles.cls1}
          points="14.5 147.99 14.5 14.8 118.55 14.8"
        />
        <polyline
          className={styles.cls1}
          points="132.88 325.57 132.88 162.79 206.88 162.79"
        />
        <polyline
          className={styles.cls1}
          points="192.08 207.18 192.08 251.58 325.26 251.58"
        />
        <line
          className={styles.cls1}
          x1="310.47"
          y1="207.18"
          x2="311.47"
          y2="177.59"
        />
        <line className={styles.cls1} x1="310.47" y1="147.99" x2="310.47" />
        <line className={styles.cls1} x1="251.27" x2="251.27" y2="118.39" />
        <line
          className={styles.cls1}
          x1="73.69"
          y1="88.79"
          x2="73.69"
          y2="59.2"
        />
        <line
          className={styles.cls1}
          x1="14.5"
          y1="177.59"
          x2="14.5"
          y2="325.57"
        />
        <line
          className={styles.cls1}
          x1="177.28"
          y1="310.77"
          x2="325.27"
          y2="310.77"
        />
      </svg>
    </div>
  ) : null ;
};

export default LogoAnimation;
