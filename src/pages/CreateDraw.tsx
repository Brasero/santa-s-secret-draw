import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, X, Users, Heart } from 'lucide-react';
import { nanoid } from 'nanoid';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Snowfall } from '@/components/Snowfall';
import { Participant, Couple, Draw } from '@/types/draw';
import { generateDrawCode, generateAssignments, saveDraw } from '@/utils/drawLogic';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const CreateDraw = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [organizerName, setOrganizerName] = useState('');
  const [drawName, setDrawName] = useState('');
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newParticipantName, setNewParticipantName] = useState('');
  const [enableCouples, setEnableCouples] = useState(false);
  const [couples, setCouples] = useState<Couple[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addParticipant = () => {
    if (newParticipantName.trim()) {
      const newParticipant: Participant = {
        id: nanoid(),
        name: newParticipantName.trim(),
      };
      setParticipants([...participants, newParticipant]);
      setNewParticipantName('');
    }
  };

  const removeParticipant = (id: string) => {
    setParticipants(participants.filter(p => p.id !== id));
    // Remove couples involving this participant
    setCouples(couples.filter(c => c.person1Id !== id && c.person2Id !== id));
  };

  const addCouple = (person1Id: string, person2Id: string) => {
    if (person1Id && person2Id && person1Id !== person2Id) {
      const existingCouple = couples.find(
        c =>
          (c.person1Id === person1Id && c.person2Id === person2Id) ||
          (c.person1Id === person2Id && c.person2Id === person1Id)
      );

      if (!existingCouple) {
        setCouples([...couples, { person1Id, person2Id }]);
      }
    }
  };

  const removeCouple = (index: number) => {
    setCouples(couples.filter((_, i) => i !== index));
  };

  const createDraw = () => {
    // Validation
    if (!organizerName.trim()) {
      toast({
        title: 'Erreur',
        description: 'Veuillez entrer le nom de l\'organisateur',
        variant: 'destructive',
      });
      return;
    }

    if (!drawName.trim()) {
      toast({
        title: 'Erreur',
        description: 'Veuillez entrer le nom du tirage',
        variant: 'destructive',
      });
      return;
    }

    if (participants.length < 3) {
      toast({
        title: 'Erreur',
        description: 'Il faut au moins 3 participants',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    // Generate assignments
    const assignments = generateAssignments(
      participants,
      enableCouples ? couples : []
    );

    if (!assignments) {
      toast({
        title: 'Erreur',
        description: 'Impossible de générer un tirage valide avec ces contraintes. Essayez avec moins de couples.',
        variant: 'destructive',
      });
      setIsLoading(false);
      return;
    }

    // Create draw object
    const draw: Draw = {
      id: nanoid(),
      code: generateDrawCode(),
      organizerName: organizerName.trim(),
      drawName: drawName.trim(),
      participants,
      couples: enableCouples ? couples : [],
      assignments,
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    saveDraw(draw);

    // Navigate to share page
    navigate(`/share/${draw.code}`);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Snowfall />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Créer un tirage
            </h1>
            <p className="text-muted-foreground">Organisez votre Secret Santa en quelques étapes</p>
          </div>

          <Card className="p-6 md:p-8 bg-card/80 backdrop-blur-sm shadow-elegant border-2">
            <div className="space-y-6">
              {/* Organizer Info */}
              <div className="space-y-4">
                <div>
                  <Label htmlFor="organizer">Votre nom (organisateur)</Label>
                  <Input
                    id="organizer"
                    value={organizerName}
                    onChange={(e) => setOrganizerName(e.target.value)}
                    placeholder="Ex: Marie"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="drawName">Nom du tirage</Label>
                  <Input
                    id="drawName"
                    value={drawName}
                    onChange={(e) => setDrawName(e.target.value)}
                    placeholder="Ex: Noël en famille 2024"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Participants */}
              <div>
                <Label className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5" />
                  Participants ({participants.length})
                </Label>

                <div className="flex gap-2 mb-4">
                  <Input
                    value={newParticipantName}
                    onChange={(e) => setNewParticipantName(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
                    placeholder="Nom du participant"
                  />
                  <Button onClick={addParticipant} size="icon" variant="secondary">
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-2">
                  {participants.map((participant) => (
                    <motion.div
                      key={participant.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      className="flex items-center justify-between bg-muted/50 rounded-xl p-3"
                    >
                      <span className="font-medium">{participant.name}</span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeParticipant(participant.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Couples Option */}
              {participants.length >= 2 && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="couples"
                      checked={enableCouples}
                      onCheckedChange={(checked) => setEnableCouples(checked as boolean)}
                    />
                    <Label htmlFor="couples" className="flex items-center gap-2 cursor-pointer">
                      <Heart className="w-5 h-5 text-primary" />
                      Activer la règle des couples
                    </Label>
                  </div>

                  {enableCouples && (
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Les personnes en couple ne se tireront pas entre elles
                      </p>

                      <div className="flex gap-2">
                        <select
                          id="person1"
                          className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2"
                        >
                          <option value="">Personne 1</option>
                          {participants.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                        <select
                          id="person2"
                          className="flex h-10 w-full rounded-xl border border-input bg-background px-3 py-2"
                        >
                          <option value="">Personne 2</option>
                          {participants.map(p => (
                            <option key={p.id} value={p.id}>{p.name}</option>
                          ))}
                        </select>
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={() => {
                            const person1 = (document.getElementById('person1') as HTMLSelectElement).value;
                            const person2 = (document.getElementById('person2') as HTMLSelectElement).value;
                            addCouple(person1, person2);
                          }}
                        >
                          <Plus className="w-5 h-5" />
                        </Button>
                      </div>

                      {couples.map((couple, index) => {
                        const person1 = participants.find(p => p.id === couple.person1Id);
                        const person2 = participants.find(p => p.id === couple.person2Id);
                        return (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center justify-between bg-primary/10 rounded-xl p-3"
                          >
                            <span className="font-medium flex items-center gap-2">
                              <Heart className="w-4 h-4 text-primary" />
                              {person1?.name} ↔ {person2?.name}
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeCouple(index)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* Create Button */}
              <Button
                onClick={createDraw}
                disabled={isLoading}
                variant="festive"
                size="lg"
                className="w-full"
              >
                {isLoading ? 'Création...' : 'Créer le tirage 🎁'}
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default CreateDraw;
