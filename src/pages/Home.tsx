import { Link } from 'react-router-dom';
import { Gift, Users, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Snowfall } from '@/components/Snowfall';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <Snowfall />
      
      <div className="relative z-10 container mx-auto px-4 py-12">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Hero Section */}
          <motion.div
            className="mb-8"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Gift className="w-20 h-20 mx-auto text-primary mb-4" />
          </motion.div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Secret Santa
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Organisez votre tirage au sort de Noël en quelques clics.
            Simple, gratuit et magique ! ✨
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/create">
              <Button variant="festive" size="lg" className="w-full sm:w-auto">
                <Sparkles className="w-5 h-5" />
                Créer un tirage
              </Button>
            </Link>
            
            <Link to="/access">
              <Button variant="golden" size="lg" className="w-full sm:w-auto">
                <Gift className="w-5 h-5" />
                Accéder à un tirage
              </Button>
            </Link>
          </div>

          {/* Features */}
          <motion.div
            className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-elegant border border-border">
              <Users className="w-10 h-10 mx-auto mb-4 text-primary" />
              <h3 className="font-semibold text-lg mb-2">Facile</h3>
              <p className="text-sm text-muted-foreground">
                Ajoutez vos participants en quelques secondes
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-elegant border border-border">
              <Gift className="w-10 h-10 mx-auto mb-4 text-secondary" />
              <h3 className="font-semibold text-lg mb-2">Intelligent</h3>
              <p className="text-sm text-muted-foreground">
                Gérez les couples automatiquement
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm rounded-3xl p-6 shadow-elegant border border-border">
              <Sparkles className="w-10 h-10 mx-auto mb-4 text-accent" />
              <h3 className="font-semibold text-lg mb-2">Magique</h3>
              <p className="text-sm text-muted-foreground">
                Révélation animée pour chaque participant
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
