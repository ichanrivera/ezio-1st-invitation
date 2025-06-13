'use client'
import Image from "next/image";
import { useEffect, useRef } from "react";

export default function Home() {

  const orangeRef = useRef<HTMLImageElement>(null);
  const greenRef = useRef<HTMLImageElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);

// Define handleOrientation outside of useEffect so it can be referenced in both hooks
const handleOrientation = (e: DeviceOrientationEvent) => {
  const x = e.gamma ?? 0; // left-right tilt
  const y = e.beta ?? 0;  // front-back tilt

  const offsetX = x / 3; // dampen movement
  const offsetY = y / 5;

  console.log("gamma", e.gamma, "beta", e.beta);


  if (orangeRef.current) {
    orangeRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  }
  if (greenRef.current) {
    greenRef.current.style.transform = `translate(${-offsetX}px, ${-offsetY}px)`;
  }
  if (backgroundRef.current) {
    backgroundRef.current.style.backgroundPosition = `${50 + offsetX}% ${50 + offsetY}%`;
  }
};

useEffect(() => {
  window.addEventListener("deviceorientation", handleOrientation, true);

  return () => {
    window.removeEventListener("deviceorientation", handleOrientation);
  };
}, []);

useEffect(() => {
  const handleMouseMove = (e: MouseEvent) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 30;
    const y = (e.clientY / window.innerHeight - 0.5) * 30;

    if (orangeRef.current) {
      orangeRef.current.style.transform = `translate(${x}px, ${y}px)`;
    }
    if (greenRef.current) {
      greenRef.current.style.transform = `translate(${-x}px, ${-y}px)`;
    }
  };

  window.addEventListener("mousemove", handleMouseMove);
  return () => window.removeEventListener("mousemove", handleMouseMove);
}, []);

useEffect(() => {
  // Type assertion to avoid TS error for requestPermission
  if (
    typeof DeviceOrientationEvent !== "undefined" &&
    typeof (DeviceOrientationEvent as any).requestPermission === "function"
  ) {
    ((DeviceOrientationEvent as any).requestPermission() as Promise<"granted" | "denied">)
      .then((response: "granted" | "denied") => {
        if (response === "granted") {
          window.addEventListener("deviceorientation", handleOrientation);
        }
      })
      .catch(console.error);
  } else {
    window.addEventListener("deviceorientation", handleOrientation);
  }

  return () => {
    window.removeEventListener("deviceorientation", handleOrientation);
  };
}, []);

  return (
    <div
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
            ref={orangeRef}
            height={120}
            width={120}
            className="flying-image-orange transition-transform duration-75"
            src="/elements/flying-orange.png"
            alt="Flying Orange"
          />
          <Image
            ref={greenRef}
            height={120}
            width={120}
            className="flying-image-green"
            src="/elements/flying-green.png"
            alt="Flying green"
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
            Diliman, Quezon City{" "}
          </div>
        </div>
      </div>

      <div className="flex flex-row items-center justify-between p-4">
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
      </div>
      <img src="/elements/eggs-modified.png" className="scale-30 absolute top-85 right-30 w-full" alt="egg" />
    </div>
  );
}
