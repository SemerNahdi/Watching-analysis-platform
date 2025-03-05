import { Card } from "@/components/ui/card"; // Import shadcn Card component
import { motion } from "framer-motion"; // Import framer-motion for animations

export function HowItWorks() { // Ensure this is exported
  // Animation variants for framer-motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Stagger animations for each child
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <div className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <motion.div
          className="grid grid-cols-1 md:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }} // Animate only once
        >
          {/* Step 1 */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="text-4xl mb-4 font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Upload Your Video</h3>
              <p className="text-gray-600">
                Easily upload your video to our platform.
              </p>
            </Card>
          </motion.div>

          {/* Step 2 */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="text-4xl mb-4 font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Analyze Engagement</h3>
              <p className="text-gray-600">
                We analyze viewer behavior and highlight key moments.
              </p>
            </Card>
          </motion.div>

          {/* Step 3 */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="text-4xl mb-4 font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Insights</h3>
              <p className="text-gray-600">
                Receive actionable insights to improve your content.
              </p>
            </Card>
          </motion.div>

          {/* Step 4 */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 text-center hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer">
              <div className="text-4xl mb-4 font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                4
              </div>
              <h3 className="text-xl font-semibold mb-2">Optimize & Grow</h3>
              <p className="text-gray-600">
                Create better videos and grow your audience.
              </p>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}