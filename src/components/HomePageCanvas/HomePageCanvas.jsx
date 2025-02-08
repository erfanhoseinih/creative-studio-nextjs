"use client";

import { useEffect, useRef, useState } from "react";
import { initWaves, getWaves } from "../../../public/wasm/animationRun";
import styles from "./style.module.css";

const CanvasComponent = () => {
  const canvasRef = useRef(null);
  const [isInitialized, setIsInitialized] = useState(false);

  let animationTime = 0;

  useEffect(() => {
    const initializeWaves = async () => {
      await initWaves();
      setIsInitialized(true);
    };
    initializeWaves();
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resizeCanvas = () => {
  
      ctx.canvas.width = canvas.clientWidth;
      ctx.canvas.height = canvas.clientHeight;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    };

    resizeCanvas();
    let lineScale = 15;
    let lineDetiles = 18;

    let waves;
    let mouseX = 0;
    let mouseY = 0;

    canvas.addEventListener("mousemove", (event) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = event.clientX - rect.left;
      mouseY = event.clientY - rect.top;
    });

    const animate = () => {

      // requestAnimationFrame(animate);
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#f40c3f";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;

      if (parseInt(animationTime * 4000) % 2 == 0) {
        waves = getWaves(
          animationTime,
          width,
          height,
          lineScale,
          lineDetiles,
          mouseX,
          mouseY
        );
      }

      if (!waves) {
        return;
      }

      for (let i = 0; i < waves.length; i++) {
        ctx.beginPath();
        for (let j = 0; j < waves[i].length; j += 2) {
          ctx.lineTo(waves[i][j], waves[i][j + 1]);
        }
        ctx.lineWidth = 1;
        ctx.lineCap = "round";
        ctx.stroke();
      }

      animationTime += 0.0002;
    };
    
    animate();

    window.addEventListener("resize", resizeCanvas);
    
  }, [isInitialized]);

  return (
    <canvas
      className={styles.homecanvas}
      ref={canvasRef}
      width={500}
      height={500}
    />
  );
};

export default CanvasComponent;
