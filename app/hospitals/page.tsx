"use client"

import { useEffect,useState,Suspense } from "react"
import { useSearchParams,useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { 
  MessageSquare, 
  MapPin, 
  Hospital, 
  Search, 
  Navigation,
  AlertCircle 
} from "lucide-react";

import { toast } from "@/components/ui/use-toast";
import { getPincodeCoordinate,getHospotialsNearby,formatHospitalData } from "@/lib/openstreetmap";


interface HospitalData {
    id:string;
    name:string;
    distance:number;
    address:string;
    coordinates:{
    lat:number;
    lon:number
   }
}

function HospitalSkelton(){
    return (
    <div className="p-6 rounded-xl border bg-white shadow-sm animate-pulse">
      <div className="flex justify-between items-start">
        <div className="space-y-3 flex-1">
          <div className="h-6 bg-slate-200 rounded w-3/4" />
          <div className="h-4 bg-slate-100 rounded w-1/2" />
          <div className="h-4 bg-slate-100 rounded w-1/3" />
        </div>
        <div className="h-10 w-24 bg-slate-200 rounded" />
      </div>
    </div>
  );
}

function HospitalContent(){
    const searchParams = useSearchParams()
    const router = useRouter()
    const[hospital,setHospitals] = useState<HospitalData[]>([])
    const[loading,setloading]= useState(false)
    const[inputPincode,setInputcode]=useState("")

    const pincode = searchParams.get("pincode");
    useEffect(()=>{
        if(!pincode){
            return 
        }
        setloading(true)

        const fetchHospitals = async() =>{

            try{
                const coordinate = await getPincodeCoordinate(pincode)
                if(!coordinate){
                    toast({
                        title:"Location not Found",
                        description:"Could not find coordinates for this pincode.",
                         variant: "destructive",
                  })
                  setloading(false)
                  return 
                }
                const nearbyHospitals = await getHospotialsNearby(coordinate) 
                const formattedHospitals = nearbyHospitals.map((hospital)=>
                    formatHospitalData(hospital,coordinate.lat,coordinate.lon)
                ) 

                formattedHospitals.sort((a, b) => a.distance - b.distance);
                setHospitals(formattedHospitals); 
                
            }catch(error){
                console.error("Error fetching hospitals:", error);
                toast({
                title: "Connection Error",
                 description: "Failed to fetch hospitals. Please try again.",
                variant: "destructive",
        });
            }finally{
                setloading(false)
            }
        }
        fetchHospitals()
    },[pincode])


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
   
      <div className="min-h-[80vh] flex flex-col items-center justify-center pt-24 px-4 bg-slate-50/50">
        <div className="w-full max-w-lg space-y-8 text-center">
          <div className="mx-auto w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center shadow-inner">
            <MapPin className="w-10 h-10 text-rose-600 animate-bounce" />
          </div>
          
          <div className="space-y-1">
            <h1 className="text-4xl font-bold tracking-tight text-slate-900">
              Find Nearby Hospitals
            </h1>
            <p className="text-slate-500 text-lg">
              Enter your pincode to instantly connect with medical facilities near you.
            </p>
          </div>

          <div className="bg-white p-3 rounded-2xl shadow-lg border border-slate-100">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400" />
                <input
                  type="text"
                  placeholder="Enter 6-digit Pincode (e.g. 110001)"
                  className="w-full pl-10 pr-4 py-4 rounded-xl text-lg outline-none placeholder:text-slate-300"
                  value={inputPincode}
                  onChange={(e) => setInputcode(e.target.value)}
                  maxLength={6}
                />
              </div>
              <Button size="lg" type="submit" className="h-11 px-8 cursor-pointer rounded-xl bg-rose-600 hover:bg-rose-700 text-lg">
                Search
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // --- STATE 2: LOADING ---
  if (loading) {
    return (
      <div className="container max-w-5xl mx-auto pt-28 px-4 space-y-6">
        <div className="h-8 bg-slate-200 rounded w-64 animate-pulse mb-8" />
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
    <div className="min-h-screen bg-slate-50/50 pt-24 pb-12">
      <div className="container max-w-5xl mx-auto px-4">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
              <Hospital className="w-8 h-8 text-rose-600" />
              Results for {pincode}
            </h2>
            <p className="text-slate-500 mt-1">
              Found {hospital.length} medical facilities nearby
            </p>
          </div>
          <Button 
            variant="outline" 
            onClick={() => router.push('/hospitals')}
            className="text-slate-600"
          >
            Change Location
          </Button>
        </div>

        {hospital.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
            <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900">No hospitals found</h3>
            <p className="text-slate-500">Try increasing your search radius or checking the pincode.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {hospital.map((hospital) => (
              <div
                key={hospital.id}
                className="group bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg hover:border-rose-100 transition-all duration-300 flex flex-col"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 text-rose-700 mb-2">
                      {hospital.distance} km away
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-rose-600 transition-colors">
                      {hospital.name}
                    </h3>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-rose-50 transition-colors">
                    <Hospital className="w-6 h-6 text-slate-400 group-hover:text-rose-500" />
                  </div>
                </div>

                <div className="flex-1 space-y-3 mb-6">
                  <div className="flex items-start gap-3 text-slate-600">
                    <MapPin className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="text-sm leading-snug">
                      {hospital.address !== "Address not available" 
                        ? hospital.address 
                        : "Detailed address not available on map"}
                    </span>
                  </div>
                  
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${hospital.coordinates.lat},${hospital.coordinates.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium"
                  >
                    <Navigation className="w-4 h-4" />
                    Navigate via Google Maps
                  </a>
                </div>

                <Button
                
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20 gap-2 h-11 rounded-xl"
                  onClick={() => handleChatClick(hospital.id,hospital.name)}
                >
                  <MessageSquare className="w-4 h-4" />
                  Chat with Hospital
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// This is the new entry point for the page
export default function HospitalsPage() {
  return (
    <Suspense fallback={
      <div className="container max-w-5xl mx-auto pt-28 px-4 space-y-6">
        <div className="h-8 bg-slate-200 rounded w-64 animate-pulse mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-xl border bg-white h-40 animate-pulse" />
          <div className="p-6 rounded-xl border bg-white h-40 animate-pulse" />
        </div>
      </div>
    }>
      <HospitalContent />
    </Suspense>
  );
}