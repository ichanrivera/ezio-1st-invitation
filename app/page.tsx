"use client";

// Extend DeviceOrientationEvent for requestPermission (for iOS 13+)
interface DeviceOrientationEventWithPermission extends DeviceOrientationEvent {
  // Only present on iOS 13+ Safari
  constructor: typeof DeviceOrientationEvent & {
    requestPermission?: () => Promise<"granted" | "denied">;
  };
}

declare global {
  interface Window {
    DeviceOrientationEvent: typeof DeviceOrientationEvent & {
      requestPermission?: () => Promise<"granted" | "denied">;
    };
  }
}

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const orangeRef = useRef<HTMLImageElement>(null);
  const greenRef = useRef<HTMLImageElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const [motionEnabled, setMotionEnabled] = useState(false);

  // Handle device orientation event
  const handleOrientation = (e: DeviceOrientationEvent) => {
    const x = e.gamma ?? 0; // left/right
    const y = e.beta ?? 0;  // up/down
    const offsetX = x * 2 * 1.4; // increase by 40%
    const offsetY = y * 2 * 1.4;

    if (orangeRef.current) {
      orangeRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }
    if (greenRef.current) {
      greenRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    }
    // Move the wood in the opposite direction
    const wood = document.querySelector('.wood-image') as HTMLElement | null;
    if (wood) {
      wood.style.transform = `translate(${-offsetX}px, ${-offsetY}px)`;
    }
    if (backgroundRef.current) {
      backgroundRef.current.style.backgroundPosition = `${50 + offsetX / 10}% ${50 + offsetY / 10}%`;
    }
  };

  // Request permission for motion (iOS)
  const requestMotionPermission = async () => {
    if (
      typeof window.DeviceOrientationEvent !== "undefined" &&
      typeof window.DeviceOrientationEvent.requestPermission === "function"
    ) {
      try {
        const response = await window.DeviceOrientationEvent.requestPermission();
        if (response === "granted") {
          window.addEventListener("deviceorientation", handleOrientation);
          setMotionEnabled(true);
        } else {
          alert("Motion access denied.");
        }
      } catch (err) {
        console.error("Error requesting motion permission", err);
      }
    } else {
      // Android / older iOS
      window.addEventListener("deviceorientation", handleOrientation);
      setMotionEnabled(true);
    }
  };

  useEffect(() => {
    if (typeof window.DeviceOrientationEvent !== "undefined") {
      // Automatically attach for Android
      if (typeof window.DeviceOrientationEvent.requestPermission !== "function") {
        window.addEventListener("deviceorientation", handleOrientation);
        setMotionEnabled(true);
      }
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  return (
    <>
      {!motionEnabled ? (
        <div className="flex items-center justify-center min-h-screen w-full bg-white">
          <button
            onClick={requestMotionPermission}
            className="z-50 bg-blue-600 text-white px-6 py-3 rounded shadow text-lg font-bold"
          >
            Enable Motion to see moving dinosaurs!
          </button>
        </div>
      ) : (
        <div
          ref={backgroundRef}
          className="app-container h-[100dvh] max-w-md mx-auto px-0 py-0 shadow-md justify-between rounded-sm flex flex-col relative overflow-hidden"
          style={{
            backgroundImage: "url('/elements/MainBackground.png')",
            backgroundSize: "100% 100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div>
            <div
              style={{ fontFamily: "'Sunday', Arial, sans-serif" }}
              className="title-container flex flex-col items-center justify-center h-full"
            >
              <div>
                <span className="text-blue-300 text-xl font-bold title-letter">
                  o
                </span>
                <span className="text-orange-300 text-xl font-bold title-letter">
                  n
                </span>
                <span className="text-yellow-300 text-xl font-bold title-letter">
                  e
                </span>
              </div>
              <div>
                <span className="text-green-600 text-xl font-bold title-letter">
                  a
                </span>
                <span className="text-blue-300 text-xl font-bold title-letter">
                  -
                </span>
                <span className="text-orange-300 text-xl font-bold title-letter">
                  s
                </span>
                <span className="text-yellow-300 text-xl font-bold title-letter">
                  a
                </span>
                <span className="text-green-600 text-xl font-bold title-letter">
                  u
                </span>
                <span className="text-blue-300 text-xl font-bold title-letter">
                  r
                </span>
                <span className="text-orange-300 text-xl font-bold title-letter">
                  u
                </span>
                <span className="text-yellow-300 text-xl font-bold title-letter">
                  s
                </span>
              </div>
            </div>
            <div className="wood-container flex flex-col items-center justify-between h-full w-full text-center">
              <div className="wood-text mb-4">
                <p className="name">Ezio's</p>
                <p className="subtitle">1st Birthday</p>
              </div>
              <Image
                height={250}
                width={550}
                className="wood-image mx-auto"
                src="/elements/wood-plank.png"
                alt="One A-Saurus Logo"
              />
              <Image
                height={120}
                width={120}
                className="flying-image-orange"
                src="/elements/flying-orange.png"
                alt="Flying Orange"
                ref={orangeRef}
              />
              <Image
                height={120}
                width={120}
                className="flying-image-green"
                src="/elements/flying-green.png"
                alt="Flying Green"
                ref={greenRef}
              />
            </div>

            <div
              style={{ fontFamily: "'Sunday', Arial, sans-serif" }}
              className="when-container flex flex-col items-center justify-center mt-4"
            >
              <div className="text-blue-500 text-xl font-bold">
                July 6, 2025 - Sunday
              </div>
              <div className="text-orange-500 text-lg font-bold">
                11:00 AM TO 2:00 PM
              </div>
              <div className="text-yellow-800 text-lg font-bold">
                Max's Scout Tuazon
              </div>
              <div className="text-yellow-800 text-lg font-bold">Ruby Hall A</div>
              <div className="text-yellow-800 text-lg font-bold">
                21 Scout Tuazon St.
              </div>
              <div className="text-yellow-800 text-lg font-bold">
                Diliman, Quezon City
              </div>
            </div>
          </div>

          <div className="flex flex-row items-center justify-between p-4 relative">
            <div>
              <Image
                height={200}
                width={200}
                className="green-dino"
                src="/elements/green-dino.png"
                alt="green dino"
              />
            </div>
            <div>
              <Image
                height={200}
                width={200}
                className="blue-dino"
                src="/elements/blue-dino.png"
                alt="blue dino"
              />
            </div>
            <img
              src="/elements/eggs-modified.png"
              className="egg absolute bottom-0 left-1/2 -translate-x-1/2 w-32"
              alt="egg"
            />
          </div>
        </div>
      )}
    </>
  );
}
