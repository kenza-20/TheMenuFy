import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ViewCart = () => {
  const { userId } = useParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    axios.get(`http://localhost:3000/api/orders/${userId}`)
      .then(res => {
        setOrders(res.data);
      })
      .catch(err => {
        console.error("Error fetching orders:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-md mt-10">
      <h1 className="text-2xl font-bold mb-4">Cart for User {userId}</h1>
      {orders.length === 0 ? (
        <p>No items found in this cart.</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-2">Meal</th>
              <th className="p-2">Quantity</th>
              <th className="p-2">Price</th>
              <th className="p-2">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={idx} className="border-t">
                <td className="p-2">{order.name}</td>
                <td className="p-2">{order.quantity}</td>
                <td className="p-2">${order.price}</td>
                <td className="p-2">${(order.quantity * order.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewCart;
