"use client";

import React from "react";
import { Container, Section, H1, P } from "@/components/shared/design-system";
import { Button } from "@/components/shared/button";
import { Lock, MoveLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
    const router = useRouter();

    return (
        <Section className="min-h-[calc(100vh-4rem)] flex items-center bg-slate-50/50">
            <Container>
                <div className="max-w-md mx-auto text-center space-y-8 p-8 bg-white rounded-3xl shadow-xl border border-slate-100">
                    <div className="mx-auto w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
                        <Lock className="w-10 h-10 text-primary" />
                    </div>

                    <div className="space-y-2">
                        <H1 className="text-3xl lg:text-3xl">Coming Soon</H1>
                        <P className="text-muted-foreground">
                            We&apos;re working hard to bring you the password recovery feature. Please contact support if you need immediate assistance.
                        </P>
                    </div>

                    <div className="pt-4 flex flex-col gap-3">
                        <Button
                            onClick={() => router.push("/signin")}
                            className="w-full gap-2"
                            premium
                        >
                            <MoveLeft className="w-4 h-4" />
                            Back to Sign In
                        </Button>
                        <Button
                            variant="outline"
                            onClick={() => router.push("/")}
                            className="w-full"
                        >
                            Go to Home
                        </Button>
                    </div>
                </div>
            </Container>
        </Section>
    );
}
