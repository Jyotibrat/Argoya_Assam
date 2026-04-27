"use client";

import React, { Suspense } from "react";
import { Container, Section, H1, P, Muted } from "@/components/shared/design-system";
import { Button } from "@/components/shared/button";
import { MessageSquare, MoveLeft, Hospital } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

function ChatContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const hospitalName = searchParams.get("name");

    return (
        <Section className="min-h-[calc(100vh-4rem)] flex items-center bg-muted/30">
            <Container>
                <div className="max-w-2xl mx-auto text-center space-y-8 p-12 bg-card rounded-3xl shadow-xl border border-border">
                    <div className="relative mx-auto w-24 h-24">
                        <div className="absolute inset-0 bg-primary/10 rounded-full animate-ping" />
                        <div className="relative w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center">
                            <MessageSquare className="w-12 h-12 text-primary" />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-muted text-muted-foreground text-sm font-medium gap-2">
                            <Hospital className="w-4 h-4" />
                            {hospitalName ? `Chat with ${hospitalName}` : "Hospital Chat"}
                        </div>
                        <H1 className="text-4xl">Direct Messaging Coming Soon</H1>
                        <P className="text-muted-foreground text-lg max-w-lg mx-auto">
                            Our secure messaging platform for connecting patients directly with healthcare providers is currently under development.
                        </P>
                    </div>

                    <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            onClick={() => router.back()}
                            variant="outline"
                            className="gap-2 px-8 py-6 rounded-2xl text-lg"
                        >
                            <MoveLeft className="w-5 h-5" />
                            Go Back
                        </Button>
                        <Button
                            onClick={() => router.push("/hospitals")}
                            className="gap-2 px-8 py-6 rounded-2xl text-lg"
                            premium
                        >
                            Find Other Hospitals
                        </Button>
                    </div>

                    <Muted className="pt-4">
                        Estimated Arrival: Q3 2026
                    </Muted>
                </div>
            </Container>
        </Section>
    );
}

export default function ChatPage() {
    return (
        <Suspense fallback={
            <Section className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
            </Section>
        }>
            <ChatContent />
        </Suspense>
    );
}
