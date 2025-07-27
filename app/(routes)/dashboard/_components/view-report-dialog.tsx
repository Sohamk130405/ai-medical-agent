import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Dot, Eye } from "lucide-react";
import { SessionDetails } from "../doctor-agent/[sessionId]/page";
import moment from "moment";

interface Props {
  record: SessionDetails;
}

const ViewReportDialog = ({ record }: Props) => {
  const report = record.report;
  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant={"link"} size={"sm"}>
            <Eye />
            View Report
          </Button>
        </DialogTrigger>
        <DialogContent className="overflow-y-scroll max-h-[90vh] px-4 py-6">
          <DialogHeader>
            <DialogTitle asChild>
              <h2 className="text-center font-bold text-blue-500 text-2xl">
                AI Medical Agent Report
              </h2>
            </DialogTitle>
            <DialogDescription asChild>
              <div className="flex flex-col gap-4">
                <div className="mt-5">
                  <h2 className="font-bold text-blue-500 text-lg">
                    Session Info:
                  </h2>
                  <div className="grid grid-cols-2 border-t-2 border-blue-500 pt-2">
                    <h2>
                      <span className="font-bold">Doctor Specialization:</span>{" "}
                      {record.selectedDoctor.specialist}
                    </h2>

                    <h2>
                      <span className="font-bold">Consultation Date:</span>
                      {moment(new Date(record.createdOn)).fromNow()}
                    </h2>
                  </div>
                </div>

                <div className="mt-2">
                  <h2 className="font-bold text-blue-500 text-lg">
                    Cheif Complaint
                  </h2>
                  <div className="border-t-2 border-blue-500 pt-2">
                    <h2>
                      {report?.chiefComplaint || "No chief complaint provided."}
                    </h2>
                  </div>
                </div>

                <div className="mt-2">
                  <h2 className="font-bold text-blue-500 text-lg">Summary</h2>
                  <div className="border-t-2 border-blue-500 pt-2">
                    <h2>{report?.summary}</h2>
                  </div>
                </div>

                <div className="mt-2">
                  <h2 className="font-bold text-blue-500 text-lg">Symptoms</h2>
                  <ul className="border-t-2 border-blue-500 pt-2">
                    {report?.symptoms.length > 0 ? (
                      report?.symptoms.map((symptom, index) => (
                        <li key={index} className="text-gray-500 flex">
                          <Dot />
                          {symptom}
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500">No symptoms reported.</li>
                    )}
                  </ul>
                </div>

                <div className="mt-2">
                  <h2 className="font-bold text-blue-500 text-lg">
                    Duration and Severity
                  </h2>
                  <div className="grid grid-cols-2 border-t-2 border-blue-500 pt-2">
                    <h2>
                      <span className="font-bold">Duration:</span>{" "}
                      {report?.duration || "Not specified"}
                    </h2>

                    <h2>
                      <span className="font-bold">Severity:</span>{" "}
                      {report?.severity || "Not specified"}
                    </h2>
                  </div>
                </div>

                <div className="mt-2">
                  <h2 className="font-bold text-blue-500 text-lg">
                    Prescribed Medications
                  </h2>
                  <ul className="border-t-2 border-blue-500 pt-2">
                    {report?.medicationsMentioned.length > 0 ? (
                      report?.medicationsMentioned.map((medi, index) => (
                        <li key={index} className="text-gray-500 flex">
                          <Dot />
                          {medi}
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500">
                        No medication mentioned.
                      </li>
                    )}
                  </ul>
                </div>

                <div className="mt-5">
                  <h2 className="font-bold text-blue-500 text-lg">
                    Recommendations
                  </h2>
                  <ul className="border-t-2 border-blue-500 pt-2">
                    {report?.recommendations.length > 0 ? (
                      report?.recommendations.map((recommendation, index) => (
                        <li key={index} className="text-gray-500 flex">
                          <Dot />
                          {recommendation}
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-500">No recommendations.</li>
                    )}
                  </ul>
                </div>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewReportDialog;
