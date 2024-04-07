import { DeleteIcon } from "@chakra-ui/icons";
import { Td, Tr } from "@chakra-ui/react";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css";

import React from "react";
import { toast } from "react-toastify";
import axios from "axios";

const SingleCategory = (props) => {
  const deleteCoin = async () => {
    try {
      const response = await axios
        .post({
          method: "POST",
          url: `https://be.emascreener.bloombyte.dev/api/v1/currencies/${props.coin.id}/delete/`,
          headers: {
            Authorization: `AuthToken ${
              contextValue.token || localStorage.getItem("token")
            }`,
          },
        })
        .catch((err) => console.log(err));
      if (response.status === 200) {
        toast.success("Coin deleted successfully");
        props.setEmaCurrencies(
          props.emaCurrencies.filter(
            (currency) => currency.id !== props.coin.id
          )
        );
      }
    } catch (error) {
      console.log(error);
      toast.error("Error deleting coin");
    }
    props.setEmaCurrencies(
      props.emaCurrencies.filter((currency) => currency.id !== props.coin.id)
    );
  };

  return (
    <Tr>
      <Td textAlign="center">{props.emaCurrencies.length}</Td>
      <Td textAlign="center">{props.coin.name}</Td>
      <Td textAlign="center">{props.coin.symbol}</Td>
      <Td textAlign="center">{props.coin.category}</Td>
      <Td textAlign="center">{props.coin.current_price}</Td>
      <Td textAlign="center">{props.coin.subcategory}</Td>
      <Td textAlign="center">{props.coin.exchange}</Td>
      <Td>
        <Tippy placement="bottom" content="delete">
          <span>
            <DeleteIcon onClick={deleteCoin} cursor="pointer" />{" "}
          </span>
        </Tippy>
      </Td>
    </Tr>
  );
};

export default SingleCategory;
