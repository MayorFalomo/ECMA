"use client";
import React, { useEffect, useState } from "react";
import Admin from "../components/dashboard/Admin";
import SeeAllCategories from "../components/dashboard/SeeAllCategories";
import AdminNavbar from "../components/adminNav/AdminNavbar";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAppContext } from "../helper/Helpers";

const page = () => {
  const { contextValue } = useAppContext();

  const router = useRouter();
  const [emaCurrencies, setEmaCurrencies] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const tok = window.localStorage.getItem("token");
    const userId = window.localStorage.getItem("userId");
    console.log(contextValue.token || tok, "inside useEffect");
    console.log(contextValue.userId || userId, "inside useEffect");
    getCurrentUser(
      `${contextValue.token || tok}`,
      `${contextValue.userId || userId}`
    );
  }, []);

  // getCurrentUser takes in a parameter called token which we'll get from getCurrentUser which is th token response
  const getCurrentUser = async (token, userId) => {
    if (!token && !userId) {
      router.push("/login");
      // try {
      //   console.log(token.length, "token length");
      //   console.log(token, userId, "token and userId");
      //   toast.success("Login successful");
      // } catch (err) {
      //   console.log(err);
      //   toast.error(`user login failed!`);
      //   router.push("/login");
      // }
    } else {
      // router.push("/login");
      console.log("Hello i am admin");
    }
  };

  useEffect(() => {
    getAllCurrencies();
  }, []);

  const getAllCurrencies = async () => {
    setLoaded(true);

    // const token = contextValue.token || localStorage.getItem("token");
    const ApiKey = process.env.NEXT_PUBLIC_API_KEY;

    if (ApiKey) {
      try {
        await axios({
          method: "GET",
          url: "https://be.emascreener.bloombyte.dev/api/v1/currencies/",
          headers: {
            // Authorization: `AuthToken ${token}`,
            "x-API-KEY": ApiKey,
            "Content-Type": "application/json",
          },
        })
          .then((res) => {
            setEmaCurrencies(res.data.results);
            setLoaded(false);
          })
          .catch((error) => {
            console.log(error.response.status, "this is status");
            if (error.response.status == 401) {
              console.log(error, "An Error retrieving records has occurred");
              router.push("/login");
            }
          });
      } catch (error) {
        console.log(error, "An Error retrieving records has occurred");
      }
    }
  };

  return (
    <div className="w-full overflow-x-hidden h-full min-h-full">
      <AdminNavbar />
      <Admin
        emaCurrencies={emaCurrencies}
        setEmaCurrencies={setEmaCurrencies}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
      />
      <SeeAllCategories
        emaCurrencies={emaCurrencies}
        setEmaCurrencies={setEmaCurrencies}
        loaded={loaded}
        setLoaded={setLoaded}
      />
    </div>
  );
};

export default page;
