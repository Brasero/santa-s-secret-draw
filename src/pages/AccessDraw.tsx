import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Gift, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Snowfall } from '@/components/Snowfall';
import { getDrawByCode } from '@/utils/drawLogic';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const AccessDraw = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  
  const [code, setCode] = useState(searchParams.get('code') || '');
  const [participantName, setParticipantName] = useState('');
  const [availableNames, setAvailableNames] = useState<string[]>([]);
  const [step, setStep] = useState<'code' | 'name'>('code');

  useEffect(() => {
    if (searchParams.get('code')) {
      validateCode(searchParams.get('code')!);
    }
  }, []);

  const validateCode = (inputCode: string) => {
    const draw = getDrawByCode(inputCode);
    if (draw) {
      setAvailableNames(draw.participants.map(p => p.name));
      setStep('name');
    } else {
      toast({
        title: 'Code invalide',
        description: 'Aucun tirage ne correspond à ce code',
        variant: 'destructive',
      });
    }
  };

  const handleCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code.trim().length === 6) {
      validateCode(code.toUpperCase());
    } else {
      toast({
        title: 'Code invalide',
        description: 'Le code doit contenir 6 caractères',
        variant: 'destructive',
      });
    }
  };

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

    const draw = getDrawByCode(code);
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
    navigate(`/reveal/${code}/${participant.id}`);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
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
              <Gift className="w-16 h-16 text-primary" />
            </motion.div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Accéder au tirage
            </h1>
            <p className="text-muted-foreground">
              {step === 'code' ? 'Entrez votre code' : 'Sélectionnez votre nom'}
            </p>
          </div>

          <Card className="p-8 bg-card/80 backdrop-blur-sm shadow-elegant border-2">
            {step === 'code' ? (
              <form onSubmit={handleCodeSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="code" className="text-base">Code du tirage</Label>
                  <Input
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="ABC123"
                    maxLength={6}
                    className="mt-2 text-center text-2xl font-bold tracking-wider"
                    autoFocus
                  />
                  <p className="text-sm text-muted-foreground mt-2">
                    Code de 6 caractères fourni par l'organisateur
                  </p>
                </div>

                <Button
                  type="submit"
                  variant="festive"
                  size="lg"
                  className="w-full"
                  disabled={code.length !== 6}
                >
                  Continuer
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </form>
            ) : (
              <form onSubmit={handleNameSubmit} className="space-y-6">
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
                  />
                  <datalist id="participant-names">
                    {availableNames.map((name, index) => (
                      <option key={index} value={name} />
                    ))}
                  </datalist>
                  <p className="text-sm text-muted-foreground mt-2">
                    Choisissez votre nom dans la liste
                  </p>
                </div>

                <div className="bg-muted/50 rounded-2xl p-4">
                  <p className="text-sm font-medium mb-2">Participants :</p>
                  <div className="flex flex-wrap gap-2">
                    {availableNames.map((name, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setParticipantName(name)}
                        className="px-3 py-1 bg-primary/10 hover:bg-primary/20 rounded-xl text-sm font-medium transition-smooth"
                      >
                        {name}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 flex-col sm:flex-row">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep('code')}
                    className="flex-1"
                  >
                    Retour
                  </Button>
                  <Button
                    type="submit"
                    variant="festive"
                    className="flex-1"
                    disabled={!participantName}
                  >
                    Découvrir 🎁
                  </Button>
                </div>
              </form>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default AccessDraw;