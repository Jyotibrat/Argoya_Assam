"use client"
import { useState,useEffect } from "react"
import {
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




function QuestionCard({ title, assamese, icon: Icon, children }: any) {
  return (
    <div className="group rounded-2xl border border-slate-200 bg-white p-6 space-y-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start gap-3">
        {Icon && (
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
            <Icon className="w-5 h-5 text-rose-600" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 text-lg">{title}</h3>
          {assamese && <p className="text-sm text-slate-500 mt-1">{assamese}</p>}
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
          ? "border-red-600 bg-red-50 text-red-700 shadow-sm" 
          : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
        }`}
      >
        Yes
      </button>
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all duration-200 font-semibold flex items-center justify-center gap-2 ${
          value === false 
          ? "border-slate-600 bg-slate-100 text-slate-800 shadow-sm" 
          : "border-slate-100 bg-white text-slate-500 hover:border-slate-200"
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
    <main className="min-h-screen bg-slate-50 py-12 px-4">
        <div className="max-w-2xl mx-auto space-y-8">
            <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-5 mt-10 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-100">
                    <Sparkles className="w-4 h-4 text-rose-500 " />
                    <span className="text-xs font-bold uppercase tracking-wider  text-slate-600">Health Assessment</span>
                </div>
                     <h1 className="text-4xl font-black text-slate-900">Endemic Screening</h1>
                     <p className="text-slate-500">Provide accurate details for a better risk analysis.</p>
            </div>
          
        </div>

    </main>
  )
}


  