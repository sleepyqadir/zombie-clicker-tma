import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useAddress } from "@thirdweb-dev/react";

interface Monster {
  health: number;
  maxHealth: number;
  type: "kid" | "golem" | "gunMaster" | "steveeWalk" | "MegaVolt";
  reward: number;
}

const monsterTypes = [
  {
    type: "kid",
    name: "Dexter",
    minHealth: 30,
    maxHealth: 60,
    reward: 3,
    image: "/zombinOne.gif",
  },
  {
    type: "golem",
    name: "Golem",
    minHealth: 61,
    maxHealth: 75,
    reward: 5,
    image: "/zombinTwo.gif",
  },
  {
    type: "gunMaster",
    name: "Gun Master",
    minHealth: 76,
    maxHealth: 85,
    reward: 7,
    image: "/zombinTree.gif",
  },
  {
    type: "steveeWalk",
    name: "Stevee Walk",
    minHealth: 86,
    maxHealth: 95,
    reward: 10,
    image: "/stevee_walk.gif",
  },
  {
    type: "MegaVolt",
    name: "Mega Volt",
    minHealth: 96,
    maxHealth: 100,
    reward: 15,
    image: "/megavolt.gif",
  },
];

const MiniGame: React.FC = ({ refetch }) => {
  const address = useAddress();
  const [energy, setEnergy] = useState(100);
  const [monster, setMonster] = useState<Monster | null>(null);
  const [showReward, setShowReward] = useState(false);
  const [currentReward, setCurrentReward] = useState(0);
  const [isClaiming, setIsClaiming] = useState(false);

  // Initialize audio.
  const zombieSound = new Audio("/zombie-sound.mp3"); // Ensure the correct path

  // Function to play sound
  const playZombieSound = () => {
    zombieSound.play();
  };

  // Initialize audio
  const clickSound = new Audio("/clicker.mp3"); // Ensure the correct path

  // Function to play sound
  const playClickSound = () => {
    clickSound.play();
  };

  const generateMonster = () => {
    const health = Math.floor(Math.random() * (100 - 30 + 1)) + 30;
    const monsterType = monsterTypes.find(
      (m) => health >= m.minHealth && health <= m.maxHealth
    )!;
    setMonster({
      health,
      maxHealth: health,
      type: monsterType.type as
        | "kid"
        | "golem"
        | "gunMaster"
        | "steveeWalk"
        | "MegaVolt",
      reward: monsterType.reward,
    });
    setCurrentReward(monsterType.reward);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setEnergy((prevEnergy) => Math.min(prevEnergy + 1, 30));
    }, 1000);

    if (!monster) {
      generateMonster();
    }

    return () => clearInterval(timer);
  }, [monster]);

  const handleClick = () => {
    if (energy > 0 && monster) {
      playClickSound();
      setEnergy((prevEnergy) => prevEnergy - 1);

      const newHealth = monster.health - 1;
      if (newHealth <= 0) {
        playZombieSound();
        setShowReward(true);
      } else {
        setMonster({ ...monster, health: newHealth });
      }
    }
  };

  const handleRewardClaim = async () => {
    if (!address || isClaiming) return;

    setIsClaiming(true);
    try {
      const response = await fetch("/api/mintToken", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userWalletAddress: address,
          amount: currentReward,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Claim successful:", result);
        setShowReward(false);
        generateMonster();
      } else if (response.status === 408) {
        console.log("Transaction not mined within timeout period:", result);
      } else {
        console.error("Claim failed:", result);
      }
    } catch (error) {
      console.error("Error claiming reward:", error);
    } finally {
      setIsClaiming(false);
      refetch(); // TODO: reftch the token balance here
    }
  };

  return (
    <div
      style={{
        cursor: "url('hammer.png'), auto", // Replace with your custom cursor URL
      }}
      className="flex flex-col items-center justify-center text-white"
    >
      {monster && (
        <div className="text-center">
          <div
            style={{
              cursor: "url('hammer.png'), auto", // Replace with your custom cursor URL
            }}
            className="relative cursor-pointer"
            onClick={handleClick}
          >
            <Image
              src={monsterTypes.find((m) => m.type === monster.type)!.image}
              alt={monster.type}
              width={200}
              height={200}
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
              Click to attack!
            </div>
          </div>
          <div className="mt-10">
            {monsterTypes.find((m) => m.type === monster.type)?.name ||
              "Monster"}
          </div>
          <div className="w-full bg-gray-700 rounded-full h-4 mt-2">
            <div
              className="bg-red-500 rounded-full h-4"
              style={{
                width: `${(monster.health / monster.maxHealth) * 100}%`,
              }}
            ></div>
          </div>
          <div className="mt-1">
            {monster.health}/{monster.maxHealth}
          </div>
        </div>
      )}
      <div className="mt-4 w-64 bg-gray-700 rounded-full h-6">
        <div
          className="bg-green-500 rounded-full h-6"
          style={{ width: `${(energy / 30) * 100}%` }}
        ></div>
      </div>
      <div className="mt-2">Energy: {energy}/30</div>

      {showReward && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <h2 className="text-xl font-bold mb-4 text-white">
              {monsterTypes.find((m) => m.type === monster!.type)?.name ||
                "Monster"}{" "}
              Defeated!
            </h2>
            <p className="text-gray-300 mb-4">
              You earned {currentReward} coins!
            </p>
            <button
              className={`mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                isClaiming ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleRewardClaim}
              disabled={isClaiming}
            >
              {isClaiming ? "Claiming..." : "Claim Reward"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MiniGame;
