import Hero from "@/components/hero";
import ConnectSupabaseSteps from "@/components/tutorial/connect-supabase-steps";
import SignUpUserSteps from "@/components/tutorial/sign-up-user-steps";
import { hasEnvVars } from "@/utils/supabase/check-env-vars";
import Spline from "@splinetool/react-spline";
import { PricingSection } from "@/components/pricing-section";
export const PAYMENT_FREQUENCIES = ["monthly", "yearly"]
import { Feature } from "@/components/ui/feature-with-advantages";
// import { TestimonialsSection } from "@/components/testimonials-with-marquee";
import { GoogleGeminiEffectDemo } from "@/components/GoogleGeminiEffectDemo";
import Faq02 from "@/components/kokonutui/faq-02"
import Chat from "@/components/Chat";

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
    <section id="hero">
      <Hero />
    </section>
      {/* <main className="flex-1 flex flex-col gap-6 px-4">
        <h2 className="font-medium text-xl mb-4">Next steps</h2>
        {hasEnvVars ? <SignUpUserSteps /> : <ConnectSupabaseSteps />}
      </main> */}
      <section id="features">
        <Feature />
      </section>
      <section id="demo">
        <GoogleGeminiEffectDemo />
      </section>
      <section id="pricing">
        <PricingSection
          title="Simple Pricing"
          subtitle="Choose the best plan for your needs"
          frequencies={PAYMENT_FREQUENCIES}
          tiers={TIERS}
        />
      </section>
      <section id="faq">
        <Faq02 />
      </section>
      <Chat />
    </>
  );
}
