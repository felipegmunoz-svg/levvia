import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import type { UserProfile } from "@/lib/profileEngine";
import { Loader2 } from "lucide-react";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profile: UserProfile;
  onSaved: () => void;
}

const activityOptions = [
  "Sedentária (pouco ou nenhum exercício)",
  "Leve (caminhadas leves, 1-2x por semana)",
  "Moderado (exercícios regulares, 3-4x por semana)",
  "Ativo (exercícios intensos, 5+ vezes por semana)",
];

const painOptions = ["Sem dor", "Dor leve", "Dor moderada", "Dor intensa", "Dor muito intensa"];

const objectiveOptions = [
  "Reduzir a dor e o desconforto",
  "Melhorar a mobilidade",
  "Controlar o inchaço",
  "Adotar alimentação anti-inflamatória",
  "Criar uma rotina de exercícios",
  "Melhorar o bem-estar emocional",
];

const sexOptions = ["Feminino", "Masculino", "Prefiro não informar"];

const healthConditionOptions = [
  "Lipedema diagnosticado",
  "Linfedema",
  "Problemas circulatórios",
  "Artrite ou artrose",
  "Fibromialgia",
  "Diabetes",
  "Hipertensão",
  "Hipotireoidismo",
];

const affectedAreaOptions = ["Coxas", "Quadris", "Panturrilhas", "Braços", "Tornozelos", "Joelhos"];

function ToggleChips({ options, selected, onChange }: { options: string[]; selected: string[]; onChange: (v: string[]) => void }) {
  const toggle = (opt: string) => {
    onChange(selected.includes(opt) ? selected.filter((s) => s !== opt) : [...selected, opt]);
  };
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => toggle(opt)}
          className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
            selected.includes(opt)
              ? "bg-secondary text-foreground border-secondary"
              : "bg-white/[0.06] text-muted-foreground border-white/10 hover:border-white/20"
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

export default function EditProfileDialog({ open, onOpenChange, profile, onSaved }: EditProfileDialogProps) {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState(profile.name);
  const [age, setAge] = useState(profile.age?.toString() || "");
  const [sex, setSex] = useState(profile.sex);
  const [weightKg, setWeightKg] = useState(profile.weightKg?.toString() || "");
  const [heightCm, setHeightCm] = useState(profile.heightCm?.toString() || "");
  const [activityLevel, setActivityLevel] = useState(profile.activityLevel);
  const [painLevel, setPainLevel] = useState(profile.painLevel);
  const [objectives, setObjectives] = useState<string[]>(profile.objectives || []);
  const [healthConditions, setHealthConditions] = useState<string[]>(profile.healthConditions || []);
  const [affectedAreas, setAffectedAreas] = useState<string[]>(profile.affectedAreas || []);

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);

    const updates = {
      name: name.trim().slice(0, 100),
      age: age ? Math.min(Math.max(parseInt(age) || 0, 12), 120) : null,
      sex,
      weight_kg: weightKg ? parseFloat(weightKg) || null : null,
      height_cm: heightCm ? parseFloat(heightCm) || null : null,
      activity_level: activityLevel,
      pain_level: painLevel,
      objective,
      health_conditions: healthConditions,
      affected_areas: affectedAreas,
    };

    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", user.id);

    setSaving(false);

    if (error) {
      toast({ title: "Erro ao salvar", description: "Tente novamente.", variant: "destructive" });
      return;
    }

    toast({ title: "Perfil atualizado! ✨" });
    onSaved();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-foreground">Editar Dados Pessoais</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Name */}
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs">Nome</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} maxLength={100} />
          </div>

          {/* Age + Sex row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs">Idade</Label>
              <Input type="number" value={age} onChange={(e) => setAge(e.target.value)} min={12} max={120} placeholder="Ex: 35" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs">Sexo</Label>
              <Select value={sex} onValueChange={setSex}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {sexOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Weight + Height row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs">Peso (kg)</Label>
              <Input type="number" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} placeholder="Ex: 70" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-muted-foreground text-xs">Altura (cm)</Label>
              <Input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} placeholder="Ex: 165" />
            </div>
          </div>

          {/* Activity Level */}
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs">Nível de atividade</Label>
            <Select value={activityLevel} onValueChange={setActivityLevel}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {activityOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Pain Level */}
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs">Nível de dor</Label>
            <Select value={painLevel} onValueChange={setPainLevel}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {painOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Objective */}
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs">Objetivo principal</Label>
            <Select value={objective} onValueChange={setObjective}>
              <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                {objectiveOptions.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          {/* Health Conditions */}
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs">Condições de saúde</Label>
            <ToggleChips options={healthConditionOptions} selected={healthConditions} onChange={setHealthConditions} />
          </div>

          {/* Affected Areas */}
          <div className="space-y-1.5">
            <Label className="text-muted-foreground text-xs">Áreas afetadas</Label>
            <ToggleChips options={affectedAreaOptions} selected={affectedAreas} onChange={setAffectedAreas} />
          </div>

          <Button onClick={handleSave} disabled={saving || !name.trim()} className="w-full mt-2">
            {saving ? <><Loader2 className="animate-spin mr-2" size={16} /> Salvando...</> : "Salvar alterações"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
