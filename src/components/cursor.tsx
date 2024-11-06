import { useCursor } from "./cursor-context";
import { motion } from "framer-motion";

const Cursor = () => {
  const { cursorRef, mousePos } = useCursor();

  return (
    <motion.div
      ref={cursorRef}
      animate={{
        x: mousePos.x - 15,
        y: mousePos.y - 15,
      }}
      transition={{ ease: "easeOut", duration: 0.1618 }}
      style={{
        height: 30,
        width: 30,
        position: "absolute",
        backgroundColor: "#333333",
        borderRadius: "50%",
        opacity: "80%",
        zIndex: 100,
        pointerEvents: "none",
      }}
    />
  );
};

export { Cursor };
