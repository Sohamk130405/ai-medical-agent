"use client";
import axios from "axios";
import { useParams } from "next/navigation";
import { useEffect } from "react";

const DoctorVoiceAgent = () => {
  const { sessionId } = useParams<{ sessionId: string }>();
  useEffect(() => {
    sessionId && getSessionDetails();
  }, [sessionId]);

  const getSessionDetails = async () => {
    const result = await axios.get("/api/session-chat?sessionId=" + sessionId);
    console.log(result.data);
  };
  return <div>DoctorVoiceAgent : {sessionId}</div>;
};

export default DoctorVoiceAgent;
