"use client";
import { ReactNode, useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { UserDetailContext } from "@/context/UserDetailContext";

export type UserDetail = {
  name: string;
  email: string;
  credits: number;
};

const Provider = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const { user } = useUser();

  const [userDetail, setUserDetail] = useState<UserDetail | undefined>();
  useEffect(() => {
    user && createNewUser();
  }, [user]);

  const createNewUser = async () => {
    const result = await axios.post("/api/users");
    if (result.status === 200) {
      console.log("User created successfully:", result.data);
      setUserDetail(result.data);
    } else {
      console.error("Error creating user:", result.data);
    }
  };
  return (
    <div>
      <UserDetailContext.Provider
        value={{
          userDetail,
          setUserDetail,
        }}
      >
        {children}
      </UserDetailContext.Provider>
    </div>
  );
};

export default Provider;
