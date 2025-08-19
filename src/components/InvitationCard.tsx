import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, Phone, Mail } from "lucide-react";
import heroImage from "@/assets/birthday-hero.jpg";

interface InvitationDetails {
  hostName: string;
  date: string;
  time: string;
  location: string;
  theme?: string;
  foodInfo: string;
  drinkInfo: string;
  parkingInfo?: string;
  phone: string;
  email: string;
  rsvpDeadline: string;
}

interface InvitationCardProps {
  details: InvitationDetails;
}

export function InvitationCard({ details }: InvitationCardProps) {
  return (
    <Card className="max-w-2xl mx-auto overflow-hidden bg-gradient-card shadow-celebration border-border/50">
      {/* Hero Image */}
      <div className="relative h-64 overflow-hidden">
        <img 
          src={heroImage} 
          alt="Birthday celebration" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
        <div className="absolute bottom-4 left-6 right-6">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg animate-float">
            Vous êtes invité(e) à célébrer mon anniversaire !
          </h1>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Main Details */}
        <div className="grid gap-4">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
            <Calendar className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium text-foreground">Date</p>
              <p className="text-sm text-muted-foreground">{details.date}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
            <Clock className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium text-foreground">Heure</p>
              <p className="text-sm text-muted-foreground">{details.time}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <p className="font-medium text-foreground">Lieu</p>
              <p className="text-sm text-muted-foreground">{details.location}</p>
            </div>
          </div>

          {details.theme && (
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-sm">
                Thème : {details.theme}
              </Badge>
            </div>
          )}
        </div>

        {/* Additional Details */}
        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="font-semibold text-lg text-foreground">Détails supplémentaires</h3>
          
          <div className="grid gap-3 text-sm">
            <div>
              <span className="font-medium text-foreground">Repas :</span>
              <span className="ml-2 text-muted-foreground">{details.foodInfo}</span>
            </div>
            
            <div>
              <span className="font-medium text-foreground">Boissons :</span>
              <span className="ml-2 text-muted-foreground">{details.drinkInfo}</span>
            </div>
            
            {details.parkingInfo && (
              <div>
                <span className="font-medium text-foreground">Parking :</span>
                <span className="ml-2 text-muted-foreground">{details.parkingInfo}</span>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-3 pt-4 border-t border-border">
          <h3 className="font-semibold text-lg text-foreground">Contact d'urgence</h3>
          <div className="flex flex-col gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">{details.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">{details.email}</span>
            </div>
          </div>
        </div>

        {/* RSVP Notice */}
        <div className="bg-gradient-celebration rounded-lg p-4 text-center animate-sparkle">
          <Users className="h-6 w-6 mx-auto mb-2 text-primary-foreground" />
          <h3 className="font-bold text-primary-foreground mb-1">Confirmation obligatoire</h3>
          <p className="text-sm text-primary-foreground/90">
            Merci de confirmer votre présence avant le <strong>{details.rsvpDeadline}</strong>
          </p>
        </div>

        <div className="text-center pt-4">
          <p className="text-lg font-medium text-foreground">
            J'ai hâte de célébrer cette journée spéciale avec vous !
          </p>
          <p className="text-sm text-muted-foreground mt-2">— {details.hostName}</p>
        </div>
      </div>
    </Card>
  );
}