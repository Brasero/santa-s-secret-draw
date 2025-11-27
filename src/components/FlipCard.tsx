import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FlipCardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  onFlipComplete?: () => void;
}

export const FlipCard = ({ frontContent, backContent, onFlipComplete }: FlipCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(true);
    if (onFlipComplete) {
      setTimeout(onFlipComplete, 600);
    }
  };

  return (
    <div className="perspective-1000 w-full max-w-md mx-auto">
      <motion.div
        className="relative w-full h-[400px] cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{
          duration: 0.6,
          type: 'spring',
          stiffness: 100,
          damping: 15,
        }}
        onClick={!isFlipped ? handleFlip : undefined}
      >
        {/* Front of card */}
        <motion.div
          className={cn(
            "absolute inset-0 backface-hidden rounded-3xl shadow-elegant",
            "bg-gradient-to-br from-primary to-primary-glow",
            "flex flex-col items-center justify-center p-8",
            "border-4 border-accent/20"
          )}
          style={{ backfaceVisibility: 'hidden' }}
        >
          {frontContent}
        </motion.div>

        {/* Back of card */}
        <motion.div
          className={cn(
            "absolute inset-0 backface-hidden rounded-3xl shadow-elegant",
            "bg-card",
            "flex flex-col items-center justify-center p-8",
            "border-4 border-accent"
          )}
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {backContent}
        </motion.div>
      </motion.div>

      {!isFlipped && (
        <motion.div
          className="text-center text-primary-foreground mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5  }}
        >
          <motion.p
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            Touchez la carte pour découvrir votre Secret Santa ! 🎁
          </motion.p>
        </motion.div>
      )}
    </div>
  );
};