import { Button } from "@/components/ui/button";
import { IconArrowRight } from "@tabler/icons-react";
import Image from "next/image";

import { DoctorAgent } from "./doctor-agent-card";
import { Dispatch, SetStateAction } from "react";
import { cn } from "@/lib/utils";

interface SuggestedDoctorCardProps {
  doctorAgent: DoctorAgent;
  selectedDoctor: DoctorAgent | null;
  setSelectedDoctor: Dispatch<SetStateAction<DoctorAgent | null>>;
}

const SuggestedDoctorCard = ({
  doctorAgent,
  selectedDoctor,
  setSelectedDoctor,
}: SuggestedDoctorCardProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-between shadow-sm border rounded-md p-4 hover:border-blue-500 cursor-pointer",
        selectedDoctor?.id === doctorAgent.id
          ? "border-blue-500"
          : "border-gray-200"
      )}
      onClick={() => setSelectedDoctor(doctorAgent)}
    >
      <Image
        src={doctorAgent.image}
        alt={doctorAgent.specialist}
        width={70}
        height={70}
        className="w-[100px] h-[100px] object-cover rounded-md"
      />
      <h2 className="font-bold text-sm text-center">
        {doctorAgent.specialist}
      </h2>
      <p className="line-clamp-1 text-xs text-center text-gray-600">
        {doctorAgent.description}
      </p>
    </div>
  );
};

export default SuggestedDoctorCard;
