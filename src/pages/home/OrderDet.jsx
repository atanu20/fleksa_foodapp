import React from 'react';
import { NavLink, useParams } from 'react-router-dom';

const OrderDet = () => {
  const { orderid } = useParams();
  return (
    <>
      <div className="home">
        <div className="container">
          <h3 className="mt-4 mb-4">Order Details</h3>
          <div className="row">
            <div class="form-group">
              <select class="form-control" id="sel1" style={{ width: '150px' }}>
                <option value="OrderPlaced">Order Placed</option>
                <option value="OnProgress">OnProgress</option>
                <option value="Delivery">Out For Delivery</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>
          <div className="row">
            <div className="table-responsive">
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Order Date</th>
                    <th>Details</th>
                    <th>Price</th>
                    <th>Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map((val, ind) => {
                    return (
                      <>
                        <tr key={ind}>
                          <td>123</td>
                          <td>12/2/2023</td>

                          <td>
                            <img
                              src="http://localhost:4552/image/food3.jpg"
                              className="cart_sm_img"
                            />{' '}
                            <br />
                            <small>Lorem, ipsum dolor.</small>
                          </td>
                          <td>₹ 150.00</td>
                          <td>2</td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="text-right">
            <NavLink to="/" className="btn btn-dark">
              Go Back
            </NavLink>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDet;
