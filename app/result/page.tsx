"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
	CheckCircle2,
	AlertTriangle,
	AlertCircle,
	Activity,
	ArrowRight,
	Sparkles,
	FileText,
	Stethoscope,
	MapPin,
} from "lucide-react";
import { Suspense } from "react";

function normalizeRisk(value?: string | null) {
	if (!value) {
		return "Unknown";
	}

	return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
}

 function ResultContent() {
	const params = useSearchParams();
	const scoreValue = Number(params.get("score") ?? 0);
	const score = Number.isNaN(scoreValue) ? 0 : scoreValue;
	const risk = normalizeRisk(params.get("risk"));
	const isHighRisk = risk === "High";
	const isMediumRisk = risk === "Medium";
	const isLowRisk = risk === "Low";

	// Determine risk color and icon
	const getRiskConfig = () => {
		if (isHighRisk) {
			return {
				color: "red",
				icon: AlertCircle,
				gradient: "from-red-600 via-rose-600 to-pink-600",
				bgGradient: "from-red-50 via-rose-50 to-pink-50",
				borderColor: "border-red-300",
				textColor: "text-red-700",
				bgColor: "bg-red-50",
			};
		} else if (isMediumRisk) {
			return {
				color: "orange",
				icon: AlertTriangle,
				gradient: "from-orange-600 via-amber-600 to-yellow-600",
				bgGradient: "from-orange-50 via-amber-50 to-yellow-50",
				borderColor: "border-orange-300",
				textColor: "text-orange-700",
				bgColor: "bg-orange-50",
			};
		} else {
			return {
				color: "green",
				icon: CheckCircle2,
				gradient: "from-green-600 via-emerald-600 to-teal-600",
				bgGradient: "from-green-50 via-emerald-50 to-teal-50",
				borderColor: "border-green-300",
				textColor: "text-green-700",
				bgColor: "bg-green-50",
			};
		}
	};

	const config = getRiskConfig();
	const RiskIcon = config.icon;

	return (
		<div className="relative min-h-screen overflow-hidden bg-background">
			{/* Animated background elements */}
			<div className="absolute inset-0 overflow-hidden pointer-events-none">
				<div className="absolute top-20 left-10 w-72 h-72 bg-red-300/10 rounded-full blur-3xl animate-pulse" />
				<div className="absolute bottom-20 right-10 w-96 h-96 bg-rose-300/10 rounded-full blur-3xl animate-pulse delay-1000" />
			</div>

			<div className="relative z-10 mx-auto flex min-h-screen w-full max-w-3xl flex-col justify-center gap-8 px-6 py-16">
				{/* Header */}
				<div className="text-center space-y-3">
					<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card backdrop-blur-sm shadow-md mb-4 border border-border">
						<Sparkles className="w-5 h-5 text-red-600" />
						<span className="text-sm font-semibold text-foreground">
							Screening Complete
						</span>
					</div>
					<h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 bg-clip-text text-transparent">
						Screening Results
					</h1>
					<p className="text-muted-foreground max-w-xl mx-auto">
						Review the automated risk calculation and recommended next steps
					</p>
				</div>

				{/* Main Results Card */}
				<div className="rounded-3xl border border-border bg-card/80 backdrop-blur-sm p-8 shadow-xl space-y-6">
					{/* Score Display */}
					<div className="text-center space-y-4">
						<div className="flex justify-center">
							<div className={`w-20 h-20 rounded-full bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg`}>
								<RiskIcon className="w-10 h-10 text-white" />
							</div>
						</div>

						<div>
							<p className="text-sm font-medium text-muted-foreground mb-2">
								Total Score
							</p>
							<div className="relative inline-block">
								<span className={`text-6xl font-bold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
									{score}
								</span>
								<span className="text-2xl text-muted-foreground ml-1">/100</span>
							</div>
						</div>

						<div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${config.bgColor} border ${config.borderColor}`}>
							<Activity className={`w-5 h-5 ${config.textColor}`} />
							<span className={`text-lg font-semibold ${config.textColor}`}>
								{risk} Risk
							</span>
						</div>
					</div>

					{/* Divider */}
					<div className="border-t border-border" />

					{/* Risk Assessment */}
					{isHighRisk && (
						<div className="rounded-2xl border border-red-300 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-5 space-y-2">
							<div className="flex items-center gap-2">
								<AlertCircle className="w-5 h-5 text-red-600" />
								<span className="font-semibold text-red-800 dark:text-red-400">
									Immediate Care Required
								</span>
							</div>
							<p className="text-sm text-red-700 dark:text-red-300">
								High risk of anemia detected. Please consult a healthcare
								professional or visit a hospital immediately for proper
								diagnosis and treatment.
							</p>
						</div>
					)}

					{isMediumRisk && (
						<div className="rounded-2xl border border-orange-300 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 p-5 space-y-2">
							<div className="flex items-center gap-2">
								<AlertTriangle className="w-5 h-5 text-orange-600" />
								<span className="font-semibold text-orange-800 dark:text-orange-400">
									Medical Consultation Recommended
								</span>
							</div>
							<p className="text-sm text-orange-700 dark:text-orange-300">
								Medium risk detected. Schedule an appointment with a healthcare
								provider for further evaluation and possible lab tests.
							</p>
						</div>
					)}

					{isLowRisk && (
						<div className="rounded-2xl border border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-5 space-y-2">
							<div className="flex items-center gap-2">
								<CheckCircle2 className="w-5 h-5 text-green-600" />
								<span className="font-semibold text-green-800 dark:text-green-400">
									Low Risk of <span className="font-bold">Anemia </span> Detected
								</span>
							</div>
							<p className="text-sm text-green-700 dark:text-green-300">
								Current symptoms suggest low risk of anemia. Continue
								maintaining a healthy diet rich in iron and follow routine
								health check-ups.
							</p>
						</div>
					)}

					{/* Next Actions */}
					<div className="rounded-2xl bg-muted border border-border p-5 space-y-3">
						<div className="flex items-center gap-2">
							<Stethoscope className="w-5 h-5 text-red-600" />
							<span className="font-semibold text-foreground">
								Recommended Next Steps
							</span>
						</div>
						<ul className="space-y-2 text-sm text-muted-foreground">
							<li className="flex items-start gap-2">
								<ArrowRight className="w-4 h-4 mt-0.5 text-red-600 flex-shrink-0" />
								<span>
									Confirm results with clinical judgment and patient history
								</span>
							</li>
							<li className="flex items-start gap-2">
								<ArrowRight className="w-4 h-4 mt-0.5 text-red-600 flex-shrink-0" />
								<span>
									Consider complete blood count (CBC) test for {isHighRisk ? "high" : isMediumRisk ? "medium" : "low"} risk cases
								</span>
							</li>
							<li className="flex items-start gap-2">
								<ArrowRight className="w-4 h-4 mt-0.5 text-red-600 flex-shrink-0" />
								<span>
									Provide dietary guidance on iron-rich foods
								</span>
							</li>
							<li className="flex items-start gap-2">
								<ArrowRight className="w-4 h-4 mt-0.5 text-red-600 flex-shrink-0" />
								<span>
									Schedule follow-up based on risk level and symptoms
								</span>
							</li>
						</ul>
					</div>

					{/* Action Buttons */}
					<div className="flex flex-col gap-3 pt-2">
						<Link
							href="/screen"
							className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 px-6 py-3.5 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
						>
							<Activity className="w-5 h-5" />
							Run Another Screening
						</Link>

						<Link
							href="/hospitals"
							className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 px-6 py-3.5 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
						>
							<MapPin className="w-5 h-5" />
							Find Nearby Hospital
						</Link>

						<button
							onClick={() => window.print()}
							className="w-full inline-flex items-center justify-center gap-2 rounded-full border-2 border-red-600 bg-background px-6 py-3.5 text-red-600 font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-all duration-300"
						>
							<FileText className="w-5 h-5" />
							Print Results
						</button>
					</div>
				</div>

				{/* Disclaimer */}
				<p className="text-xs text-center text-muted-foreground max-w-2xl mx-auto">
					This is an automated screening tool and not a medical diagnosis.
					Results should be confirmed by a qualified healthcare professional
					with appropriate laboratory tests.
				</p>
			</div>
		</div>
	);
}

export default function ResultPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading result...</div>}>
      <ResultContent />
    </Suspense>
  );
}