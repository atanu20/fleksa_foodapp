import React from 'react';
import './Home.css';
import { useState } from 'react';
import { useEffect } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import axios from 'axios';
import { apilink } from '../../data/fdata';
import Cookies from 'js-cookie';
import parse from 'html-react-parser';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import UserDet from './UserDet';

const Home = () => {
  const [preload, setPreLoad] = useState(false);

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [fdesc, setFDesc] = useState('');
  const [tags, setTags] = useState('');
  const [openpop, setOpenPop] = useState(false);
  const [image, setImage] = useState('');
  const [seeOrder, setSeeOrder] = useState(false);
  const atokon = Cookies.get('_fleksa_access_restaurant_tokon_');
  const [foods, setFoods] = useState([]);
  const [foodsid, setFoodsId] = useState([]);
  const [orderforme, setOrderForMe] = useState([]);

  const his = useHistory();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, []);

  useEffect(async () => {
    const res = await axios.get(`${apilink}/auth/isVerify`, {
      headers: {
        Authorization: atokon,
      },
    });
    // console.log(res.data);
    if (!res.data.success) {
      his.push('/');
    } else {
      if (res.data.role == 'restaurant') {
      } else {
        Cookies.remove('_fleksa_access_restaurant_tokon_');
        localStorage.removeItem('_fleksa_access_restaurant_login');
        console.clear();
        window.location.href = '/';
      }
    }
  }, []);

  const addFood = async (e) => {
    e.preventDefault();

    const data = {
      title: name,
      price,
      image,
      tags,
      description: fdesc,
    };

    const res = await axios.post(
      `${apilink}/api/v1/restaurant/postFoodsByResId`,
      data,
      {
        headers: {
          Authorization: atokon,
        },
      }
    );

    if (res.data.success) {
      getAllFoodsByResId();
      setOpenPop(false);
    }
  };

  const getAllFoodsByResId = async () => {
    setPreLoad(true);
    const res = await axios.get(
      `${apilink}/api/v1/restaurant/getAllFoodsByResId`,
      {
        headers: {
          Authorization: atokon,
        },
      }
    );
    if (res.data.success) {
      setFoods(res.data.result);
      let arr = res.data.result.map((v) => v.food_id);
      setFoodsId(arr);
      getRestuORDER(arr);
    }
    setTimeout(() => {
      setPreLoad(false);
    }, 3000);
  };

  const deleteFoodsByResId = async (id) => {
    const res = await axios.get(
      `${apilink}/api/v1/restaurant/deleteFoodsByResId/${id}`,
      {
        headers: {
          Authorization: atokon,
        },
      }
    );
    if (res.data.success) {
      setFoods(foods.filter((v) => v.food_id != id));
    }
  };

  const getTags = (tg) => {
    let v = '';
    tg = tg.trim();

    let arr = tg.split(',');
    for (let i = 0; i < arr.length; i++) {
      // console.log(arr[arr.length - 1]);
      if (i == arr.length - 1 && arr[arr.length - 1].length == 0) {
      } else {
        v += `<span class="badge badge-pill badge-warning m-1">
      ${arr[i]}
    </span>`;
      }
    }

    return v;
  };

  const getRestuORDER = async (arr) => {
    const data = {
      list: arr,
    };
    const res = await axios.post(
      `${apilink}/api/v1/restaurant/getRestuORDER`,
      data,
      {
        headers: {
          Authorization: atokon,
        },
      }
    );
    // console.log(res.data);
    if (res.data.success) {
      setOrderForMe(res.data.result);
    } else {
    }
  };

  useEffect(() => {
    getAllFoodsByResId();
  }, []);

  return (
    <>
      <div className="home">
        {seeOrder ? (
          <>
            <div className="container">
              <div className="text-right mb-3">
                <button
                  className="btn btn-dark"
                  onClick={() => setSeeOrder(false)}
                >
                  All Items
                </button>
              </div>
              <div className="row">
                <div className="col-12">
                  <div className="table-responsive">
                    <table className="table table-bordered">
                      <thead>
                        <tr>
                          <th>Order Date</th>
                          <th>Item Details</th>
                          <th>Item Qty</th>
                          <th>User Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderforme.map((val, ind) => {
                          return (
                            <>
                              <tr key={ind}>
                                <td>{new Date(val.odate).toDateString()}</td>
                                <td>
                                  <img
                                    src={val.image}
                                    className="cart_sm_img"
                                  />{' '}
                                  <br />
                                  <small>{val.title}</small>
                                </td>

                                <td>{val.foodqty}</td>
                                <td>
                                  <UserDet addid={val.address_id} />
                                </td>
                              </tr>
                            </>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="container-fluid">
              <div className="text-right mb-3">
                <button
                  className="btn btn-dark m-1"
                  onClick={() => {
                    getAllFoodsByResId();
                    setSeeOrder(true);
                  }}
                >
                  See Order
                </button>
                <button
                  className="btn btn-dark m-1"
                  onClick={() => setOpenPop(true)}
                >
                  Add Food +
                </button>
              </div>
              {preload ? (
                <>
                  <div className="row">
                    {Array(foods.length)
                      .fill(1)
                      .map((v, ind) => {
                        return (
                          <>
                            <SkeletonTheme
                              baseColor="#f2f0eb"
                              highlightColor="#e0dcd1"
                            >
                              <div
                                className="col-lg-3 col-md-4 col-sm-6 col-12 mb-3"
                                key={ind}
                              >
                                <div className="card p-2">
                                  <Skeleton height={250} />
                                  <div className="p-2 card_text">
                                    <Skeleton height={30} width={100} />
                                    <Skeleton height={25} width={50} />
                                    <Skeleton height={25} />
                                    <Skeleton height={25} />
                                    <Skeleton height={50} width={50} />
                                  </div>
                                </div>
                              </div>
                            </SkeletonTheme>
                          </>
                        );
                      })}
                  </div>
                </>
              ) : (
                <>
                  <div className="row">
                    {foods.map((v, ind) => {
                      return (
                        <>
                          <div
                            className="col-lg-3 col-md-4 col-sm-6 col-12 mb-3"
                            key={ind}
                          >
                            <div className="card p-2">
                              <img src={v.image} alt="" className="home_img" />
                              <div className="p-2 card_text">
                                <h4>{v.title}</h4>
                                <h5> ₹{v.price}</h5>
                                <p className="m-0">{v.description}</p>
                                <div className="">{parse(getTags(v.tags))}</div>
                                <button
                                  className="btn btn-primary m-1"
                                  onClick={() => deleteFoodsByResId(v.food_id)}
                                >
                                  {' '}
                                  <i class="bx bx-trash"></i>
                                </button>
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {openpop && (
        <div className="modbox">
          <div className="smbox">
            <div className="cross" onClick={() => setOpenPop(false)}>
              <i class="bx bx-x"></i>
            </div>
            <h4>Add Food</h4>
            <br />
            <form onSubmit={addFood}>
              <div class="form-group">
                <input
                  type="text"
                  name="title"
                  placeholder="Enter Food Name"
                  class="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div class="form-group">
                <input
                  type="text"
                  class="form-control"
                  name="price"
                  placeholder="Enter Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
              <div class="form-group">
                <input
                  type="text"
                  class="form-control"
                  name="tags"
                  placeholder="Enter Tags"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  required
                />
              </div>
              <div class="form-group">
                <input
                  type="text"
                  class="form-control"
                  name="image"
                  placeholder="Enter Image Url"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  required
                />
              </div>

              <div class="form-group">
                <textarea
                  name="address"
                  id=""
                  class="form-control"
                  rows="3"
                  placeholder="Enter Food Desc"
                  value={fdesc}
                  onChange={(e) => setFDesc(e.target.value)}
                  required
                ></textarea>
              </div>
              <div className="text-center">
                <button className="btn btn-dark">Add Food</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
