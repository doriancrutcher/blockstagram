import React, { useState } from "react";
import PropTypes from "prop-types";
import { Card, Container, Row, Button } from "react-bootstrap";

const BlockFeed = (props) => {
  // state variables

  [userList, changeUserList] = useState([]);
  [imageList, changeImageList] = useState([]);

  useEffect(() => {
    const getFeed = async () => {
      // get user list
      let userList = await window.contract.get_user_list();

      // get image list
      let imageListFromUsers = userList.map(async (x) => {
        let userAddressStringList = await window.contract.get_data_addresses({
          account_id: x,
        });
        return userAddressStringList;
      });

      // unpack array of arrays i.e. [[1,2,3],[4,5,6]] -------> [1,2,3,4,5,6] for the image links
      let oneDimensionalArray = [];

      imageListFromUsers.forEach((x) => {
        oneDimensionalArray = oneDimensionalArray.concat(x);
      });

      changeImageList(oneDimensionalArray);
    };

    getFeed();
  }, []);

  const imageCaption = ["when hope is all you have, keep hoping #keepHoping"];

  return (
    <Container style={{ marginTop: "10px" }}>
      {imageList.map((x, i) => {
        return (
          <Row
            key={i}
            style={{ marginTop: "10px" }}
            className='justify-content-center d-flex'
          >
            <Card style={{ marginTop: "10px", width: "18rem" }}>
              <Card.Img
                style={{ marginTop: "10px" }}
                variant='top'
                src={`https://ipfs.infura.io/ipfs/${x}`}
              />
              <Card.Body>
                <Card.Title>Card Title</Card.Title>
                <Card.Text>
                  Some quick example text to build on the card title and make up
                  the bulk of the card's content.
                </Card.Text>
                <Button variant='primary'>Go somewhere</Button>
              </Card.Body>
            </Card>
          </Row>
        );
      })}
    </Container>
  );
};

BlockFeed.propTypes = {};

export default BlockFeed;
