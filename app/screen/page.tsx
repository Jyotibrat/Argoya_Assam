"use client"
import { useState } from "react"
import {
  type LucideIcon,
  Activity,
  Wind,
  Brain,
  Cookie,
  Heart,
  Eye,
  User,
  Utensils,
  Droplets,
  Syringe,
  Sparkles,
} from "lucide-react";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";



type SymptomForm = {
    fatigue:number;
    breathlessness:boolean;
    dizziness:boolean;
    pica:boolean;
    fastHeartbeat:boolean;
    pallor:"none"|"mild"|"severe"
    diet:"rarely"|"sometimes"|"often"|"daily"
    ageGroup: "child" | "teen" | "adult" | "senior";
    heavyBleeding:boolean;
    recentBloodLoss:boolean;
}

type QuestionCardProps = {
  title: string;
  assamese?: string;
  icon: LucideIcon;
  children: ReactNode;
}

function QuestionCard({ title, assamese, icon: Icon, children }: QuestionCardProps) {
  return (
    <div className="group rounded-2xl border border-border bg-card p-6 space-y-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-100 dark:bg-rose-900/30 flex items-center justify-center">
            <Icon className="w-5 h-5 text-rose-600" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-semibold text-foreground text-lg">{title}</h3>
          {assamese && <p className="text-sm text-muted-foreground mt-1">{assamese}</p>}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

function YesNoToggle({ value, onChange }: { value: boolean; onChange: (val: boolean) => void }) {
  return (
    <div className="flex gap-4">
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all duration-200 font-semibold flex items-center justify-center gap-2 ${
          value === true
          ? "border-red-600 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400 shadow-sm"
          : "border-border bg-card text-muted-foreground hover:border-border/80"
        }`}
      >
        Yes
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all duration-200 font-semibold flex items-center justify-center gap-2 ${
          value === false
          ? "border-foreground/60 bg-muted text-foreground shadow-sm"
          : "border-border bg-card text-muted-foreground hover:border-border/80"
        }`}
      >
        No
      </button>
    </div>
  );
}


function calculateRisk(data: SymptomForm) {
  let score = 0;
  score += (data.fatigue - 1) * 4;
  score += data.breathlessness ? 12 : 0;
  score += data.dizziness ? 8 : 0;
  score += data.pica ? 15 : 0;
  score += data.fastHeartbeat ? 8 : 0;
  if (data.pallor === "mild") score += 8;
  if (data.pallor === "severe") score += 20;
  if (data.ageGroup === "child" || data.ageGroup === "senior") score += 8;
  if (data.diet === "rarely") score += 12;
  else if (data.diet === "sometimes") score += 8;
  else if (data.diet === "often") score += 4;
  score += data.heavyBleeding ? 12 : 0;
  score += data.recentBloodLoss ? 12 : 0;

  let risk = "Low";
  if (score >= 60) risk = "High";
  else if (score >= 30) risk = "Medium";
  return { score, risk };
}


export default function ScreenPage(){
    const router = useRouter()
    const[form,setForm]= useState<SymptomForm>({
            fatigue: 1,
            breathlessness: false,
             dizziness: false,
             pica: false,
            fastHeartbeat: false,
            pallor: "none",
            ageGroup: "adult",
             diet: "sometimes",
             heavyBleeding: false,
            recentBloodLoss: false,
    })
    const submitHandler = () => {
    const result = calculateRisk(form);
    router.push(`/result?score=${result.score}&risk=${result.risk}`);
  };
  return (
    <main className="min-h-screen bg-background py-12 px-4">
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-5 mt-10 px-4 py-2 rounded-full bg-card shadow-sm border border-border">
                    <Sparkles className="w-4 h-4 text-rose-500 " />
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Health Assessment</span>
                </div>
                     <h1 className="text-4xl font-black text-foreground">Endemic Screening</h1>
                     <p className="text-muted-foreground">Provide accurate details for a better risk analysis.</p>
            </div>
          
            <QuestionCard title="Age Group" assamese="বয়স গোট" icon={User}>
            <div className="grid grid-cols-2 gap-3">
              {(["child", "teen", "adult", "senior"] satisfies SymptomForm["ageGroup"][]).map((age) => (
                <button
                  key={age}
                  onClick={() => setForm({...form, ageGroup: age})}
                  className={`py-3 rounded-xl border-2 capitalize font-medium transition-all ${
                    form.ageGroup === age ? "border-rose-500 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400" : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  {age}
                </button>
              ))}
            </div>
          </QuestionCard>

          {/* 2. FATIGUE SLIDER */}
          <QuestionCard title="How tired do you feel?" assamese="ভাগৰ কেনেকুৱা লাগে?" icon={Activity}>
            <input 
              type="range" min="1" max="5" value={form.fatigue} 
              onChange={(e) => setForm({...form, fatigue: parseInt(e.target.value)})}
              className="w-full h-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg appearance-none cursor-pointer accent-rose-600"
            />
            <div className="flex justify-between text-xs font-bold text-muted-foreground mt-2">
              <span>FRESH</span>
              <span className="text-rose-600">LEVEL {form.fatigue}</span>
              <span>EXHAUSTED</span>
            </div>
          </QuestionCard>

          {/* 3. BREATHLESSNESS */}
          <QuestionCard title="Breathless during activity?" assamese="উশাহ চুটি হয় নেকি?" icon={Wind}>
            <YesNoToggle value={form.breathlessness} onChange={(val) => setForm({...form, breathlessness: val})} />
          </QuestionCard>

          {/* 4. DIZZINESS */}
          <QuestionCard title="Dizzy or light-headed?" assamese="মূৰ ঘূৰায় নেকি?" icon={Brain}>
            <YesNoToggle value={form.dizziness} onChange={(val) => setForm({...form, dizziness: val})} />
          </QuestionCard>

          {/* 5. PICA */}
          <QuestionCard title="Crave ice, chalk, or mud?" assamese="মাটি বা চক খাবৰ মন যায় নেকি?" icon={Cookie}>
            <YesNoToggle value={form.pica} onChange={(val) => setForm({...form, pica: val})} />
          </QuestionCard>

          {/* 6. HEARTBEAT */}
          <QuestionCard title="Fast heartbeat?" assamese="হৃদস্পন্দন দ্ৰুত নেকি?" icon={Heart}>
            <YesNoToggle value={form.fastHeartbeat} onChange={(val) => setForm({...form, fastHeartbeat: val})} />
          </QuestionCard>

          {/* 7. PALLOR (EYE/LIPS) */}
          <QuestionCard title="Color of Nails/Lips" assamese="নখ বা ওঁঠৰ ৰং" icon={Eye}>
            <div className="flex gap-3">
              {(["none", "mild", "severe"] satisfies SymptomForm["pallor"][]).map((p) => (
                <button
                  key={p}
                  onClick={() => setForm({...form, pallor: p})}
                  className={`flex-1 py-3 rounded-xl border-2 capitalize font-medium transition-all ${
                    form.pallor === p ? "border-rose-500 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400" : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  {p === 'none' ? 'Normal' : p}
                </button>
              ))}
            </div>
          </QuestionCard>

          {/* 8. DIET */}
          <QuestionCard title="Iron-rich food frequency" assamese="আইৰনযুক্ত খাদ্য খোৱাৰ সঘনতা" icon={Utensils}>
            <div className="grid grid-cols-2 gap-3">
              {(["rarely", "sometimes", "often", "daily"] satisfies SymptomForm["diet"][]).map((d) => (
                <button
                  key={d}
                  onClick={() => setForm({...form, diet: d})}
                  className={`py-3 rounded-xl border-2 capitalize font-medium transition-all ${
                    form.diet === d ? "border-rose-500 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400" : "border-border bg-card text-muted-foreground"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </QuestionCard>

          {/* 9. HEAVY BLEEDING */}
          <QuestionCard title="Heavy menstrual bleeding?" assamese="অত্যধিক ঋতুস্ৰাৱ হয় নেকি?" icon={Droplets}>
            <YesNoToggle value={form.heavyBleeding} onChange={(val) => setForm({...form, heavyBleeding: val})} />
          </QuestionCard>

          {/* 10. BLOOD LOSS */}
          <QuestionCard title="Recent injury or blood loss?" assamese="শেহতীয়া আঘাত বা তেজ ওলোৱা?" icon={Syringe}>
            <YesNoToggle value={form.recentBloodLoss} onChange={(val) => setForm({...form, recentBloodLoss: val})} />
          </QuestionCard>
        <button
          onClick={submitHandler}
          className="w-full bg-foreground text-background py-5 rounded-2xl font-black text-xl hover:bg-rose-600 hover:text-white transition-all shadow-xl active:scale-95"
        >
          GET RESULTS →
        </button>
     </div>
     </main>
  );
}
