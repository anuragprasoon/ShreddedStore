import { useState } from "react";
import DesktopNavbar from "@/components/topnav";
import Footer from "@/components/footer";

const SpinPage = () => {
  const prizes: string[] = [
    "Free Jersey",
    "50% Off Shoes",
    "Water Bottle",
    "Protein Shake",
    "Training Session",
    "Cap",
    "Try Again",
    "Gym Bag",
  ];

  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedPrize, setSelectedPrize] = useState<string | null>(null);
  const [hasSpun, setHasSpun] = useState(false);

  const spinWheel = () => {
    if (spinning || hasSpun) return;

    setSpinning(true);
    setSelectedPrize(null);

    const extraSpins = (Math.floor(Math.random() * 3) + 3) * 360;
    const randomPrizeIndex = Math.floor(Math.random() * prizes.length);
    const anglePerSlice = 360 / prizes.length;
    const targetAngle =
      360 - randomPrizeIndex * anglePerSlice - anglePerSlice / 2;

    const finalRotation = extraSpins + targetAngle;
    setRotation(finalRotation);

    setTimeout(() => {
      setSelectedPrize(prizes[randomPrizeIndex]);
      setSpinning(false);
      setHasSpun(true);
    }, 4000);
  };

  const claimPrize = () => {
    alert(`🎉 You claimed: ${selectedPrize}`);
    // You can integrate with API here to save prize claim
  };

  return (<>
  <DesktopNavbar />
    <div className="flex flex-col items-center font-['Urbanist'] justify-center min-h-screen bg-black text-white px-4">
      <h1 className="text-3xl font-bold mb-8">🏆 Spin & Win</h1>

      {/* Wheel */}
      <div className="relative w-80 h-80 mb-8">
        <div
          className="absolute w-full h-full rounded-full flex items-center justify-center border-4 border-yellow-500 shadow-lg"
          style={{
            background: `conic-gradient(
              #FACC15 0deg 45deg,
              #F97316 45deg 90deg,
              #FACC15 90deg 135deg,
              #F97316 135deg 180deg,
              #FACC15 180deg 225deg,
              #F97316 225deg 270deg,
              #FACC15 270deg 315deg,
              #F97316 315deg 360deg
            )`,
            transform: `rotate(${rotation}deg)`,
            transition: spinning
              ? "transform 4s cubic-bezier(0.33, 1, 0.68, 1)"
              : "none",
          }}
        >
          {prizes.map((prize, i) => {
            const angle = (360 / prizes.length) * i + 22.5;
            return (
              <div
                key={i}
                className="absolute text-sm font-semibold text-black"
                style={{
                  transform: `rotate(${angle}deg) translate(115px) rotate(-${angle}deg)`,
                }}
              >
                {prize}
              </div>
            );
          })}
        </div>

        {/* Pointer */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[14px] border-r-[14px] border-b-[28px] border-l-transparent border-r-transparent border-b-red-600" />
      </div>

      {/* Button Section */}
      {!hasSpun ? (
        <button
          onClick={spinWheel}
          disabled={spinning}
          className="px-8 py-3 bg-red-600 rounded-lg font-semibold text-lg hover:bg-red-700 disabled:opacity-50 shadow-md"
        >
          {spinning ? "Spinning..." : "Spin"}
        </button>
      ) : (
        selectedPrize && (
          <button
            onClick={claimPrize}
            className="px-8 py-3 bg-green-600 rounded-lg font-semibold text-lg hover:bg-green-700 shadow-md"
          >
            Claim Prize
          </button>
        )
      )}

      {/* Prize Message */}
      {selectedPrize && (
        <p className="mt-6 text-xl font-semibold text-yellow-400">
          🎉 You won: {selectedPrize}!
        </p>
      )}
    </div>
    <Footer/>
    </>
  );
};

export default SpinPage;
