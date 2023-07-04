import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { apilink } from '../../data/fdata';
import Cookies from 'js-cookie';

const UserDet = ({ addid }) => {
  const [userdet, setUserDet] = useState([]);
  const atokon = Cookies.get('_fleksa_access_restaurant_tokon_');

  const getUserDet = async () => {
    const res = await axios.get(
      `${apilink}/api/v1/user/getUserDetByAddId/${addid}`,
      {
        headers: {
          Authorization: atokon,
        },
      }
    );
    if (res.data.success) {
      setUserDet(res.data.result);
    }
  };

  useEffect(() => {
    if (addid) {
      getUserDet();
    }
  }, [addid]);

  return (
    <>
      {userdet[0]?.name && userdet[0].name} <br />{' '}
      {userdet[0]?.phone && userdet[0].phone} <br />
      {userdet[0]?.address && userdet[0].address}
    </>
  );
};

export default UserDet;
