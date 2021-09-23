import React, { useState, useRef } from "react";
import PropTypes from "prop-types";
import { Container, Row, Col, Form } from "react-bootstrap";

// Ipfs Tools
const { create } = require("ipfs-http-client");
const ipfs = create({
  host: "ipfs.infura.io",
  port: "5001",
  protocol: "https",
});

const UploadCenter = (props) => {
  // states
  const [bufferVal, changeBuffer] = useState([]);
  const [buttonBool, changeButtonBool] = useState(false);

  // page references

  const captionRef = useRef();

  const processPic = (event) => {
    event.preventDefault();
    console.log("event capture...");
    console.log(event);
    // process file for ipfs
    console.log(event.target.files);
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.readAsArrayBuffer(file);
    reader.onloadend = () => {
      changeBuffer(reader.result);
      console.log(reader.result);
    };
  };

  const sendToIPFS = async (event) => {
    changeButtonBool(true);

    if (captionRef.current.value === "") {
      alert("please add a caption");
    }

    event.preventDefault();
    console.log("submitting the form...");

    const getAddress = await ipfs.add(bufferVal);
    console.log(getAddress);

    // add address

    await window.contract.add_data_address({
      account_id: window.accountId,
      address: getAddress.path,
    });

    console.log("data address added");

    console.log("caption is", captionRef.current.value);

    // store caption
    await window.contract.store_caption({
      address: getAddress.path,
      caption: captionRef.current.value,
    });

    // update user list if needed

    let current_list = await window.contract.get_user_list();
    console.log(current_list);
    if (!current_list.includes(window.accountId)) {
      await window.contract.store_user({ user: window.accountId });
    }

    console.log("form submitted");
    alert("form submitted");
  };

  return (
    <Container>
      <Form.Group controlId='formFile' className='mb-3'>
        <Form.Label>Selet an image to share to Blockstagram</Form.Label>
        <Form.Control onChange={processPic} type='file' />
        <Form.Control
          style={{ height: "30vh", marginTop: "2vh" }}
          placeholder='enter a caption here'
          className='text-muted'
          ref={captionRef}
        />

        <Form.Control
          disabled={buttonBool}
          type='submit'
          onClick={sendToIPFS}
        />
      </Form.Group>
    </Container>
  );
};

UploadCenter.propTypes = {};

export default UploadCenter;
