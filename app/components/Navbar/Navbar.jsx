"use client";
import React, { useEffect, useState } from "react";
import moment from "moment";
import { Heading, Text } from "@chakra-ui/react";
import { TbLogout2 } from "react-icons/tb";
import Tippy from "@tippyjs/react";
import axios from "axios";
import { useAppContext } from "@/app/helper/Helpers";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const { contextValue } = useAppContext();
  const [currentTime, setCurrentTime] = useState(moment());

  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(moment());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        boxShadow:
          "rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;",
        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px;",
      }}
      className="w-[100%] bg-white text-#000"
    >
      <div className="flex items-center justify-between m-auto py-4 w-[95%]  max-[500px]:justify-between ">
        <div className="flex items-center gap-3  ">
          <div className="w-[50px] max-[450px]:hidden">
            <img className="w-full rounded-full" src="./logos.png" alt="img" />
          </div>
          <Heading
            as="h4"
            size="md"
            className="text-#000 max-[500px]:text-[16px]"
          >
            ECMA Screener{" "}
          </Heading>
        </div>
        <div className="flex items-center gap-3 justify-center text-[20px] ">
          <Text className=" text-#000 max-[500px]:hidden">Current Time </Text>
          <Text className=" text-#000"> {currentTime.format("HH:mm:ss")} </Text>
          <Text className=" text-#000">UTC </Text>
        </div>
        <Tippy content="Logout" placement="bottom">
          <span className="cursor-pointer p-2">
            <TbLogout2 fontSize="24px" />
          </span>
        </Tippy>
      </div>
    </div>
  );
};

export default Navbar;
