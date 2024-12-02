import { MetaFunction } from "@remix-run/node";
import { Outlet } from "@remix-run/react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export const meta: MetaFunction = () => {
  return [{ title: "Authorization | UploadBytes" }];
};

export default function Auth() {
  const [showEmoji, setShowEmoji] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [hasShownEmoji, setHasShownEmoji] = useState(false);
  useEffect(() => {
    const seenBefore = localStorage.getItem("hsb");
    if (seenBefore) {
      setHasShownEmoji(true);
      setShowEmoji(false);
      setShowContent(true);
    } else {
      localStorage.setItem("hsb", "true");
    }
  }, []);

  useEffect(() => {
    if (!hasShownEmoji) {
      const emojiTimer = setTimeout(() => setShowEmoji(false), 2000);
      const contentTimer = setTimeout(() => setShowContent(true), 2500);
      setHasShownEmoji(true);
      return () => {
        clearTimeout(emojiTimer);
        clearTimeout(contentTimer);
      };
    } else {
      setShowEmoji(false);
      setShowContent(true);
    }
  }, [hasShownEmoji]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <AnimatePresence>
          {showEmoji && (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{
                opacity: 1,
                scale: 1,
                rotate: [0, -10, 10, -10, 10, 0],
              }}
              exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.5 } }}
              transition={{ duration: 2, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center text-9xl"
            >
              👋
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>{showContent && <Outlet />}</AnimatePresence>
      </div>
    </div>
  );
}
