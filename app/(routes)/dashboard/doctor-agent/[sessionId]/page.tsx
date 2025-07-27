"use client";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DoctorAgent } from "../../_components/doctor-agent-card";
import { Circle, Loader2, PhoneCall, PhoneOff } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Vapi from "@vapi-ai/web";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export type MedicalReport = {
  sessionld: string;
  agent: string;
  user: string;
  timestamp: string;
  chiefComplaint: string;
  summary: string;
  symptoms: string[];
  duration: string;
  severity: string;
  medicationsMentioned: string[];
  recommendations: string[];
};

export type SessionDetails = {
  id: number;
  notes: string;
  sessionId: string;
  report: MedicalReport;
  selectedDoctor: DoctorAgent;
  createdOn: string;
};

type message = {
  role: string;
  text: string;
};

const DoctorVoiceAgent = () => {
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [vapiInstance, setVapiInstance] = useState<Vapi | null>(null);
  const { sessionId } = useParams<{ sessionId: string }>();
  const [sessionDetails, setSessionDetails] = useState<SessionDetails | null>(
    null
  );

  const [callStarted, setCallStarted] = useState<boolean>(false);
  const [currentRole, setCurrentRole] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string>("");
  const [messages, setMessages] = useState<message[]>([]);

  useEffect(() => {
    sessionId && getSessionDetails();
  }, [sessionId]);

  const getSessionDetails = async () => {
    const result = await axios.get("/api/session-chat?sessionId=" + sessionId);
    console.log(result.data);
    setSessionDetails(result.data);
  };

  const startCall = () => {
    setLoading(true);
    const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY!);
    setVapiInstance(vapi);

    const vapiAgentConfig = {
      name: "AI Medical Voice Agent",
      firstMessage:
        "Hi there! I am your AI Medical Voice Agent. How can I assist you today?",
      transcriber: {
        provider: "assembly-ai",
        language: "en",
      },
      voice: {
        provider: "playht",
        voiceId: sessionDetails?.selectedDoctor.voiceId,
      },
      model: {
        provider: "google",
        model: "gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: sessionDetails?.selectedDoctor.agentPrompt,
          },
        ],
      },
    };
    // @ts-ignore
    vapi.start(vapiAgentConfig);
    setLoading(false);
    // Listen for events
    vapi.on("call-start", () => {
      console.log("Call started");
      setCallStarted(true);
    });
    vapi.on("call-end", () => {
      setCallStarted(false);
      console.log("Call ended");
    });

    vapi.on("message", (message) => {
      if (message.type === "transcript") {
        const { role, transcript, transcriptType } = message;
        if (transcriptType === "partial") {
          setTranscript(transcript);
          setCurrentRole(role);
        } else if (transcriptType === "final") {
          setMessages((prev) => [...prev, { role, text: transcript }]);
          setTranscript("");
          setCurrentRole(null);
        }
      }
    });
    vapi.on("speech-start", () => {
      setCurrentRole("assistant");
    });
    vapi.on("speech-end", () => {
      setCurrentRole("user");
    });
  };

  const stopCall = async () => {
    if (!vapiInstance) return;
    setLoading(true);
    const result = await generateReport();
    vapiInstance.stop();
    vapiInstance.off("call-start", () => {});
    vapiInstance.off("call-end", () => {});
    vapiInstance.off("message", () => {});
    setCallStarted(false);
    setVapiInstance(null);
    console.log("Call stopped");
    setLoading(false);
    setMessages([]);
    setTranscript("");
    toast.success("Call ended and report generated successfully!");
    router.replace("/dashboard");
  };

  const generateReport = async () => {
    const result = await axios.post("/api/medical-report", {
      messages,
      sessionDetails,
    });

    console.log(result.data);
    return result.data;
  };

  return (
    <div className="p-5 rounded-3xl  border-dashed border-3 bg-secondary">
      <div className="flex items-center justify-between">
        <h2 className="py-1 px-2 border rounded-md flex gap-2 items-center">
          <Circle
            className={cn(
              "h-4 w-4 rounded-full",
              callStarted ? "bg-green-500" : "bg-red-500"
            )}
          />{" "}
          {callStarted ? "Call in Progress" : "Call Not Started"}
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

          <div className="mt-4 overflow-y-auto flex flex-col items-center px-10 md:px-20 lg:px-52 xl:px-72 w-full">
            {messages?.slice(-4).map((msg, index) => (
              <h2 key={index} className="text-gray-400 p-2">
                {msg.role + " : " + msg.text}
              </h2>
            ))}
            {transcript?.length > 0 && (
              <h2 className="text-lg">
                {currentRole} : {transcript}
              </h2>
            )}
          </div>

          {!callStarted ? (
            <Button className="mt-20" onClick={startCall} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" /> : <PhoneCall />}{" "}
              Start Call
            </Button>
          ) : (
            <Button
              className="mt-20"
              variant={"destructive"}
              onClick={stopCall}
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : <PhoneOff />}{" "}
              Disconnect
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default DoctorVoiceAgent;
