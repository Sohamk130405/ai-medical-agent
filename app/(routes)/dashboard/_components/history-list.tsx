"use client";
import Image from "next/image";
import { useState } from "react";
import AddNewSessionDialog from "./add-new-session-dialog";

const HistoryList = () => {
  const [historyList, setHistoryList] = useState([]);
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
          <h2 className="font-bold text-lg mt-2">No Recent Consultations</h2>
          <p className="text-center text-gray-500 mb-4">It looks like you haven&apos;t consulted with any doctor yet</p>
          <AddNewSessionDialog />
        </div>
      ) : (
        <div>List</div>
      )}
    </div>
  );
};

export default HistoryList;
