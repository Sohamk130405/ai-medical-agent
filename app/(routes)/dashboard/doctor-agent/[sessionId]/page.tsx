"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DoctorAgent } from "../../_components/doctor-agent-card";
import { Circle, PhoneCall } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type SessionDetails = {
  id: number;
  notes: string;
  sessionId: string;
  report: JSON;
  selectedDoctor: DoctorAgent;
  createdOn: string;
};

const DoctorVoiceAgent = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  const [sessionDetails, setSessionDetails] = useState<SessionDetails | null>(
    null
  );
  useEffect(() => {
    sessionId && getSessionDetails();
  }, [sessionId]);

  const getSessionDetails = async () => {
    const result = await axios.get("/api/session-chat?sessionId=" + sessionId);
    console.log(result.data);
    setSessionDetails(result.data);
  };
  return (
    <div className="p-5 rounded-3xl  border-dashed border-3 bg-secondary">
      <div className="flex items-center justify-between">
        <h2 className="py-1 px-2 border rounded-md flex gap-2 items-center">
          <Circle className="h-4 w-4" /> Not Connected
        </h2>
        <h2 className="font-bold text-xl text-gray-400">00:00</h2>
      </div>
      {sessionDetails && (
        <div className="flex flex-col items-center justify-center mt-10">
          <Image
            src={sessionDetails?.selectedDoctor.image}
            alt={sessionDetails?.selectedDoctor.specialist}
            width={120}
            height={120}
            className="rounded-full mt-4 mb-2 h-[100px] w-[100px] object-cover"
          />
          <h2>{sessionDetails.selectedDoctor.specialist}</h2>
          <p className="text-sm text-gray-400">AI Medical Voice Agent</p>

          <div className="mt-32">
            <h2 className="text-gray-400">Assistant Message</h2>
            <h2 className="text-lg">User Message</h2>
          </div>

          <Button className="mt-20">
            <PhoneCall /> Start Call
          </Button>
        </div>
      )}
    </div>
  );
};

export default DoctorVoiceAgent;
