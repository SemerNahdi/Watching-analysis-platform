import Spline from '@splinetool/react-spline';
import { TypingAnimation } from './magicui/typing-animation';

export default function Header() {
  return (
    <div
      className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-transparent"
      style={{ height: '100vh' }}
    >
      {/* Left Content: Text and Call-to-Action */}
      <div className="flex-1 flex flex-col justify-center items-start space-y-6 max-w-2xl ">
        <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
          See What They See, Feel What They Feel
        </h1>
        
        <p className="text-lg text-gray-700 dark:text-white">
          Gain deep insights into viewer behavior. Identify the moments that captivate and the ones that lose them. Transform your videos into unforgettable experiences with real-time analytics and actionable feedback.
        </p>
        <button
          className="px-8 py-3 bg-black text-white font-semibold rounded-lg hover:bg-gray-800 transition-all duration-300"
        >
          Unlock Viewer Insights →
        </button>
      </div>

      {/* Right Content: 3D Model */}
      <div className="flex-1 w-full h-full flex items-center justify-center">
        <Spline
          scene="https://prod.spline.design/kDeJSI6dvtUrwiXy/scene.splinecode"
          className="w-full h-full"
        />
      </div>
    </div>
  );
}