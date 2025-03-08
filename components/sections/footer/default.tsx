import { ModeToggle } from "../../ui/mode-toggle";
import {
  Footer,
  FooterColumn,
  FooterBottom,
  FooterContent,
} from "../../ui/footer";
import Spline from "@splinetool/react-spline";

export default function FooterSection() {
  return (
    <footer className="w-full bg-background px-4 border-t border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto max-w-container">
        <Footer>
          <FooterContent>
            {/* Left Column: Brand Logo and Tagline */}
            <FooterColumn className="col-span-2 sm:col-span-3 md:col-span-1">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-cyan-400 dark:to-blue-600">
                  WeeSee
                </h3>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Your vision, our innovation.
              </p>
            </FooterColumn>

            {/* Middle Columns: Links */}
            <FooterColumn>
              <h3 className="text-md pt-1 font-semibold">Product</h3>
              <a href="/" className="text-sm text-muted-foreground hover:text-foreground hover:translate-x-2 transition-all duration-300">
                Changelog
              </a>
              <a href="/" className="text-sm text-muted-foreground hover:text-foreground hover:translate-x-2 transition-all duration-300">
                Documentation
              </a>
            </FooterColumn>
            <FooterColumn>
              <h3 className="text-md pt-1 font-semibold">Company</h3>
              <a href="/" className="text-sm text-muted-foreground hover:text-foreground hover:translate-x-2 transition-all duration-300">
                About
              </a>
              <a href="/" className="text-sm text-muted-foreground hover:text-foreground hover:translate-x-2 transition-all duration-300">
                Careers
              </a>
              <a href="/" className="text-sm text-muted-foreground hover:text-foreground hover:translate-x-2 transition-all duration-300">
                Blog
              </a>
            </FooterColumn>
            <FooterColumn>
              <h3 className="text-md pt-1 font-semibold">Contact</h3>
              <a href="/" className="text-sm text-muted-foreground hover:text-foreground hover:translate-x-2 transition-all duration-300">
                Discord
              </a>
              <a href="/" className="text-sm text-muted-foreground hover:text-foreground hover:translate-x-2 transition-all duration-300">
                Twitter
              </a>
              <a href="/" className="text-sm text-muted-foreground hover:text-foreground hover:translate-x-2 transition-all duration-300">
                Github
              </a>
            </FooterColumn>

            {/* Right Column: Spline Component */}
            <FooterColumn className="hidden md:flex items-center justify-end">
              <Spline
                scene="https://prod.spline.design/kDeJSI6dvtUrwiXy/scene.splinecode"
                className="w-[50vw] h-[50vh]"
              />
            </FooterColumn>
          </FooterContent>

          {/* Footer Bottom: Copyright and Links */}
          <FooterBottom>
            <div className="text-sm text-muted-foreground">
              © 2025 WeeSee. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <a href="/" className="text-sm text-muted-foreground hover:text-foreground hover:translate-x-2 transition-all duration-300">
                Privacy Policy
              </a>
              <a href="/" className="text-sm text-muted-foreground hover:text-foreground hover:translate-x-2 transition-all duration-300">
                Terms of Service
              </a>
              <ModeToggle />
            </div>
          </FooterBottom>
        </Footer>
      </div>
    </footer>
  );
}