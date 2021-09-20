import React from "react";
import PropTypes from "prop-types";
import { Container } from "react-bootstrap";

const UserProfile = (props) => {
  // State Variables
  const [userPictures, changeUserPicures] = useState([]);
  const [userCaptions, changeUserCaptions] = useState([]);

  useEffect(() => {
    const getInfo = async () => {
      let pictureAddresses = await window.contract.get_data_addresses({
        account_id: window.account_id,
      });

      let userCaptions = pictureAddresses.map((address, index) => {
        return await get_caption({ address: address });
      });

      changeUserPicures(pictureAddresses);
      changeUserCaptions(userCaptions);
    };

    getInfo();
  }, []);

  return (
    <Container>
      {userPictures.map((x, i) => {
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
                <Card.Title>{window.accountId}'s Image</Card.Title>
                <Card.Text>{userCaptions[i]}</Card.Text>
                <Button variant='primary'>Go somewhere</Button>
              </Card.Body>
            </Card>
          </Row>
        );
      })}
    </Container>
  );
};

UserProfile.propTypes = {};

export default UserProfile;
