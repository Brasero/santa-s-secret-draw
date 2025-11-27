import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Gift, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Snowfall } from '@/components/Snowfall';
import { decodeDrawFromUrl } from '@/utils/drawLogic';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import { Draw } from '@/types/draw';

const AccessDraw = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { encodedDraw } = useParams<{ encodedDraw: string }>();
  
  const [draw, setDraw] = useState<Draw | null>(null);
  const [participantName, setParticipantName] = useState('');

  useEffect(() => {
    if (encodedDraw) {
      const decodedDraw = decodeDrawFromUrl(encodedDraw);
      if (decodedDraw) {
        setDraw(decodedDraw);
      } else {
        toast({
          title: 'Lien invalide',
          description: 'Le lien du tirage est invalide ou corrompu',
          variant: 'destructive',
        });
      }
    }
  }, [encodedDraw]);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!participantName.trim()) {
      toast({
        title: 'Nom requis',
        description: 'Veuillez saisir votre nom',
        variant: 'destructive',
      });
      return;
    }

    if (!draw) {
      toast({
        title: 'Erreur',
        description: 'Tirage introuvable',
        variant: 'destructive',
      });
      return;
    }

    const participant = draw.participants.find(
      p => p.name.toLowerCase() === participantName.trim().toLowerCase()
    );

    if (!participant) {
      toast({
        title: 'Nom introuvable',
        description: 'Ce nom ne figure pas dans la liste des participants',
        variant: 'destructive',
      });
      return;
    }

    // Navigate to reveal page
    navigate(`/reveal/${encodedDraw}/${participant.id}`);
  };

  return (
    <div className="min-h-screen relative bg-primary overflow-hidden">
      <Snowfall />

      <div className="relative z-10 container mx-auto px-4 py-12 max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="inline-block mb-4"
            >
              <Gift className="w-16 h-16 text-primary-foreground" />
            </motion.div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary-foreground to-accent bg-clip-text text-transparent">
              Accéder au tirage
            </h1>
            <p className="text-primary-foreground/60">
              Sélectionnez votre nom
            </p>
          </div>

          {!draw ? (
            <Card className="p-8 bg-card/80 backdrop-blur-sm shadow-elegant border-2">
              <p className="text-center text-muted-foreground">Chargement du tirage...</p>
            </Card>
          ) : (
            <Card className="p-8 bg-card/80 backdrop-blur-sm shadow-elegant border-2">
              <form onSubmit={handleNameSubmit} className="space-y-6">
                <div className="text-center space-y-2 mb-6">
                  <h2 className="text-xl font-bold">{draw.drawName}</h2>
                  <p className="text-sm text-muted-foreground">
                    Organisé par {draw.organizerName}
                  </p>
                </div>

                <div>
                  <Label htmlFor="name" className="text-base">Votre nom</Label>
                  <Input
                    id="name"
                    value={participantName}
                    onChange={(e) => setParticipantName(e.target.value)}
                    placeholder="Entrez votre nom"
                    className="mt-2"
                    autoFocus
                    list="participant-names"
                    disabled
                  />
                  <datalist id="participant-names">
                    {draw.participants.map((participant, index) => (
                      <option key={index} value={participant.name} />
                    ))}
                  </datalist>
                  <p className="text-sm text-muted-foreground mt-2">
                    Choisissez votre nom dans la liste
                  </p>
                </div>

                <div className="bg-muted/50 rounded-2xl p-4">
                  <p className="text-sm font-medium mb-2">Participants :</p>
                  <div className="flex flex-wrap gap-2">
                    {draw.participants.map((participant, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setParticipantName(participant.name)}
                        className="px-3 py-1 bg-primary/10 hover:bg-primary/20 rounded-xl text-sm font-medium transition-smooth"
                      >
                        {participant.name}
                      </button>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  variant="festive"
                  size="lg"
                  className="w-full"
                  disabled={!participantName}
                >
                  Découvrir 🎁
                </Button>
              </form>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AccessDraw;