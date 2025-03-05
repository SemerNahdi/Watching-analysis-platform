import Hero from "@/components/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Spline from "@splinetool/react-spline";
import { PricingSection } from "@/components/pricing-section";
export const PAYMENT_FREQUENCIES = ["monthly", "yearly"]
import { Feature } from "@/components/ui/feature-with-advantages";
export const TIERS = [
  {
    id: "hobbyist",
    name: "Hobbyist",
    price: {
      monthly: "Free",
      yearly: "Free",
    },
    description: "Perfect for casual creators",
    features: [
      "1 video analysis per month",
      "Basic engagement metrics",
      "3-minute processing time",
      "Up to 3 saved reports",
      "Email support",
    ],
    cta: "Get started",
  },
  {
    id: "creator",
    name: "Creator",
    price: {
      monthly: 29,
      yearly: 25,
    },
    description: "Ideal for growing creators",
    features: [
      "10 video analyses per month",
      "Advanced engagement insights",
      "1-minute processing time",
      "Unlimited saved reports",
      "Priority email support",
    ],
    cta: "Get started",
    popular: true, // Highlight this plan as popular
  },
  {
    id: "pro",
    name: "Pro",
    price: {
      monthly: 99,
      yearly: 89,
    },
    description: "For professional content creators",
    features: [
      "Unlimited video analyses",
      "Real-time engagement tracking",
      "30-second processing time",
      "Customizable reports",
      "Dedicated account manager",
    ],
    cta: "Get started",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: {
      monthly: "Custom",
      yearly: "Custom",
    },
    description: "For teams and agencies",
    features: [
      "Everything in Pro",
      "Team collaboration tools",
      "White-label reports",
      "API access",
      "24/7 priority support",
    ],
    cta: "Contact Us",
    highlighted: true, // Highlight this plan for enterprise customers
  },
];
export default async function Home() {
  return (
    <>
      <Hero />
      {/* <main className="flex-1 flex flex-col gap-6 px-4">
        <h2 className="font-medium text-xl mb-4">Next steps</h2>
        {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
      </main> */}
      <Feature />
      how it works section 
      <PricingSection
          title="Simple Pricing"
          subtitle="Choose the best plan for your needs"
          frequencies={PAYMENT_FREQUENCIES}
          tiers={TIERS}
        />
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
