import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/shared/button";
import { Container, Section, H1, P } from "@/components/shared/design-system";
import { Mail, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ComingSoon() {
    return (
        <Section className="min-h-[calc(100vh-4rem)] flex items-center bg-slate-50/50">
            <Container>
                <div className="flex flex-col items-center text-center gap-10 max-w-3xl mx-auto">
                    <div className="space-y-4">
                        <H1 className="text-5xl md:text-7xl">Coming Soon</H1>
                        <P className="text-xl md:text-2xl text-muted-foreground">
                            We&apos;re building something amazing. Stay tuned for the official launch!
                        </P>
                    </div>

                    <div className="w-full max-w-md p-2 bg-white rounded-2xl shadow-xl border border-slate-100 flex flex-col sm:flex-row gap-2">
                        <Input
                            type="email"
                            placeholder="Enter your email for updates"
                            className="flex-1 border-none bg-transparent h-12 text-lg focus-visible:ring-0"
                        />
                        <Button premium className="h-12 px-8 rounded-xl text-lg font-semibold gap-2">
                            <Mail className="w-5 h-5" />
                            Notify Me
                        </Button>
                    </div>

                    <Link href="/">
                        <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-primary transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            Back to Home
                        </Button>
                    </Link>
                </div>
            </Container>
        </Section>
    );
}
