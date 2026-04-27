"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  MessageSquare,
  MapPin,
  Hospital as HospitalIcon,
  Search,
  Navigation,
  AlertCircle
} from "lucide-react";
import { Container, Section, H1, H2, H3, P, Muted } from "@/components/shared/design-system";

import { toast } from "@/components/ui/use-toast";
import { getPincodeCoordinate, getHospotialsNearby, formatHospitalData } from "@/lib/openstreetmap";


interface HospitalData {
  id: string;
  name: string;
  distance: number;
  address: string;
  coordinates: {
    lat: number;
    lon: number
  }
}

function HospitalSkelton() {
  return (
    <div className="p-6 rounded-xl border bg-card shadow-sm animate-pulse">
      <div className="flex justify-between items-start">
        <div className="space-y-3 flex-1">
          <div className="h-6 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted/70 rounded w-1/2" />
          <div className="h-4 bg-muted/70 rounded w-1/3" />
        </div>
        <div className="h-10 w-24 bg-muted rounded" />
      </div>
    </div>
  );
}

function HospitalContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [hospital, setHospitals] = useState<HospitalData[]>([])
  const [loading, setloading] = useState(false)
  const [inputPincode, setInputcode] = useState("")

  const pincode = searchParams.get("pincode");
  useEffect(() => {
    if (!pincode) {
      return
    }
    setloading(true)

    const fetchHospitals = async () => {

      try {
        const coordinate = await getPincodeCoordinate(pincode)
        if (!coordinate) {
          toast({
            title: "Location not Found",
            description: "Could not find coordinates for this pincode.",
            variant: "destructive",
          })
          setloading(false)
          return
        }
        const nearbyHospitals = await getHospotialsNearby(coordinate)
        const formattedHospitals = nearbyHospitals.map((hospital) =>
          formatHospitalData(hospital, coordinate.lat, coordinate.lon)
        )

        formattedHospitals.sort((a, b) => a.distance - b.distance);
        setHospitals(formattedHospitals);

      } catch (error) {
        console.error("Error fetching hospitals:", error);
        toast({
          title: "Connection Error",
          description: "Failed to fetch hospitals. Please try again.",
          variant: "destructive",
        });
      } finally {
        setloading(false)
      }
    }
    fetchHospitals()
  }, [pincode])


  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputPincode.length === 6 && /^\d+$/.test(inputPincode)) {
      router.push(`/hospitals?pincode=${inputPincode}`);
    } else {
      toast({
        title: "Invalid Pincode",
        description: "Please enter a valid 6-digit Indian pincode",
        variant: "destructive",
      });
    }
  };



  const handleChatClick = (hospitalId: string, hospitalName: string) => {
    const encodedName = encodeURIComponent(hospitalName);

    router.push(`/chat?id=${hospitalId}&name=${encodedName}`);
  };

  // --- STATE 1: SEARCH VIEW (Hero Section) ---
  if (!pincode) {
    return (
      <Section className="bg-muted/30 min-h-[calc(100vh-4rem)] flex items-center">
        <Container>
          <div className="w-full max-w-lg mx-auto space-y-8 text-center">
            <div className="mx-auto w-20 h-20 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center shadow-inner">
              <MapPin className="w-10 h-10 text-rose-600 animate-bounce" />
            </div>

            <div className="space-y-2">
              <H1>
                Find Nearby Hospitals
              </H1>
              <P className="text-muted-foreground text-lg">
                Enter your pincode to instantly connect with medical facilities near you.
              </P>
            </div>

            <div className="bg-card p-3 rounded-2xl shadow-lg border border-border">
              <form onSubmit={handleSearch} className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Enter 6-digit Pincode"
                    className="w-full pl-10 pr-4 py-4 rounded-xl text-lg outline-none bg-transparent placeholder:text-muted-foreground text-foreground"
                    value={inputPincode}
                    onChange={(e) => setInputcode(e.target.value)}
                    maxLength={6}
                  />
                </div>
                <Button size="lg" type="submit" className="h-12 px-8 rounded-xl bg-rose-600 hover:bg-rose-700 text-lg transition-all duration-200">
                  Search
                </Button>
              </form>
            </div>
          </div>
        </Container>
      </Section>
    );
  }


  // --- STATE 2: LOADING ---
  if (loading) {
    return (
      <div className="container max-w-5xl mx-auto pt-28 px-4 space-y-6">
        <div className="h-8 bg-muted rounded w-64 animate-pulse mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <HospitalSkelton />
          <HospitalSkelton />
          <HospitalSkelton />
          <HospitalSkelton />
        </div>
      </div>
    );
  }

  // --- STATE 3: RESULTS LIST ---
  return (
    <Section className="bg-muted/30 min-h-screen">
      <Container>
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
          <div>
            <H2 className="border-none pb-0 flex items-center gap-3">
              <HospitalIcon className="w-8 h-8 text-rose-600" />
              Results for {pincode}
            </H2>
            <Muted className="mt-1 text-lg">
              Found {hospital.length} medical facilities nearby
            </Muted>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push('/hospitals')}
            className="rounded-xl"
          >
            Change Location
          </Button>
        </div>

        {hospital.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-3xl border border-dashed border-border">
            <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <H3>No hospitals found</H3>
            <P className="text-muted-foreground">Try increasing your search radius or checking the pincode.</P>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {hospital.map((hospital) => (
              <div
                key={hospital.id}
                className="group bg-card rounded-3xl p-8 border border-border shadow-sm hover:shadow-xl hover:border-rose-100 dark:hover:border-rose-900 transition-all duration-300 flex flex-col"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-400 mb-3">
                      {hospital.distance} km away
                    </span>
                    <H3 className="group-hover:text-rose-600 transition-colors">
                      {hospital.name}
                    </H3>
                  </div>
                  <div className="p-3 bg-muted rounded-2xl group-hover:bg-rose-50 dark:group-hover:bg-rose-900/30 transition-colors">
                    <HospitalIcon className="w-6 h-6 text-muted-foreground group-hover:text-rose-500" />
                  </div>
                </div>

                <div className="flex-1 space-y-4 mb-8">
                  <div className="flex items-start gap-3 text-muted-foreground">
                    <MapPin className="w-5 h-5 shrink-0 mt-0.5" />
                    <span className="text-sm leading-relaxed">
                      {hospital.address !== "Address not available"
                        ? hospital.address
                        : "Detailed address not available on map"}
                    </span>
                  </div>

                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${hospital.coordinates.lat},${hospital.coordinates.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    <Navigation className="w-4 h-4" />
                    Navigate via Google Maps
                  </a>
                </div>

                <Button
                  className="w-full bg-foreground hover:bg-foreground/90 text-background shadow-xl gap-2 h-12 rounded-2xl text-base transition-all active:scale-[0.98]"
                  onClick={() => handleChatClick(hospital.id, hospital.name)}
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat with Hospital
                </Button>
              </div>
            ))}
          </div>
        )}
      </Container>
    </Section>
  );
}


// This is the new entry point for the page
export default function HospitalsPage() {
  return (
    <Suspense fallback={
      <div className="container max-w-5xl mx-auto pt-28 px-4 space-y-6">
        <div className="h-8 bg-muted rounded w-64 animate-pulse mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border bg-card h-40 animate-pulse" />
          <div className="p-6 rounded-xl border bg-card h-40 animate-pulse" />
        </div>
      </div>
    }>
      <HospitalContent />
    </Suspense>
  );
}