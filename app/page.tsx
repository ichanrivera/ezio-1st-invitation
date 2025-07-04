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
  const gyroOffset = useRef<{ x: number; y: number } | null>(null);
  const [page, setPage] = useState(0);
  const touchStartY = useRef<number | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShow(true);
      const hideTimeout = setTimeout(() => setShow(false), 3000); // Hide after 2s

      return () => clearTimeout(hideTimeout);
    }, 5000); // Every 5s

    return () => clearInterval(interval);
  }, []);

  // Handle device orientation event
  const handleOrientation = (e: DeviceOrientationEvent) => {
    const x = e.gamma ?? 0; // left/right
    const y = e.beta ?? 0; // up/down

    // Set initial offset on first event
    if (gyroOffset.current === null) {
      gyroOffset.current = { x, y };
    }

    const offsetX = (x - (gyroOffset.current?.x ?? 0)) * 2 * 1.4;
    const offsetY = (y - (gyroOffset.current?.y ?? 0)) * 2 * 1.4;

    // Different sensitivities for each dino
    const orangeOffsetX = offsetX * 0.4;
    const orangeOffsetY = offsetY * 0.4;
    const greenOffsetX = offsetX * 0.8;
    const greenOffsetY = offsetY * 0.8;
    const greenDinoOffsetX = offsetX * 0.2;
    const greenDinoOffsetY = offsetY * 0.2;
    const blueDinoOffsetX = offsetX * 0.6;
    const blueDinoOffsetY = offsetY * 0.6;
    const eggOffsetX = offsetX * 0.19;
    const eggOffsetY = offsetY * 0.19;
    const orangeDinoOffsetX = offsetX * 0.3;
    const orangeDinoOffsetY = offsetY * 0.3;

    if (orangeRef.current) {
      orangeRef.current.style.transform = `translate(${orangeOffsetX}px, ${orangeOffsetY}px)`;
    }
    if (greenRef.current) {
      greenRef.current.style.transform = `translate(${greenOffsetX}px, ${greenOffsetY}px)`;
    }
    // Move egg with parallax
    const egg = document.querySelector(".egg") as HTMLElement | null;
    if (egg) {
      egg.style.transform = `translate(${eggOffsetX}px, ${eggOffsetY}px)`;
    }
    // Move green and blue dino with parallax
    const greenDino = document.querySelector(
      ".green-dino-parallax"
    ) as HTMLElement | null;
    if (greenDino) {
      greenDino.style.transform = `translate(${greenDinoOffsetX}px, ${greenDinoOffsetY}px)`;
    }
    const blueDino = document.querySelector(
      ".blue-dino-parallax"
    ) as HTMLElement | null;
    if (blueDino) {
      blueDino.style.transform = `translate(${blueDinoOffsetX}px, ${blueDinoOffsetY}px)`;
    }
    // Move orange dino with parallax
    const orangeDino = document.querySelector(
      ".orange-dino"
    ) as HTMLElement | null;
    if (orangeDino) {
      orangeDino.style.transform = `translate(${orangeDinoOffsetX}px, ${orangeDinoOffsetY}px)`;
    }
  };

  // Request permission for motion (iOS)
  const requestMotionPermission = async () => {
    if (
      typeof window.DeviceOrientationEvent !== "undefined" &&
      typeof window.DeviceOrientationEvent.requestPermission === "function"
    ) {
      try {
        const response =
          await window.DeviceOrientationEvent.requestPermission();
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
      if (
        typeof window.DeviceOrientationEvent.requestPermission !== "function"
      ) {
        window.addEventListener("deviceorientation", handleOrientation);
        setMotionEnabled(true);
      }
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  // Reset gyroOffset when motion is enabled
  useEffect(() => {
    gyroOffset.current = null;
  }, [motionEnabled]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;

    const threshold = 50; // pixels
    if (deltaY < -threshold) {
      // swipe up = next page
      setPage((prev) => (prev + 1) % 3);
    } else if (deltaY > threshold) {
      // swipe down = previous page
      setPage((prev) => (prev - 1 + 3) % 3);
    }

    touchStartY.current = null;
  };

  return (
    <>
      {!motionEnabled ? (
        <div className="flex flex-col items-center justify-center min-h-screen w-70  mx-auto">
          <button
            onClick={requestMotionPermission}
            className="z-50 bg-orange-600 text-white px-6 py-3 rounded shadow text-lg font-bold uppercase"
          >
            Tap this button to make dinosaurs move and then swipe up to see the
            next page!
          </button>
        </div>
      ) : (
        <div
          ref={backgroundRef}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          className="app-container h-[100dvh] max-w-md mx-auto px-0 py-0 shadow-md justify-between rounded-sm flex flex-col relative overflow-hidden"
          style={{
            backgroundImage:
              page !== 2
                ? "url('/elements/MainBackground.png')"
                : "url('/elements/Background.png')",
            backgroundSize: "100% 100%",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div>
            {page === 0 && (
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
            )}

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
              {page === 0 && (
                <>
                  <div className="text-blue-500 text-xl font-bold">
                    July 6, 2025 - Sunday
                  </div>
                  <div className="text-orange-500 text-lg font-bold">
                    11:00 AM TO 2:00 PM
                  </div>
                  <div className="text-yellow-800 text-lg font-bold">
                    Max's Scout Tuazon
                  </div>
                  <div className="text-yellow-800 text-lg font-bold">
                    Ruby Hall A
                  </div>
                  <div className="text-yellow-800 text-lg font-bold">
                    21 Scout Tuazon St.
                  </div>
                  <div className="text-yellow-800 text-lg font-bold">
                    Diliman, Quezon City
                  </div>
                </>
              )}
              {page === 1 && (
                <>
                  <div className="text-orange-500 text-2xl font-bold">RSVP</div>
                  <div className="text-yellow-800 text-lg font-bold">
                    Please RSVP by June 30, 2025
                  </div>
                  <div className="text-yellow-800 text-sm font-bold">
                    Our giveaways are personalized,
                  </div>
                  <div className="text-yellow-800 text-sm font-bold">
                    so we need your name
                  </div>
                  <div className="text-yellow-800 text-sm font-bold">
                    in time to prep your special surprise!
                  </div>
                  <div className="text-yellow-800 text-sm font-bold">
                    Scan the QR on the Dino egg
                  </div>
                  <div className="text-yellow-800 text-sm font-bold">
                    or visit this{" "}
                    <u>
                      <a
                        className="text-blue-500"
                        href="https://forms.gle/gpuMWNnPxkrrfVAR9"
                      >
                        link
                      </a>
                    </u>{" "}
                    to RSVP
                  </div>
                  <div className="text-yellow-800 text-sm font-bold">
                    dont let the dinos down!
                  </div>
                  <div>
                    <Image
                      width="150"
                      height="150"
                      src="/elements/qr.png"
                      className="qr-code-image"
                      alt="QR Code"
                    />
                  </div>
                </>
              )}
              {page === 2 && (
                <>
                  <div className="text-orange-400 text-xl font-bold">
                    RAWR-SOME NEWS!
                  </div>
                  <div className="text-yellow-800 text-sm font-bold">
                    No gifts needed,
                  </div>
                  <div className="text-yellow-800 text-md font-bold">
                    just your presence is the best treat!
                  </div>
                  <div className="text-yellow-800 text-sm font-bold">
                    But if you'd like to bring
                  </div>
                  <div className="text-yellow-800 text-sm font-bold">
                    a little something,
                  </div>
                  <div className="text-yellow-800 text-sm font-bold">
                    Scan the Gifts or visit this{" "}
                    <a
                      className="text-blue-400"
                      href="https://ezio-gift-registry-seven.vercel.app/"
                    >
                      link
                    </a>
                  </div>
                  <div className="text-yellow-800 text-sm font-bold">
                    to see Ezio's gift guide!
                  </div>
                  <div>
                    <Image
                      width="100"
                      height="100"
                      src="/elements/gifts.png"
                      className="gift-guide-image"
                      alt="Gift Guide"
                    />
                  </div>

                  <div className="text-orange-400 text-xl font-bold">
                    Dress Code
                  </div>
                  <div className="text-yellow-800 text-sm font-bold">
                    We highly request for the guests
                  </div>
                  <div className="text-yellow-800 text-sm font-bold">
                    to wear these colors:
                  </div>
                  <div>
                    <Image
                      width="200"
                      height="200"
                      src="/elements/dresscode.png"
                      className="dress-code-image"
                      alt="Dress Code"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-row items-center justify-between p-4 relative">
            {page === 0 && (
              <>
                <div>
                  <Image
                    height={200}
                    width={200}
                    className="green-dino-parallax"
                    src="/elements/green-dino.png"
                    alt="green dino"
                  />
                </div>
                <div>
                  <Image
                    height={200}
                    width={200}
                    className="blue-dino-parallax"
                    src="/elements/blue-dino.png"
                    alt="blue dino"
                  />
                </div>
              </>
            )}
          </div>
          {page === 0 && (
            <img
              src="/elements/eggs-modified.png"
              className="egg scale-30 absolute top-85 right-30 w-full"
              alt="egg"
            />
          )}
          {page === 1 && (
            <img
              src="/elements/orange-dino.png"
              className="orange-dino scale-60 absolute top-70 left-0 w-full"
              alt="orange dino"
            />
          )}
          {show && (
            <Image
              height={200}
              width={200}
              className="absolute bottom-0 right-22 z-10"
              src="/elements/swipeup.gif"
              alt="Ezio's Logo"
            />
          )}
        </div>
      )}
    </>
  );
}
