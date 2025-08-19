import { useState } from "react";
import { InvitationCard } from "@/components/InvitationCard";
import { RSVPForm } from "@/components/RSVPForm";
import { ConfirmationPage } from "@/components/ConfirmationPage";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PartyPopper } from "lucide-react";

type AppState = "invitation" | "rsvp" | "confirmation";

interface ConfirmationData {
  name: string;
  isAttending: boolean;
  qrToken?: string;
}

const Index = () => {
  const [currentView, setCurrentView] = useState<AppState>("invitation");
  const [confirmationData, setConfirmationData] = useState<ConfirmationData | null>(null);

  // Sample invitation details - in a real app, this would come from a database
  const invitationDetails = {
    hostName: "Marie Dubois",
    date: "Samedi 15 juin 2024",
    time: "19h00 - 23h30",
    location: "123 Rue de la Joie, 75001 Paris",
    theme: "Élégant décontracté",
    foodInfo: "Buffet et gâteau d'anniversaire fournis",
    drinkInfo: "Boissons sans alcool et cocktails disponibles",
    parkingInfo: "Parking gratuit disponible dans la cour",
    phone: "06 12 34 56 78",
    email: "marie.dubois@email.com",
    rsvpDeadline: "10 juin 2024",
  };

  const handleRSVPSuccess = (data: ConfirmationData) => {
    setConfirmationData(data);
    setCurrentView("confirmation");
  };

  const handleGoBack = () => {
    setCurrentView("invitation");
    setConfirmationData(null);
  };

  const showRSVPForm = () => {
    setCurrentView("rsvp");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-gradient-celebration text-primary-foreground py-6 shadow-celebration">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <PartyPopper className="h-8 w-8 animate-sparkle" />
            <h1 className="text-3xl font-bold">Invitation Anniversaire</h1>
            <PartyPopper className="h-8 w-8 animate-sparkle" />
          </div>
          <p className="text-primary-foreground/90">Célébrons ensemble cette journée spéciale</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentView === "invitation" && (
          <div className="space-y-8">
            <InvitationCard details={invitationDetails} />
            
            <Separator className="my-8" />
            
            <div className="text-center">
              <Button 
                onClick={showRSVPForm}
                size="lg"
                className="bg-gradient-celebration hover:opacity-90 text-primary-foreground font-semibold px-8 py-4 text-lg transition-all duration-300 transform hover:scale-105 shadow-celebration"
              >
                Répondre à l'invitation
              </Button>
            </div>
          </div>
        )}

        {currentView === "rsvp" && (
          <div className="space-y-6">
            <div className="text-center">
              <Button 
                onClick={handleGoBack}
                variant="outline"
                className="mb-6"
              >
                ← Retour à l'invitation
              </Button>
            </div>
            <RSVPForm onSubmitSuccess={handleRSVPSuccess} />
          </div>
        )}

        {currentView === "confirmation" && confirmationData && (
          <ConfirmationPage
            name={confirmationData.name}
            isAttending={confirmationData.isAttending}
            qrToken={confirmationData.qrToken}
            onGoBack={handleGoBack}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-muted/30 py-6 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground text-sm">
            Invitation créée avec ❤️ • Merci de confirmer votre présence
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
