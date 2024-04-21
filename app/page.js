"use client";
import { useEffect, useState } from "react";
import Navbar from "./components/Navbar/Navbar";
import Search from "./components/Search/Search";
import Tabled from "./components/tables/Table";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Button, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import Paginate from "./components/paginate/Paginate";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(1); // Initial page number
  const [postsPerPage, setPostsPerPage] = useState(20);
  const [allEmaRecords, setAllEmaRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filteredResults, setFilteredResults] = useState([]);

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  useEffect(() => {
    let socket;

    const fetchEmaRecords = async () => {
      setLoading(true);

      const wsUrl = `wss://be.emascreener.bloombyte.dev/ws/ema-records/?api_key=${process.env.NEXT_PUBLIC_API_KEY}`;

      try {
        socket = new WebSocket(wsUrl);

        // Event listener for when the connection is opened
        socket.onopen = () => {
          console.log("WebSocket connection opened");
        };

        //Sending when there's an error
        socket.onerror = (e) => {
          console.error(e, "WebSocket error");
        };

        // Event listener for incoming messages
        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          if (data.code === "create") {
            setFilteredResults((prevResults) => [data.data, ...prevResults]);
          } else if (data.code === "delete") {
            setFilteredResults((prevResults) =>
              prevResults.filter((emaRecord) => emaRecord.id !== data.data.id)
            );
          } else if (data.code === "update") {
            setFilteredResults((prevResults) =>
              prevResults.map((emaRecord) => {
                if (emaRecord.id === data.data.id) {
                  return data.data;
                }
                return emaRecord;
              })
            );
          }
        };

        setLoading(false);
      } catch (error) {
        console.error("Error fetching EMA records:", error);
        toast.error("Error fetching EMA records");
        setLoading(false);
      }
    };

    fetchEmaRecords();

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOFFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredResults.slice(indexOFFirstPost, indexOfLastPost);
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="bg-[#332605] text-#fff w-full overflow-x-hidden h-[100%] min-h-[100%]"
      >
        <Navbar />
        <Search
          loading={loading}
          setLoading={setLoading}
          setAllEmaRecords={setAllEmaRecords}
          setFilteredResults={setFilteredResults}
          filteredResults={currentPosts}
        />
        <Tabled
          allEmaRecords={allEmaRecords}
          setAllEmaRecords={setAllEmaRecords}
          filteredResults={currentPosts}
          loading={loading}
        />
        <Paginate
          postsPerPage={postsPerPage}
          totalPosts={filteredResults.length}
          handlePageClick={handlePageClick}
          currentPage={currentPage}
        />
        <ToastContainer />
      </motion.div>
    </AnimatePresence>
  );
}
