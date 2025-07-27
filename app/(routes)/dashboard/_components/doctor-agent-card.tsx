"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@clerk/nextjs";
import { IconArrowRight } from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export type DoctorAgent = {
  id: number;
  specialist: string;
  description: string;
  image: string;
  agentPrompt: string;
  voiceId: string;
  subscriptionRequired: boolean;
};

const DoctorAgentCard = ({ doctorAgent }: { doctorAgent: DoctorAgent }) => {
  const router = useRouter();
  const { has } = useAuth();

  const isPaidUser = has && has({ plan: "pro" });
  return (
    <div className="relative">
      {doctorAgent.subscriptionRequired && (
        <Badge className="absolute m-2 right-0">Premium</Badge>
      )}
      <Image
        src={doctorAgent.image}
        alt={doctorAgent.specialist}
        width={200}
        height={200}
        className="w-full h-[280px] object-cover rounded-md"
      />
      <h2 className="font-bold text-lg">{doctorAgent.specialist}</h2>
      <p className="line-clamp-2 text-sm text-gray-600">
        {doctorAgent.description}
      </p>
      <Button
        className="mt-2 w-full relative"
        disabled={!isPaidUser && doctorAgent.subscriptionRequired}
      >
        Start Consultation
        <IconArrowRight className="absolute right-2 top-3" />
      </Button>
    </div>
  );
};

export default DoctorAgentCard;
