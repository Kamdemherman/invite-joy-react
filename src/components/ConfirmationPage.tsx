import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, QrCode, Heart, ArrowLeft } from "lucide-react";
import QRCode from "qrcode";

interface ConfirmationPageProps {
  name: string;
  isAttending: boolean;
  qrToken?: string;
  onGoBack: () => void;
}

export function ConfirmationPage({ name, isAttending, qrToken, onGoBack }: ConfirmationPageProps) {
  const [qrCodeDataURL, setQrCodeDataURL] = useState<string>("");

  useEffect(() => {
    if (isAttending && qrToken) {
      // Generate QR code with attendance token
      QRCode.toDataURL(
        `RSVP-${qrToken}`,
        {
          width: 200,
          color: {
            dark: "#B45309", // Primary color
            light: "#FFFEF7", // Background color
          },
          errorCorrectionLevel: "M",
        }
      )
        .then((url) => setQrCodeDataURL(url))
        .catch((err) => console.error("Error generating QR code:", err));
    }
  }, [isAttending, qrToken]);

  const getPersonalizedMessage = () => {
    if (isAttending) {
      return {
        title: "Merci pour votre confirmation ! 🎉",
        message: `Cher/Chère ${name}, nous sommes ravis que vous puissiez nous rejoindre pour cette célébration spéciale ! Votre présence rendra cette journée encore plus mémorable.`,
        submessage: "Conservez votre QR code ci-dessous - il vous servira d'invitation le jour J.",
      };
    } else {
      return {
        title: "Merci pour votre réponse 💙",
        message: `Cher/Chère ${name}, nous comprenons que vous ne puissiez pas être des nôtres. Nous vous remercions d'avoir pris le temps de nous le faire savoir.`,
        submessage: "Nous espérons vous voir lors d'une prochaine occasion !",
      };
    }
  };

  const { title, message, submessage } = getPersonalizedMessage();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="p-8 bg-gradient-card shadow-celebration border-border/50 text-center">
        <div className="mb-6">
          {isAttending ? (
            <CheckCircle className="h-16 w-16 mx-auto text-primary animate-sparkle" />
          ) : (
            <XCircle className="h-16 w-16 mx-auto text-muted-foreground" />
          )}
        </div>

        <h1 className="text-3xl font-bold text-foreground mb-4">{title}</h1>
        
        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
          {message}
        </p>

        {isAttending && (
          <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium">
            ✨ Confirmation validée ✨
          </Badge>
        )}

        <p className="text-muted-foreground mb-8">
          {submessage}
        </p>

        {isAttending && qrCodeDataURL && (
          <div className="bg-background rounded-lg p-6 border border-border/50 inline-block">
            <div className="mb-4">
              <QrCode className="h-6 w-6 mx-auto text-primary mb-2" />
              <h3 className="font-semibold text-foreground">Votre QR Code d'invitation</h3>
              <p className="text-sm text-muted-foreground">À présenter le jour de l'événement</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-inner">
              <img 
                src={qrCodeDataURL} 
                alt="QR Code d'invitation" 
                className="mx-auto"
                width={200}
                height={200}
              />
            </div>
            
            <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/10">
              <p className="text-xs text-muted-foreground">
                💡 Conseil : Sauvegardez cette image ou prenez une capture d'écran
              </p>
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-border">
          <Heart className="h-6 w-6 mx-auto mb-3 text-primary" />
          <p className="text-sm text-muted-foreground italic">
            "Les meilleurs moments sont ceux partagés avec les personnes qu'on aime"
          </p>
        </div>
      </Card>

      <div className="text-center">
        <Button 
          onClick={onGoBack}
          variant="outline"
          className="hover:bg-primary/5 hover:border-primary/20 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à l'invitation
        </Button>
      </div>
    </div>
  );
}