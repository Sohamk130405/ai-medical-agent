import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";
import Image from "next/image";

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
  return (
    <div>
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
      <Button className="mt-2 w-full relative">
        Start Consultation
        <IconArrowRight className="absolute right-2 top-3" />
      </Button>
    </div>
  );
};

export default DoctorAgentCard;
