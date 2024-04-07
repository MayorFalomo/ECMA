"use client";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { Heading, Text } from "@chakra-ui/react";
import { TbLogout2 } from "react-icons/tb";
import Tippy from "@tippyjs/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/app/helper/Helpers";

const AdminNavbar = () => {
  const { contextValue } = useAppContext();

  const [currentTime, setCurrentTime] = useState(moment());

  //!Function for showing the current time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const router = useRouter();

  const logOut = async () => {
    const TOKEN = contextValue.token || localStorage.getItem("token");
    const USER_ID = contextValue.userId || localStorage.getItem("userId");

    if (TOKEN && USER_ID) {
      try {
        await axios({
          method: "POST",
          url: "https://be.emascreener.bloombyte.dev/api/v1/accounts/logout/",
          // headers: `AuthToken ${TOKEN}`,
          headers: {
            Authorization: `AuthToken ${TOKEN}`,
            "Content-Type": "application/json",
          },
          data: {
            user_id: USER_ID,
          },
        })
          .then((res) => {
            console.log(res.data);
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            router.push("/login");
            toast.success("Logged out successfully");
          })
          .catch(
            (err) =>
              console.log(err, "Axios Error has Occured") &&
              toast.error("Logout unsuccessful")
          );
      } catch (error) {
        console.log(error, "An Error has occured");
        toast.error("Logout has failed");
      }
    }
  };

  return (
    <div
      style={{
        boxShadow:
          "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px",
        // boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
      }}
      className="w-[100%] bg-black text-#fff"
    >
      <div className="flex items-center justify-between m-auto py-4 w-[95%]  max-[500px]:justify-between ">
        <div className="flex items-center gap-3  ">
          <div className="w-[50px] max-[450px]:hidden">
            <img className="w-full rounded-full" src="./logos.png" alt="img" />
          </div>
          <Heading
            as="h4"
            size="md"
            textColor="white"
            className="text-#fff max-[500px]:text-[16px]"
          >
            ECMA Screener{" "}
          </Heading>
        </div>
        <div className="flex items-center gap-3 justify-center text-[20px] ">
          <Text textColor="white" className=" text-#fff max-[500px]:hidden">
            Current Time{" "}
          </Text>
          <Text textColor="white" className=" text-#fff">
            {" "}
            {/* {currentTime.format("HH:mm:ss")}{" "} */}
          </Text>
          <Text textColor="white" className=" text-#fff">
            UTC{" "}
          </Text>
        </div>
        <Tippy content="Logout" placement="bottom">
          <span onClick={logOut} className="text-#fff cursor-pointer p-2">
            <TbLogout2 fontSize="24px" color="white" />
          </span>
        </Tippy>
      </div>
    </div>
  );
};

export default AdminNavbar;