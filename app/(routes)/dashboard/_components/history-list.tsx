"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import AddNewSessionDialog from "./add-new-session-dialog";
import axios from "axios";
import HistoryTable from "./history-table";
import { SessionDetails } from "../doctor-agent/[sessionId]/page";
import { Loader2 } from "lucide-react";

const HistoryList = () => {
  const [historyList, setHistoryList] = useState<SessionDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const getHistoryList = async () => {
    setLoading(true);
    const result = await axios.get("/api/session-chat?sessionId=all");
    console.log(result.data);
    setHistoryList(result.data);
    setLoading(false);
  };

  useEffect(() => {
    getHistoryList();
  }, []);

  return (
    <div className="mt-10">
      {historyList.length == 0 ? (
        <div className="flex flex-col items-center justify-center p-7 border-dashed border-2 rounded-2xl">
          <Image
            src={"/medical-assistance.png"}
            alt="placeholder"
            width={150}
            height={150}
          />
          {loading ? (
            <p className="text-gray-500">
              <Loader2 className="animate-spin" />
            </p>
          ) : (
            <>
              <h2 className="font-bold text-lg mt-2">
                No Recent Consultations
              </h2>
              <p className="text-center text-gray-500 mb-4">
                It looks like you haven&apos;t consulted with any doctor yet
              </p>
              <AddNewSessionDialog />
            </>
          )}
        </div>
      ) : (
        <div>
          <HistoryTable historyList={historyList} />
        </div>
      )}
    </div>
  );
};

export default HistoryList;
