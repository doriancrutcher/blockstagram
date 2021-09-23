import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Card, Container, Row, Button } from "react-bootstrap";

const BlockFeed = (props) => {
  // state variables

  const [userList, changeUserList] = useState([]);
  const [imageList, changeImageList] = useState([]);
  const [captionList, changeCaption] = useState([]);

  useEffect(() => {
    const getFeed = async () => {
      // get user list
      let userList = await window.contract.get_user_list();
      console.log(userList);

      //caption list

      // get image list

      let userAddressStringList = await window.contract.get_data_addresses({
        account_id: window.accountId,
      });

      console.log(userAddressStringList);

      let captionList = userAddressStringList.map(async (x) => {
        return window.contract.get_caption({ address: x });
      });

      console.log("captions are", await Promise.all(captionList));

      changeCaption(await Promise.all(captionList));

      await changeImageList(userAddressStringList);
    };

    getFeed();
  }, []);

  const imageCaption = ["when hope is all you have, keep hoping #keepHoping"];

  return (
    <Container style={{ marginTop: "10px" }}>
      <Row className='d-flex justify-content-center'>
        {imageList.map((x, i) => {
          return (
            <React.Fragment key={i}>
              <Card style={{ marginTop: "10px", width: "18rem" }}>
                {console.log(x)}
                <Card.Img
                  style={{ marginTop: "10px" }}
                  variant='top'
                  src={`https://ipfs.infura.io/ipfs/${x}`}
                />
                <Card.Body>
                  <Card.Text>{captionList[i]}</Card.Text>
                  <Button variant='primary'>Go somewhere</Button>
                </Card.Body>
              </Card>
            </React.Fragment>
          );
        })}
      </Row>
    </Container>
  );
};

BlockFeed.propTypes = {};

export default BlockFeed;
