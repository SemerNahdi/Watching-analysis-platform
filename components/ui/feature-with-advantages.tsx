"use client"
import { Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { TextEffect } from "@/components/motion-primitives/text-effect";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from "react";

function Feature() {
  useEffect(() => {
    // Initialize AOS animations only on the client side
    AOS.init({
      duration: 2500,
       // You can adjust the animation duration
    });
  }, []); 
  return (
    <div data-aos="fade-up" suppressHydrationWarning={true}>
    <div className="w-full py-2 lg:py-4">
      <div className="container mx-auto">
        <div className="flex py-2 lg:py-4 flex-col items-start">
          <div className="flex gap-2 flex-col">
            <h2 className="text-3xl md:text-5xl tracking-tighter lg:max-w-xl font-regular">
            <TextEffect
              preset="fade-in-blur"
              speedReveal={1.1}
              speedSegment={0.3}
            >
              Transform Your Videos with Data-Driven Insights
            </TextEffect>
            </h2>
            <p className="text-lg max-w-xl lg:max-w-xl leading-relaxed tracking-tight text-muted-foreground">
              Unlock the power of viewer analytics to create captivating content
              and boost engagement.
            </p>
          </div>
          <div className="flex gap-10 pt-12 flex-col w-full">
            <div className="grid grid-cols-2 items-start lg:grid-cols-3 gap-10">
              <div className="flex flex-row gap-6 w-full items-start">
                <Check className="w-4 h-4 mt-2 text-primary" />
                <div className="flex flex-col gap-1">
                  <p>Real-Time Analytics</p>
                  <p className="text-muted-foreground text-sm">
                    Track viewer engagement as it happens.
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-6 items-start">
                <Check className="w-4 h-4 mt-2 text-primary" />
                <div className="flex flex-col gap-1">
                  <p>Boring Moment Detection</p>
                  <p className="text-muted-foreground text-sm">
                    Identify and fix dull moments in your videos.
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-6 items-start">
                <Check className="w-4 h-4 mt-2 text-primary" />
                <div className="flex flex-col gap-1">
                  <p>Actionable Insights</p>
                  <p className="text-muted-foreground text-sm">
                    Get clear recommendations to improve your content.
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-6 w-full items-start">
                <Check className="w-4 h-4 mt-2 text-primary" />
                <div className="flex flex-col gap-1">
                  <p>Audience Retention</p>
                  <p className="text-muted-foreground text-sm">
                    Understand where viewers drop off and why.
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-6 items-start">
                <Check className="w-4 h-4 mt-2 text-primary" />
                <div className="flex flex-col gap-1">
                  <p>Content Optimization</p>
                  <p className="text-muted-foreground text-sm">
                    Tailor your videos for maximum impact.
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-6 items-start">
                <Check className="w-4 h-4 mt-2 text-primary" />
                <div className="flex flex-col gap-1">
                  <p>Beautiful Dashboards</p>
                  <p className="text-muted-foreground text-sm">
                    Visualize your data with modern, intuitive tools.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
}

export { Feature };
