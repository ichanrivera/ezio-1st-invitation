import Image from "next/image";

export default function Home() {
  return (
    <div
      className="app-container min-h-screen max-w-md mx-auto px-0 py-0 shadow-md rounded-sm flex flex-col relative overflow-hidden"
      style={{
        backgroundImage: "url('/elements/MainBackground.png')",
        backgroundSize: "100% 100%",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div
        style={{ fontFamily: "'Sunday', Arial, sans-serif" }}
        className="title-container flex flex-col items-center justify-center h-full"
      >
        <div>
          <span className="text-blue-300 text-xl font-bold title-letter">o</span>
          <span className="text-orange-300 text-xl font-bold title-letter">n</span>
          <span className="text-yellow-300 text-xl font-bold title-letter">e</span>
        </div>
        <div>
          <span className="text-green-600 text-xl font-bold title-letter">a</span>
          <span className="text-blue-300 text-xl font-bold title-letter">-</span>
          <span className="text-orange-300 text-xl font-bold title-letter">s</span>
          <span className="text-yellow-300 text-xl font-bold title-letter">a</span>
          <span className="text-green-600 text-xl font-bold title-letter">u</span>
          <span className="text-blue-300 text-xl font-bold title-letter">r</span>
          <span className="text-orange-300 text-xl font-bold title-letter">u</span>
          <span className="text-yellow-300 text-xl font-bold title-letter">s</span>
        </div>
      </div>
      <div className="wood-container flex flex-col items-center justify-center h-full w-full text-center">
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
      </div>

      <div
        style={{ fontFamily: "'Sunday', Arial, sans-serif" }}
        className="when-container flex flex-col items-center justify-center "
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
  );
}
