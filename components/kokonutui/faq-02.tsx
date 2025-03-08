"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronDown, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItemProps {
  question: string;
  answer: string;
  index: number;
}

import { Button } from "@/components/share button/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/share button/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/share button/tooltip";
import {
  RiCodeFill,
  RiFacebookFill,
  RiMailLine,
  RiTwitterXFill,
  RiLinkedinFill,
} from "@remixicon/react";

import { CheckIcon, CopyIcon } from "lucide-react"; // Make sure you import the correct icons
import { useId } from "react";

function FAQItem({ question, answer, index }: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.3,
        delay: index * 0.15,
        ease: "easeOut",
      }}
      className={cn(
        "group rounded-lg border-[0.5px] border-gray-200/50 dark:border-gray-800/50",
        "transition-all duration-200 ease-in-out",
        isOpen
          ? "bg-linear-to-br from-white via-gray-50/50 to-white dark:from-white/5 dark:via-white/2 dark:to-white/5"
          : "hover:bg-gray-50/50 dark:hover:bg-white/[0.02]"
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 flex items-center justify-between gap-4"
      >
        <h3
          className={cn(
            "text-base font-medium transition-colors duration-200 text-left",
            "text-gray-700 dark:text-gray-300",
            isOpen && "text-gray-900 dark:text-white"
          )}
        >
          {question}
        </h3>
        <motion.div
          animate={{
            rotate: isOpen ? 180 : 0,
            scale: isOpen ? 1.1 : 1,
          }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
          className={cn(
            "p-0.5 rounded-full shrink-0",
            "transition-colors duration-200",
            isOpen ? "text-primary" : "text-gray-400 dark:text-gray-500"
          )}
        >
          <ChevronDown className="h-4 w-4" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: "auto",
              opacity: 1,
              transition: {
                height: {
                  duration: 0.4,
                  ease: [0.04, 0.62, 0.23, 0.98],
                },
                opacity: {
                  duration: 0.25,
                  delay: 0.1,
                },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: {
                  duration: 0.3,
                  ease: "easeInOut",
                },
                opacity: {
                  duration: 0.25,
                },
              },
            }}
          >
            <div className="px-6 pb-4 pt-2">
              <motion.p
                initial={{ y: -8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -8, opacity: 0 }}
                transition={{
                  duration: 0.3,
                  ease: "easeOut",
                }}
                className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed"
              >
                {answer}
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Faq02() {
  const [copied, setCopied] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null); // Define the ref here
  const id = useId(); // Assuming you are using `useId` for generating unique IDs

  const faqs: Omit<FAQItemProps, "index">[] = [
    {
      question: "What makes your platform unique?",
      answer:
        "Our platform stands out through its intuitive design, powerful automation capabilities, and seamless integration options. We've focused on creating a user experience that combines simplicity with advanced features.",
    },
    {
      question: "How does the pricing structure work?",
      answer:
        "We offer flexible, transparent pricing tiers designed to scale with your needs. Each tier includes a core set of features, with additional capabilities as you move up. All plans start with a 14-day free trial.",
    },
    {
      question: "What kind of support do you offer?",
      answer:
        "We provide comprehensive support through multiple channels. This includes 24/7 live chat, detailed documentation, video tutorials, and dedicated account managers for enterprise clients.",
    },
    {
      question: "How can I get started?",
      answer:
        "You can get started by signing up for a free trial. Once you've signed up, you'll have access to our platform's full range of features. You can also contact our support team for assistance.",
    },
  ];

  // Define the handleCopy function
  const handleCopy = () => {
    if (inputRef.current) {
      navigator.clipboard.writeText(inputRef.current.value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <section className="py-16 w-full bg-linear-to-b from-transparent via-gray-50/50 to-transparent dark:from-transparent dark:via-white/[0.02] dark:to-transparent">
      <div className="container px-4 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center mb-12"
        >
          <h2 className="text-3xl font-semibold mb-3 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Everything you need to know about our platform
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-2">
          {faqs.map((faq, index) => (
            <FAQItem key={index} {...faq} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={cn("max-w-md mx-auto mt-12 p-6 rounded-lg text-center")}
        >
          <div className="inline-flex items-center justify-center p-1.5 rounded-full  mb-4">
            <Mail className="h-4 w-4" />
          </div>
          <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
            Still have questions?
          </p>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-4">
            We're here to help you
          </p>
          {/* <button
            type="button"
            className={cn(
              "px-4 py-2 text-sm rounded-md",
              "bg-gray-900 dark:bg-white text-white dark:text-gray-900",
              "hover:bg-gray-800 dark:hover:bg-gray-100",
              "transition-colors duration-200",
              "font-medium"
            )}
          >
            Contact Support
          </button> */}

          <div className="flex flex-col gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "px-4 py-2 text-sm rounded-md",
                    "bg-gray-900 dark:bg-white text-white dark:text-gray-900",
                    "hover:bg-gray-800 dark:hover:bg-gray-100",
                    "transition-colors duration-200",
                    "font-medium"
                  )}
                >
                  Contact Support
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72">
                <div className="flex flex-col gap-3 text-center">
                  <div className="text-sm font-medium">Contact developer</div>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Button size="icon" variant="outline" aria-label="Share on Linkedin">
                      <RiLinkedinFill size={16} aria-hidden="true" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      aria-label="Share on Twitter"
                    >
                      <RiTwitterXFill size={16} aria-hidden="true" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      aria-label="Share on Facebook"
                    >
                      <RiFacebookFill size={16} aria-hidden="true" />
                    </Button>
                    <Button
                      size="icon"
                      variant="outline"
                      aria-label="Share via email"
                    >
                      <RiMailLine size={16} aria-hidden="true" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div className="relative">
                      <Input
                        ref={inputRef} // Use the ref here
                        id={id}
                        className="pe-9"
                        type="text"
                        defaultValue="semernahdi25@gmail.com"
                        aria-label="Share link"
                        readOnly
                      />
                      <TooltipProvider delayDuration={0}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button
                              onClick={handleCopy}
                              className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed"
                              aria-label={
                                copied ? "Copied" : "Copy to clipboard"
                              }
                              disabled={copied}
                            >
                              <div
                                className={cn(
                                  "transition-all",
                                  copied
                                    ? "scale-100 opacity-100"
                                    : "scale-0 opacity-0"
                                )}
                              >
                                <CheckIcon
                                  className="stroke-emerald-500"
                                  size={16}
                                  aria-hidden="true"
                                />
                              </div>
                              <div
                                className={cn(
                                  "absolute transition-all",
                                  copied
                                    ? "scale-0 opacity-0"
                                    : "scale-100 opacity-100"
                                )}
                              >
                                <CopyIcon size={16} aria-hidden="true" />
                              </div>
                            </button>
                          </TooltipTrigger>
                          <TooltipContent className="px-2 py-1 text-xs">
                            Copy to clipboard
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default Faq02;
