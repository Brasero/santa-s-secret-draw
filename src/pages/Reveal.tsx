import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Home, Gift, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Snowfall } from '@/components/Snowfall';
import { FlipCard } from '@/components/FlipCard';
import { decodeDrawFromUrl, getAssignment } from '@/utils/drawLogic';
import { DrawResult } from '@/types/draw';
import { motion } from 'framer-motion';

const Reveal = () => {
  const { encodedDraw, participantId } = useParams<{ encodedDraw: string; participantId: string }>();
  const [result, setResult] = useState<DrawResult | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (encodedDraw && participantId) {
      const draw = decodeDrawFromUrl(encodedDraw);
      if (draw) {
        const assignment = getAssignment(draw, participantId);
        if (assignment) {
          setResult(assignment);
        }
      }
    }
  }, [encodedDraw, participantId]);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Résultat non trouvé</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Snowfall />

      <div className="relative z-10 container mx-auto px-4 py-12">
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {!revealed ? (
            <>
              <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-4">
                  Bonjour {result.giverName} ! 👋
                </h1>
                <p className="text-lg text-muted-foreground">
                  Prêt à découvrir ton Secret Santa ?
                </p>
              </div>

              <FlipCard
                frontContent={
                  <>
                    <motion.div
                      animate={{
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    >
                      <Gift className="w-24 h-24 text-primary-foreground mb-6" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-primary-foreground mb-2">
                      Ton Secret Santa
                    </h2>
                    <p className="text-primary-foreground/80">
                      Clique pour découvrir ! ✨
                    </p>
                  </>
                }
                backContent={
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                    className="text-center"
                  >
                    <Sparkles className="w-16 h-16 mx-auto text-accent mb-6" />
                    <h2 className="text-xl text-muted-foreground mb-4">
                      Tu dois offrir un cadeau à :
                    </h2>
                    <motion.div
                      className="bg-gradient-to-r from-primary via-accent to-secondary rounded-2xl p-8 mb-6"
                      animate={{
                        boxShadow: [
                          '0 0 20px rgba(196, 30, 58, 0.3)',
                          '0 0 40px rgba(212, 175, 55, 0.4)',
                          '0 0 20px rgba(196, 30, 58, 0.3)',
                        ],
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <p className="text-4xl md:text-5xl font-bold text-white">
                        {result.receiverName}
                      </p>
                    </motion.div>
                    <p className="text-muted-foreground">
                      🎁 N'oublie pas de garder le secret ! 🤫
                    </p>
                  </motion.div>
                }
                onFlipComplete={() => setRevealed(true)}
              />
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center space-y-8"
            >
              <div className="bg-card/80 backdrop-blur-sm rounded-3xl p-8 shadow-elegant border-2">
                <Sparkles className="w-16 h-16 mx-auto text-accent mb-6" />
                <h2 className="text-2xl font-bold mb-4">
                  Tu dois offrir un cadeau à :
                </h2>
                <motion.div
                  className="bg-gradient-to-r from-primary via-accent to-secondary rounded-2xl p-8 mb-6"
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(196, 30, 58, 0.3)',
                      '0 0 40px rgba(212, 175, 55, 0.4)',
                      '0 0 20px rgba(196, 30, 58, 0.3)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <p className="text-4xl md:text-5xl font-bold text-white">
                    {result.receiverName}
                  </p>
                </motion.div>
                <p className="text-muted-foreground mb-6">
                  🎁 N'oublie pas de garder le secret ! 🤫
                </p>

                <div className="bg-muted/50 rounded-2xl p-6 space-y-3 mb-6">
                  <h3 className="font-semibold">💡 Quelques idées :</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>✨ Pense à ses passions et hobbies</li>
                    <li>🎨 Un cadeau fait main a toujours plus de valeur</li>
                    <li>📝 N'hésite pas à demander discrètement à ses proches</li>
                  </ul>
                </div>

                <Link to="/">
                  <Button variant="festive" size="lg">
                    <Home className="w-5 h-5" />
                    Retour à l'accueil
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Reveal;
