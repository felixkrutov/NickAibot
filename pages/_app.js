// pages/_app.js - С АНИМАЦИЕЙ
import '../styles/globals.css';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';

export default function App({ Component, pageProps }) {
  const router = useRouter();

  const pageVariants = {
    initial: { opacity: 0 },
    in: { opacity: 1 },
    out: { opacity: 0 },
  };

  // Используем easeInOut для большей плавности
  const pageTransition = {
    type: 'tween',
    ease: 'easeInOut', // <<< Попробуем easeInOut
    duration: 0.4,
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
         key={router.pathname}
         initial="initial"
         animate="in"
         exit="out"
         variants={pageVariants}
         transition={pageTransition}
         className="h-full" // Важно для layout
      >
        <Component {...pageProps} />
      </motion.div>
    </AnimatePresence>
  );
}