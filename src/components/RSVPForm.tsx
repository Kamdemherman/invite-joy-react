import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Heart, Users, Utensils } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const rsvpSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  phone: z.string().optional(),
  isAttending: z.enum(["true", "false"], {
    required_error: "Veuillez confirmer votre présence",
  }),
  guestCount: z.string().min(1, "Veuillez indiquer le nombre d'invités"),
  dietaryRestrictions: z.string().optional(),
  message: z.string().optional(),
});

type RSVPFormData = z.infer<typeof rsvpSchema>;

interface RSVPFormProps {
  onSubmitSuccess: (data: { name: string; isAttending: boolean; qrToken?: string }) => void;
}

export function RSVPForm({ onSubmitSuccess }: RSVPFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RSVPFormData>({
    resolver: zodResolver(rsvpSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      guestCount: "1",
      dietaryRestrictions: "",
      message: "",
    },
  });

  const onSubmit = async (data: RSVPFormData) => {
    setIsSubmitting(true);
    
    try {
      const isAttending = data.isAttending === "true";
      
      const { data: rsvpData, error } = await supabase
        .from("rsvp_responses")
        .insert({
          name: data.name,
          email: data.email || null,
          phone: data.phone || null,
          guest_count: parseInt(data.guestCount),
          is_attending: isAttending,
          dietary_restrictions: data.dietaryRestrictions || null,
          message: data.message || null,
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast.success("Réponse enregistrée avec succès !");
      
      onSubmitSuccess({
        name: data.name,
        isAttending,
        qrToken: rsvpData.qr_code_token,
      });
      
    } catch (error) {
      console.error("Error submitting RSVP:", error);
      toast.error("Erreur lors de l'enregistrement. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAttending = form.watch("isAttending");

  return (
    <Card className="max-w-lg mx-auto p-6 bg-gradient-card shadow-card border-border/50">
      <div className="text-center mb-6">
        <Heart className="h-8 w-8 mx-auto mb-3 text-primary animate-sparkle" />
        <h2 className="text-2xl font-bold text-foreground mb-2">Confirmation de présence</h2>
        <p className="text-muted-foreground">Merci de remplir ce formulaire</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom complet *</FormLabel>
                <FormControl>
                  <Input placeholder="Votre nom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="votre@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Téléphone</FormLabel>
                  <FormControl>
                    <Input placeholder="06 XX XX XX XX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="isAttending"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirmez-vous votre présence ? *</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="grid grid-cols-2 gap-4"
                  >
                    <div className="flex items-center space-x-2 p-3 rounded-lg border border-primary/20 hover:bg-primary/5 transition-colors">
                      <RadioGroupItem value="true" id="attending-yes" />
                      <Label htmlFor="attending-yes" className="flex-1 cursor-pointer">
                        Oui, je serai présent(e) ✨
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-muted/30 transition-colors">
                      <RadioGroupItem value="false" id="attending-no" />
                      <Label htmlFor="attending-no" className="flex-1 cursor-pointer">
                        Non, je ne peux pas venir
                      </Label>
                    </div>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {isAttending === "true" && (
            <>
              <FormField
                control={form.control}
                name="guestCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Nombre de personnes *
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez le nombre" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? "personne" : "personnes"}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dietaryRestrictions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Utensils className="h-4 w-4" />
                      Allergies / Régimes spéciaux
                    </FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Végétarien, sans gluten, allergies..." 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Message (optionnel)</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Un petit mot pour l'hôte..." 
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full bg-gradient-celebration hover:opacity-90 text-primary-foreground font-semibold py-3 transition-all duration-300 transform hover:scale-105"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Envoi en cours..." : "Confirmer ma réponse"}
          </Button>
        </form>
      </Form>
    </Card>
  );
}