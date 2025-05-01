import { useEffect, useRef } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";
import axios from "axios";

const Success = () => {
  const navigate = useNavigate();
  const hasRun = useRef(false); // 🛡️ Flag to avoid duplicate runs

  const id_user = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    if (hasRun.current) return; // 🛑 Block second run
    hasRun.current = true;

    const stored = localStorage.getItem("invoiceData");

    if (stored) {
      const { selectedMeals, total } = JSON.parse(stored);

      const order = {
        userId: id_user,
        items: selectedMeals,
        total,
      };

      const doc = new jsPDF();
      const now = new Date();
      const formattedDate = now.toLocaleDateString();
      const formattedTime = now.toLocaleTimeString();

      doc.setFontSize(18);
      doc.text("Invoice", 14, 22);

      doc.setFontSize(11);
      doc.text(`Date: ${formattedDate}   Time: ${formattedTime}`, 14, 27);

      autoTable(doc, {
        startY: 30,
        head: [["Meal", "Quantity", "Price (CAD)", "Subtotal"]],
        body: selectedMeals.map(item => [
          item.name,
          item.quantity,
          `$${item.price.toFixed(2)}`,
          `$${item.subtotal}`
        ])
      });

      doc.text(`Total: $${total}`, 14, doc.lastAutoTable.finalY + 10);

      // 🧾 Save the invoice
      doc.save("invoice.pdf");

      // ✅ Show success alert and navigate after confirmation
      swal("Success", "Payment successful! Your invoice is downloading...", "success")
          .then(() => {
            navigate("/"); // ⬅️ Redirect to homepage after user clicks OK
          });

      // If the user exists, proceed with the order processing
      if (id_user) {
        axios.delete(`http://localhost:3000/api/orders/${id_user}`)
            .then(() => console.log("Orders cleared."))
            .catch(err => console.error("Error clearing orders:", err));

        axios.post("http://localhost:3000/api/placedOrders/create", order)
            .then(() => {
              console.log("Order saved");

              // Now, send the notification to the chef after PDF download
              selectedMeals.forEach(item => {
                const notification = {
                  itemName: item.name,
                  itemQuantity: item.quantity,
                  chefid: "66144efc1d9c8c7d9d05dc94",
                  restoid: "66144efc1d9c8c7d9d05dc99",
                };

                // Send notification to chef via an API
                axios.post("http://localhost:3000/api/notifications/send", notification)
                    .then((response) => {
                      console.log("Notification sent to chef:", response.data);
                    })
                    .catch((error) => {
                      console.error("Error sending notification to chef:", error);
                    });
              });

            })
            .catch((error) => {
              console.error("Error saving order:", error);
            });
      }
    }
  }, [navigate]);

  return (
      <div className="relative min-h-screen flex flex-col">
        <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center text-center">
          <div className="absolute inset-0 bg-[url('/bg.jpg')] bg-cover bg-center -z-10">
            <div className="absolute inset-0 bg-black/40" />
          </div>
        </section>
      </div>
  );
};

export default Success;