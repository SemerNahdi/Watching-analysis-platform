"use client"
import { useEffect, useState } from "react";
import Spline from "@splinetool/react-spline";
import { TypingAnimation } from "./magicui/typing-animation";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { TextEffect } from "@/components/motion-primitives/text-effect";

export default function Header() {
  const [isLoading, setIsLoading] = useState(true); // Track loading state for the 3D model

  useEffect(() => {
    // You can also handle any animation or page load state here
    const handleLoad = () => {
      setIsLoading(false); // Set loading state to false when the page is loaded
    };

    window.onload = handleLoad; // Set up the load event listener

    return () => {
      // Cleanup on component unmount
      window.onload = null;
    };
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-transparent"
      style={{ height: "100vh" }}
      suppressHydrationWarning={true}
    >
      {/* Left Content: Text and Call-to-Action */}
      <div className="flex-1 flex flex-col justify-center items-start space-y-6 max-w-2xl">
        <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
          <TextEffect per="char" preset="fade">
            See What They See, Feel What They Feel
          </TextEffect>
        </h1>

        <p className="text-lg text-gray-700 dark:text-white">
          Gain deep insights into viewer behavior. Identify the moments that
          captivate and the ones that lose them. Transform your videos into
          unforgettable experiences with real-time analytics and actionable
          feedback.
        </p>

        <RainbowButton>Unlock Viewer Insights</RainbowButton>
      </div>

      {/* Right Content: 3D Model */}
      <div className="flex-1 w-full h-full flex items-center justify-center relative">
        {/* Show a loading spinner or message if the 3D model is still loading */}
        {/* {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="spinner-border animate-spin border-4 border-blue-500 border-t-transparent w-12 h-12 rounded-full"></div>
          </div>
        )} */}

        {/* Only show the 3D model once it has loaded */}
        <Spline
          scene="https://prod.spline.design/kDeJSI6dvtUrwiXy/scene.splinecode"
          className={`w-full h-full ${isLoading ? "opacity-0" : "opacity-100"} transition-opacity duration-500`}
          onLoad={() => setIsLoading(false)} // Once the model has loaded, stop showing the loader
        />
      </div>
    </div>
  );
}
