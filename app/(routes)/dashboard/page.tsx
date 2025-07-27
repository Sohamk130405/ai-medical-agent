import React from "react";
import HistoryList from "./_components/history-list";
import DoctorsAgentList from "./_components/doctors-agent-list";
import AddNewSessionDialog from "./_components/add-new-session-dialog";

const Dashboard = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-10">
        <h2 className="font-bold text-2xl">My Dashboard</h2>
        <AddNewSessionDialog />
      </div>
      <HistoryList  />
      <DoctorsAgentList />
    </div>
  );
};

export default Dashboard;
