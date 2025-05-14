import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Users } from 'lucide-react';

const ActiveGroupOrdersButton = () => {
  const [activeOrders, setActiveOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  
  const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  
  useEffect(() => {
    const fetchActiveOrders = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/api/group-orders/user/${userId}`);
        
        if (response.data.success) {
          const active = response.data.groupOrders.filter((order:any) => order.status === 'active');
          setActiveOrders(active);
        }
      } catch (error) {
        console.error('Failed to fetch active group orders:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchActiveOrders();
    
    // Refresh every minute to keep the list updated
    const interval = setInterval(fetchActiveOrders, 60000);
    return () => clearInterval(interval);
  }, [userId]);
  
  if (activeOrders.length === 0 && !loading) {
    return null; // Don't show the button if there are no active orders
  }
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="cursor-pointer flex items-center text-green-400 hover:text-green-500"
      >
        <Users className="h-4 w-4" />
        <span>Active Group Orders ({activeOrders.length})</span>
      </button>
      
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white/10 backdrop-blur-lg border border-white/10 rounded-lg shadow-xl z-10">
          <div className="py-1">
            {loading ? (
              <div className="px-4 py-3 text-white text-center">
                Loading...
              </div>
            ) : (
              activeOrders.map((order:any) => (
                <button
                  key={order._id}
                  onClick={() => {
                    setIsDropdownOpen(false);
                    localStorage.setItem('currentGroupOrder', order.code);
                    navigate(`/group-order/${order.code}`);
                  }}
                  className="flex items-center justify-between w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors"
                >
                  <div>
                    <div className="font-medium">{order.name}</div>
                    <div className="text-xs text-white/70">Code: {order.code}</div>
                  </div>
                  <div className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                    Active
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveGroupOrdersButton;