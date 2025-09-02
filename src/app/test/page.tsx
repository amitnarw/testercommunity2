
'use client';

import React, { useState, useEffect, useRef } from 'react';

export default function TestPage() {
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRef = useRef<HTMLElement>(null);
  const checkRef = useRef<HTMLDivElement>(null);
  const gradientRef = useRef<HTMLDivElement>(null);

  const restartPulse = () => {
    if (!gradientRef.current) return;
    gradientRef.current.style.opacity = '0';
    requestAnimationFrame(() => {
      if (!gradientRef.current) return;
      gradientRef.current.style.opacity = '1';
      gradientRef.current.classList.add('animate');
    });
  };

  const stopPulse = () => {
    if (!gradientRef.current) return;
    gradientRef.current.style.opacity = '0';
    setTimeout(() => {
      gradientRef.current?.classList.remove('animate');
    }, 150);
  };
  
  const handlePointerDown = () => {
    if (!checkRef.current) return;
    checkRef.current.classList.remove('animate');
    checkRef.current.style.transitionDuration = '1s';
    requestAnimationFrame(() => {
       if (checkRef.current) checkRef.current.style.transform = 'scale(1.4)';
    });
    stopPulse();
  };
  
  const handlePointerUp = () => {
    if (!checkRef.current) return;
    checkRef.current.classList.add('animate');
    checkRef.current.style.transitionDuration = '0.25s';
    checkRef.current.style.transform = '';
    restartPulse();
  };

  // Initial animation
  useEffect(() => {
    const timer = setTimeout(() => {
        if (checkRef.current) {
            checkRef.current.classList.remove('animate');
             requestAnimationFrame(() => {
                if(checkRef.current) checkRef.current.classList.add('animate');
            })
        }
        restartPulse();
    }, 1000);
    return () => clearTimeout(timer);
  }, [])

  return (
    <>
      <style jsx global>{`
        :root {
          /* Neon Green */
          --hue1: 120; /* hsl(120, 100%, 50%) is pure green */
          --hue2: 120;
          --pads: 1rem;
        }

        @property --opc {
          syntax: "<percentage>";
          inherits: false;
          initial-value: 100%;
        }
        @property --gradient-h {
          syntax: "<percentage>";
          inherits: false;
          initial-value: 150%;
        }
        @property --gradient-w {
          syntax: "<percentage>";
          inherits: false;
          initial-value: 100%;
        }
        @property --gradient-inner-opacity {
          syntax: "<percentage>";
          inherits: false;
          initial-value: 0%;
        }
        @property --gradient-middle-opacity {
          syntax: "<percentage>";
          inherits: false;
          initial-value: 100%;
        }
        @property --gradient-outer-opacity {
          syntax: "<percentage>";
          inherits: false;
          initial-value: 100%;
        }
        @property --radial-center {
          syntax: "<percentage>";
          inherits: false;
          initial-value: 40%;
        }
        @property --conic-rotate {
          syntax: "<angle>";
          inherits: false;
          initial-value: 0deg;
        }

        .card-container {
            display: grid;
            place-content: center;
            min-height: calc(100vh - 200px);
        }

        .card {
          --gradient-height: 450px;
          position: relative;
          width: clamp(320px, calc(100vw - calc(var(--pads) * 3)), 600px);
          height: 600px;
          max-height: 600px;
          border-radius: 1.768em;
          background: hsl(0 0% 12%);
          isolation: isolate;
          display: grid;
          overflow: hidden;
          box-shadow: 
              rgba(0, 0, 0, 0.1) 0px 1px 2px, 
              rgba(0, 0, 0, 0.1) 0px 2px 4px, 
              rgba(0, 0, 0, 0.1) 0px 4px 8px, 
              rgba(0, 0, 0, 0.1) 0px 8px 16px, 
              rgba(0, 0, 0, 0.1) 0px 16px 32px, 
              rgba(0, 0, 0, 0.1) 0px 32px 64px;
        }

        .inner {
          color: white;
          text-align: center;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          container-type: inline-size;
          position: relative;
          z-index: 1;
        }

        .check {
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          left: 50%;
          top: 50%;
          padding: 0;
          translate: -50% -50%;
          aspect-ratio: 1;
          width: 4em;
          border-radius: 100%;
          color: white;
          transition: transform 1s ease-in-out;
          background: oklch(0.6 0.2 var(--hue2) / 75%);
          cursor: pointer;
        }
        .check:focus-visible {
          outline: 2px solid oklch(0.6 0.7 var(--hue1) / 75%);
          box-shadow: 0 0 0 2px white inset;
        }
        .check.animate {
          background: oklch(0.7 0.3 var(--hue2) / 75%);
          transition-delay: 0.1s;
        }
        .check svg {
          position: absolute;
          opacity: 0;
          transition: opacity 0.33s ease-in-out;
          transition-delay: 0.1s;
          width: 24px;
          height: 24px;
        }
        .check [clock] {
          opacity: 1;
        }
        .check.animate [tick] {
          opacity: 1;
        }
        .check.animate [clock] {
          opacity: 0;
        }

        .gradient-mask {
          position: absolute;
          inset: 0;
          border-radius: inherit;
          transform: translate3d(0, 0, 0.01px);
        }

        .gradient {
          --opc: 100%;
          --gradient-h: 150%;
          --gradient-w: 100%;
          --gradient-inner-opacity: 0%;
          --gradient-middle-opacity: 100%;
          --gradient-outer-opacity: 100%;
          --radial-center: 40%;

          border-radius: inherit;
          position: absolute;
          inset: 0;
          background-color: transparent;
          background-image: radial-gradient(
              circle at 50% var(--radial-center),
              oklch(0.8 0.25 var(--hue2) / var(--opc)) 10%,
              transparent 66%
            ),
            conic-gradient(
              from var(--conic-rotate) at 50% var(--radial-center),
              oklch(0.7 0.25 var(--hue1) / var(--opc)) 15%,
              oklch(0.7 0.29 var(--hue2) / var(--opc)) 57%,
              oklch(0.7 0.25 var(--hue1) / var(--opc)) 100%
            );
          mask-image: radial-gradient(
            var(--gradient-w) var(--gradient-h) at 50% var(--radial-center),
            rgb(0 0 0 / var(--gradient-inner-opacity)) 20%,
            rgb(0 0 0 / var(--gradient-middle-opacity)) 40%,
            rgb(0 0 0 / var(--gradient-middle-opacity)) 50%,
            rgb(0 0 0 / var(--gradient-outer-opacity)) 75%
          );

          mask-size: cover;
          mask-position: center;
          mask-repeat: no-repeat;
          z-index: -1;
          transition: opacity 0.15s ease-in;
        }

        .check.animate {
          animation: scaleCheck 0.8s linear(
              0, 0.444 4.1%, 0.727 7.6%, 0.894 11%, 0.934 12.7%, 0.947 14.4%,
              0.937 15.9%, 0.904 17.5%, 0.77 21%, -0.117 36.2%, -0.244 39.8%,
              -0.31 43.3%, -0.325 46.5%, -0.299 50%, -0.05 63.7%, -0.002 67.3%,
              0.026 70.9%, 0.038 77.1%, 0.006 90.7%, 0
            )
            both;
        }
        .gradient.animate {
          animation: gradient 2.2s cubic-bezier(0.278, 0.001, 0.393, 1) both;
        }

        @keyframes gradient {
          0% {
            --radial-center: 30%;
            --conic-rotate: -100deg;
            --opc: 50%;
            --gradient-h: 0%;
            --gradient-w: 0%;
            --gradient-inner-opacity: 0%;
            --gradient-middle-opacity: 30%;
            --gradient-outer-opacity: 0%;
          }
          75% {
            --radial-center: 60%;
            --gradient-h: 180%;
            --gradient-w: 140%;
            --gradient-outer-opacity: 0%;
          }
          100% {
            --opc: 80%;
            --radial-center: 60%;
            --conic-rotate: 50deg;
            --gradient-h: 180%;
            --gradient-w: 180%;
            --gradient-inner-opacity: 0%;
            --gradient-middle-opacity: 55%;
            --gradient-outer-opacity: 55%;
          }
        }

        @keyframes scaleCheck {
          to {
            transform: scale(1.4);
          }
        }
      `}</style>
      <main id="app" className="card-container">
        <section className="card" ref={cardRef}>
          <div className="gradient-mask">
            <div
              className="gradient"
              ref={gradientRef}
              style={{ opacity: 0 }}
            ></div>
          </div>

          <div className="inner">
            <div
              role="button"
              tabIndex={0}
              className="check"
              ref={checkRef}
              title="Click to restart the animation!"
              onPointerDown={handlePointerDown}
              onPointerUp={handlePointerUp}
              onKeyPress={(e) => e.key === 'Enter' && handlePointerUp()}
            >
              <svg clock="" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,20a9,9,0,1,1,9-9A9,9,0,0,1,12,21Z"
                />
                <rect width="2" height="7" x="11" y="6" fill="currentColor" rx="1">
                  <animateTransform
                    attributeName="transform"
                    dur="9s"
                    repeatCount="indefinite"
                    type="rotate"
                    values="0 12 12;360 12 12"
                  />
                </rect>
                <rect width="2" height="9" x="11" y="11" fill="currentColor" rx="1">
                  <animateTransform
                    attributeName="transform"
                    dur="0.75s"
                    repeatCount="indefinite"
                    type="rotate"
                    values="0 12 12;360 12 12"
                  />
                </rect>
              </svg>
               <svg tick="" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5"/>
              </svg>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
