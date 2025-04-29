import React from "react";
import { motion } from "framer-motion";
import { FaCircle, FaDotCircle } from "react-icons/fa";

const Loading = ({ type = "bubbles", color = "#0096FF", size = 24 }) => {
  const commonProps = {
    style: { color },
    size,
  };

  if (type === "bubbles") {
    return (
      <div className="flex mt-[300px] items-center justify-center gap-2 h-20">
        {[0, 0.2, 0.4,0.6].map((delay, i) => (
          <motion.div
            key={i}
            initial={{ y: 0 }}
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay,
              ease: "easeInOut",
            }}
          >
            <FaCircle {...commonProps} />
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "bars") {
    return (
      <div className="flex items-end justify-center gap-1 h-20">
        {[1, 2, 3].map((_, i) => (
          <motion.div
            key={i}
            className="w-2 rounded bg-blue-500"
            style={{ height: 20 + i * 10 }}
            animate={{ scaleY: [1, 1.5, 1] }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    );
  }

  if (type === "cyclone") {
    return (
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
        className="flex justify-center items-center h-20"
      >
        <FaDotCircle {...commonProps} className="text-blue-500" />
      </motion.div>
    );
  }

  return <div>Invalid loader type</div>;
};

export default Loading;