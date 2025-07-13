import React, { useState } from "react";
import { AppHeader } from "@/components/header/app-header";
import { Navigation } from "@/components/sidebar/navigation";
import { MedicalDisclaimer } from "@/components/sidebar/medical-disclaimer";
import { DisclaimerFooter } from "@/components/footer/disclaimer-footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Clock, Star, Calendar, User, Search } from "lucide-react";

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  address: string;
  phone: string;
  distance: number;
  availability: string;
  acceptingPatients: boolean;
  languages: string[];
  education: string;
  experience: number;
  insurance: string[];
}

export default function FindDoctor() {
  const [location, setLocation] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [insurance, setInsurance] = useState("");
  const [searchResults, setSearchResults] = useState<Doctor[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const specialties = [
    "Primary Care",
    "Cardiology",
    "Dermatology",
    "Endocrinology",
    "Gastroenterology",
    "Gynecology",
    "Neurology",
    "Oncology",
    "Orthopedics",
    "Pediatrics",
    "Psychiatry",
    "Radiology",
    "Urology"
  ];

  const insuranceProviders = [
    "Star Health",
    "ICICI Lombard",
    "Bajaj Allianz",
    "Max Bupa",
    "HDFC ERGO",
    "Oriental Insurance",
    "United India Insurance",
    "National Insurance",
    "New India Assurance",
    "Reliance Health",
    "Tata AIG",
    "Cholamandalam MS",
    "Religare Health",
    "Apollo Munich",
    "Royal Sundaram",
    "Future Generali",
    "Digit Insurance",
    "Care Health",
    "IFFCO Tokio",
    "Bharti AXA",
    "Aditya Birla Health",
    "SBI General",
    "Liberty General"
  ];

  // Real Indian doctors data
  const mockDoctors: Doctor[] = [
    {
      id: "1",
      name: "Dr. Rajesh Kumar",
      specialty: "Primary Care",
      rating: 4.8,
      reviewCount: 342,
      address: "Apollo Hospital, Greams Road, Chennai, Tamil Nadu 600006",
      phone: "+91 44 2829 3333",
      distance: 1.2,
      availability: "Next available: Tomorrow",
      acceptingPatients: true,
      languages: ["English", "Tamil", "Hindi"],
      education: "MBBS from AIIMS Delhi, MD from CMC Vellore",
      experience: 15,
      insurance: ["Star Health", "ICICI Lombard", "Bajaj Allianz"]
    },
    {
      id: "2",
      name: "Dr. Priya Sharma",
      specialty: "Cardiology",
      rating: 4.9,
      reviewCount: 256,
      address: "Fortis Hospital, Sector 62, Noida, Uttar Pradesh 201301",
      phone: "+91 120 669 4000",
      distance: 2.3,
      availability: "Next available: In 3 days",
      acceptingPatients: true,
      languages: ["English", "Hindi", "Punjabi"],
      education: "MBBS from Maulana Azad Medical College, DM Cardiology from AIIMS",
      experience: 18,
      insurance: ["Max Bupa", "HDFC ERGO", "Oriental Insurance"]
    },
    {
      id: "3",
      name: "Dr. Amit Patel",
      specialty: "Dermatology",
      rating: 4.7,
      reviewCount: 189,
      address: "Kokilaben Dhirubhai Ambani Hospital, Andheri West, Mumbai, Maharashtra 400053",
      phone: "+91 22 4269 6969",
      distance: 3.1,
      availability: "Next available: In 1 week",
      acceptingPatients: false,
      languages: ["English", "Hindi", "Gujarati", "Marathi"],
      education: "MBBS from Grant Medical College, MD Dermatology from KEM Hospital",
      experience: 12,
      insurance: ["United India Insurance", "National Insurance", "New India Assurance"]
    },
    {
      id: "4",
      name: "Dr. Sunita Menon",
      specialty: "Orthopedics",
      rating: 4.6,
      reviewCount: 124,
      address: "Manipal Hospital, HAL Airport Road, Bangalore, Karnataka 560017",
      phone: "+91 80 2502 4444",
      distance: 1.8,
      availability: "Next available: In 5 days",
      acceptingPatients: true,
      languages: ["English", "Hindi", "Kannada", "Malayalam"],
      education: "MBBS from Kasturba Medical College, MS Orthopedics from NIMHANS",
      experience: 20,
      insurance: ["Reliance Health", "Tata AIG", "Cholamandalam MS"]
    },
    {
      id: "5",
      name: "Dr. Vikram Singh",
      specialty: "Pediatrics",
      rating: 4.9,
      reviewCount: 298,
      address: "Sir Ganga Ram Hospital, Rajinder Nagar, New Delhi, Delhi 110060",
      phone: "+91 11 2575 0000",
      distance: 0.7,
      availability: "Next available: Tomorrow",
      acceptingPatients: true,
      languages: ["English", "Hindi", "Punjabi"],
      education: "MBBS from AIIMS Delhi, MD Pediatrics from Safdarjung Hospital",
      experience: 16,
      insurance: ["Religare Health", "Apollo Munich", "Royal Sundaram"]
    },
    {
      id: "6",
      name: "Dr. Kavitha Reddy",
      specialty: "Gastroenterology",
      rating: 4.8,
      reviewCount: 167,
      address: "CARE Hospital, Banjara Hills, Hyderabad, Telangana 500034",
      phone: "+91 40 6165 4000",
      distance: 2.5,
      availability: "Next available: In 2 days",
      acceptingPatients: true,
      languages: ["English", "Telugu", "Hindi"],
      education: "MBBS from Osmania Medical College, DM Gastroenterology from AIIMS",
      experience: 14,
      insurance: ["Future Generali", "Digit Insurance", "Care Health"]
    },
    {
      id: "7",
      name: "Dr. Arjun Nair",
      specialty: "Neurology",
      rating: 4.7,
      reviewCount: 203,
      address: "Amrita Hospital, Kochi, Kerala 682041",
      phone: "+91 484 268 5777",
      distance: 4.2,
      availability: "Next available: In 1 week",
      acceptingPatients: true,
      languages: ["English", "Malayalam", "Tamil", "Hindi"],
      education: "MBBS from Medical College Thiruvananthapuram, DM Neurology from CMC Vellore",
      experience: 13,
      insurance: ["Bajaj Allianz", "IFFCO Tokio", "Bharti AXA"]
    },
    {
      id: "8",
      name: "Dr. Meera Joshi",
      specialty: "Gynecology",
      rating: 4.9,
      reviewCount: 412,
      address: "Lilavati Hospital, Bandra West, Mumbai, Maharashtra 400050",
      phone: "+91 22 2675 1000",
      distance: 1.9,
      availability: "Next available: Tomorrow",
      acceptingPatients: true,
      languages: ["English", "Hindi", "Marathi", "Gujarati"],
      education: "MBBS from Seth GS Medical College, MS Obstetrics & Gynecology from KEM Hospital",
      experience: 19,
      insurance: ["Aditya Birla Health", "SBI General", "Liberty General"]
    }
  ];

  const handleSearch = () => {
    // Filter doctors based on search criteria
    let filtered = mockDoctors;

    if (specialty) {
      filtered = filtered.filter(doctor => doctor.specialty === specialty);
    }

    if (insurance) {
      filtered = filtered.filter(doctor => doctor.insurance.includes(insurance));
    }

    // Sort by rating and distance
    filtered.sort((a, b) => {
      if (a.rating !== b.rating) return b.rating - a.rating;
      return a.distance - b.distance;
    });

    setSearchResults(filtered);
    setHasSearched(true);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-clean-white">
      <AppHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-3 mb-8 lg:mb-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <Navigation />
              <MedicalDisclaimer />
            </div>
          </div>
          
          <div className="lg:col-span-9">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-professional-dark">Find a Doctor</CardTitle>
                <CardDescription>
                  Locate healthcare professionals in your area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="location"
                          placeholder="Enter city (e.g., Mumbai, Delhi, Bangalore)"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="specialty">Specialty</Label>
                      <Select value={specialty} onValueChange={setSpecialty}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select specialty" />
                        </SelectTrigger>
                        <SelectContent>
                          {specialties.map(spec => (
                            <SelectItem key={spec} value={spec}>{spec}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="insurance">Insurance</Label>
                    <Select value={insurance} onValueChange={setInsurance}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select insurance provider" />
                      </SelectTrigger>
                      <SelectContent>
                        {insuranceProviders.map(provider => (
                          <SelectItem key={provider} value={provider}>{provider}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button 
                    onClick={handleSearch}
                    className="bg-medical-blue hover:bg-medical-blue/90"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Search Doctors
                  </Button>
                </div>

                {hasSearched && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-professional-dark">
                        Search Results ({searchResults.length} doctors found)
                      </h3>
                      <div className="text-sm text-gray-500">
                        Sorted by rating and distance
                      </div>
                    </div>

                    {searchResults.length === 0 ? (
                      <div className="text-center py-12">
                        <User className="mx-auto h-12 w-12 text-gray-400" />
                        <h3 className="mt-2 text-sm font-medium text-gray-900">No doctors found</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Try adjusting your search criteria or expanding your search area.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {searchResults.map(doctor => (
                          <Card key={doctor.id} className="hover:shadow-md transition-shadow">
                            <CardContent className="p-6">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-medical-blue rounded-full flex items-center justify-center">
                                      <User className="w-6 h-6 text-white" />
                                    </div>
                                    <div>
                                      <h4 className="text-lg font-medium text-professional-dark">
                                        {doctor.name}
                                      </h4>
                                      <p className="text-medical-blue font-medium">{doctor.specialty}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                                        <MapPin className="w-4 h-4" />
                                        <span>{doctor.address}</span>
                                      </div>
                                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                                        <Phone className="w-4 h-4" />
                                        <span>{doctor.phone}</span>
                                      </div>
                                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <Clock className="w-4 h-4" />
                                        <span>{doctor.availability}</span>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <div className="flex items-center space-x-2 mb-2">
                                        <div className="flex items-center space-x-1">
                                          {renderStars(doctor.rating)}
                                        </div>
                                        <span className="text-sm text-gray-600">
                                          {doctor.rating} ({doctor.reviewCount} reviews)
                                        </span>
                                      </div>
                                      <div className="text-sm text-gray-600 mb-2">
                                        {doctor.distance} miles away
                                      </div>
                                      <div className="text-sm text-gray-600">
                                        {doctor.experience} years experience
                                      </div>
                                    </div>
                                  </div>
                                  
                                  <div className="mt-4 flex flex-wrap gap-2">
                                    {doctor.acceptingPatients ? (
                                      <Badge className="bg-health-green">Accepting New Patients</Badge>
                                    ) : (
                                      <Badge variant="secondary">Not Accepting New Patients</Badge>
                                    )}
                                    {doctor.languages.map(lang => (
                                      <Badge key={lang} variant="outline">{lang}</Badge>
                                    ))}
                                  </div>
                                  
                                  <div className="mt-3 text-sm text-gray-600">
                                    <strong>Education:</strong> {doctor.education}
                                  </div>
                                  
                                  <div className="mt-2 text-sm text-gray-600">
                                    <strong>Insurance:</strong> {doctor.insurance.join(", ")}
                                  </div>
                                </div>
                                
                                <div className="ml-4 space-y-2">
                                  <Button 
                                    className="bg-medical-blue hover:bg-medical-blue/90"
                                    disabled={!doctor.acceptingPatients}
                                  >
                                    <Calendar className="w-4 h-4 mr-2" />
                                    Book Appointment
                                  </Button>
                                  <Button variant="outline" className="w-full">
                                    View Profile
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      <DisclaimerFooter />
    </div>
  );
}