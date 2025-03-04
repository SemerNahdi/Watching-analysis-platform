import Hero from "@/components/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Spline from "@splinetool/react-spline";

export default async function Home() {
  return (
    <>
      <Hero />
      {/* <main className="flex-1 flex flex-col gap-6 px-4">
        <h2 className="font-medium text-xl mb-4">Next steps</h2>
        {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
      </main> */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold">Real-Time Analytics</h3>
              <p className="text-gray-600">
                Track viewer engagement in real-time and make data-driven
                decisions.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold">Actionable Insights</h3>
              <p className="text-gray-600">
                Identify key moments and optimize your content for maximum
                impact.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-semibold">Boost Engagement</h3>
              <p className="text-gray-600">
                Turn passive viewers into active fans with captivating content.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">1</div>
              <h3 className="text-xl font-semibold">Upload Your Video</h3>
              <p className="text-gray-600">
                Easily upload your video to our platform.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">2</div>
              <h3 className="text-xl font-semibold">Analyze Engagement</h3>
              <p className="text-gray-600">
                We analyze viewer behavior and highlight key moments.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">3</div>
              <h3 className="text-xl font-semibold">Get Insights</h3>
              <p className="text-gray-600">
                Receive actionable insights to improve your content.
              </p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">4</div>
              <h3 className="text-xl font-semibold">Optimize & Grow</h3>
              <p className="text-gray-600">
                Create better videos and grow your audience.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <p className="text-gray-600">
                "This tool transformed how I create content. The insights are
                invaluable!"
              </p>
              <p className="mt-4 font-semibold">– Jane Doe, Content Creator</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <p className="text-gray-600">
                "I’ve never seen such detailed analytics. Highly recommend!"
              </p>
              <p className="mt-4 font-semibold">– John Smith, YouTuber</p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <p className="text-gray-600">
                "A game-changer for anyone serious about video content."
              </p>
              <p className="mt-4 font-semibold">– Sarah Lee, Filmmaker</p>
            </div>
          </div>
        </div>
      </div>
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="font-semibold">How does it work?</h3>
              <p className="text-gray-600">
                We analyze your video and provide detailed insights into viewer
                engagement.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <h3 className="font-semibold">Is there a free trial?</h3>
              <p className="text-gray-600">
                Yes, we offer a 14-day free trial for all plans.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
