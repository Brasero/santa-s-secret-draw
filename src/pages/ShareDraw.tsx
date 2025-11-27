import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Check, Share2, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Snowfall } from '@/components/Snowfall';
import { decodeDrawFromUrl, encodeDrawToUrl } from '@/utils/drawLogic';
import { Draw } from '@/types/draw';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

const ShareDraw = () => {
  const { code: encodedDraw } = useParams<{ code: string }>();
  const { toast } = useToast();
  const [draw, setDraw] = useState<Draw | null>(null);
  const [copied, setCopied] = useState(false);
  const isMobile = /iPhone|Android.+Mobile/.test(navigator.userAgent);

  useEffect(() => {
    if (encodedDraw) {
      const decodedDraw = decodeDrawFromUrl(encodedDraw);
      setDraw(decodedDraw);
    }
  }, [encodedDraw]);
  
  
  const shareUrl = encodedDraw ? `${window.location.origin}/santa-s-secret-draw/access/${encodedDraw}` : '';
  
  const share = () => {
    const message = `Rejoins le tirage Secret Santa ${draw?.drawName} ! \n Participe au tirage au sort Secret Santa en utilisant ce lien : \n ${shareUrl}`;
    if (navigator.share) {
      navigator.share({
        title: `Rejoins le tirage Secret Santa ${draw.drawName} !`,
        text: `Participe au tirage au sort Secret Santa en utilisant ce lien : ${shareUrl}`,
        url: shareUrl,
      }).then(() => {
        toast({
          title: 'Partagé avec succès !',
          description: 'Le lien a été partagé via les options de partage de votre appareil.',
        });
      }).catch((error) => {
        toast({
          title: 'Erreur de partage',
          description: `Le partage a échoué : ${error.message}`,
          variant: 'destructive',
        });
      });
    } else {
      window.location.href = `sms:?&body=${encodeURIComponent(message)}`;
    }
  }

  const copyUrl = () => {
    setCopied(true);
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: 'Lien copié !',
      description: 'Le lien a été copié dans le presse-papier',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  if (!draw) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-muted-foreground">Tirage non trouvé</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-primary">
      <Snowfall />

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-2xl">
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
              <Share2 className="w-16 h-16 text-primary" />
            </motion.div>
            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary-foreground to-accent bg-clip-text text-transparent">
              Tirage créé avec succès ! 🎉
            </h1>
            <p className="text-primary-foreground">Partagez le code avec vos participants</p>
          </div>

          <Card className="p-8 bg-card/80 backdrop-blur-sm shadow-elegant border-2 space-y-8">
            {/* Draw Info */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold">{draw.drawName}</h2>
              <p className="text-muted-foreground">
                Organisé par {draw.organizerName} • {draw.participants.length} participants
              </p>
            </div>

            {/* Code Display */}
            <motion.div
              className="bg-gradient-to-br from-primary to-primary-glow rounded-3xl p-8 text-center shadow-festive"
              whileHover={{scale: 1.02}}
              transition={{type: 'spring', stiffness: 300}}
            >
              <p className="text-primary-foreground/80 text-sm font-medium mb-2">
                LIEN DU TIRAGE
              </p>
              <div className="space-y-2">
                <Label className="text-sm font-medium">Lien direct</Label>
                <div className="flex flex-col gap-2">
                  <Input
                    value={shareUrl}
                    onClick={copyUrl}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    onClick={copyUrl}
                    variant="secondary"
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-primary-foreground border-2 border-white/30"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4"/>
                        Copié !
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4"/>
                        Copier le lien
                      </>
                    )}
                  </Button>
                  {
                    isMobile && (
                      <Button size="sm" onClick={share}>
                        📱 Envoyer par SMS
                      </Button>
                    )
                  }
                </div>
              </div>
            </motion.div>
            {/* Share URL */}
            
            
            {/* Instructions */}
            <div className="bg-muted/50 rounded-2xl p-6 space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                📱 Comment faire ?
              </h3>
              <ol className="space-y-2 text-sm text-muted-foreground list-decimal list-inside">
                <li>Partagez le lien avec tous les participants</li>
                <li className={"text-primary"}>Attention, en quittant la page le lien sera définitivement perdu, assurer vous de l&apos;avoir enregistré ou partagé avant de quitter la page. </li>
                <li>Chaque personne accède au tirage avec le code</li>
                <li>Elle saisit son nom et découvre son Secret Santa !</li>
              </ol>
            </div>

            {/* Actions */}
            <div className="flex gap-3 flex-col sm:flex-row">
              <Link to="/" className="flex-1">
                <Button variant="outline" className="w-full">
                  <Home className="w-4 h-4" />
                  Retour à l'accueil
                </Button>
              </Link>
              <Link to="/create" className="flex-1">
                <Button variant="golden" className="w-full">
                  Créer un nouveau tirage
                </Button>
              </Link>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};


export default ShareDraw;