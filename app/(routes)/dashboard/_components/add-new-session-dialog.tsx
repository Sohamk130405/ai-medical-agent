"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { IconArrowRight, IconX } from "@tabler/icons-react";
import axios from "axios";
import { useState } from "react";
import { DoctorAgent } from "./doctor-agent-card";
import { Loader2 } from "lucide-react";
import SuggestedDoctorCard from "./suggested-doctor-card";
import { useRouter } from "next/navigation";

const AddNewSessionDialog = () => {
  const router = useRouter();

  const [note, setNote] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [suggestedDoctors, setSuggestedDoctors] = useState<DoctorAgent[]>([]);

  const [selectedDoctor, setSelectedDoctor] = useState<DoctorAgent | null>(
    null
  );

  const handleNextClick = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/suggest-doctors", { notes: note });
      console.log("Doctors suggested:", result.data);
      setSuggestedDoctors(result.data);
    } catch (error) {
      console.error("Error suggesting doctors:", error);
    } finally {
      setLoading(false);
    }
  };

  const onStartConsultation = async () => {
    setLoading(true);
    try {
      const result = await axios.post("/api/session-chat", {
        notes: note,
        selectedDoctor: selectedDoctor,
      });
      console.log("Consultation started:", result.data);
      if (result.data.sessionId) {
        router.push(`/dashboard/doctor-agent/${result.data.sessionId}`);
      }
    } catch (error) {
      console.error("Error starting consultation:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>+ Start a Consultation</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {suggestedDoctors.length == 0
              ? "Add Basic Details"
              : "Select the doctor "}
          </DialogTitle>
          <DialogDescription asChild>
            {suggestedDoctors.length == 0 ? (
              <div>
                <h2 className="font-semibold">
                  Add Symptoms or Any Other Details
                </h2>
                <Textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={5}
                  placeholder="Add detail here..."
                  className="h-[200px] mt-1"
                />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-5">
                {suggestedDoctors?.map((doctorAgent: DoctorAgent) => (
                  <SuggestedDoctorCard
                    selectedDoctor={selectedDoctor}
                    key={doctorAgent.id}
                    doctorAgent={doctorAgent}
                    setSelectedDoctor={setSelectedDoctor}
                  />
                ))}
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">
              Cancel
              <IconX className="ml-2" />
            </Button>
          </DialogClose>
          {suggestedDoctors.length == 0 ? (
            <Button disabled={!note || loading} onClick={handleNextClick}>
              Next
              {loading ? (
                <Loader2 className="ml-2 animate-spin" />
              ) : (
                <IconArrowRight className="ml-2" />
              )}
            </Button>
          ) : (
            <Button
              onClick={onStartConsultation}
              disabled={!selectedDoctor || loading}
            >
              + Start Consulting
              {loading ? (
                <Loader2 className="ml-2 animate-spin" />
              ) : (
                <IconArrowRight className="ml-2" />
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewSessionDialog;
