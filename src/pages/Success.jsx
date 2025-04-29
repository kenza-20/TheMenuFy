import { useEffect } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useNavigate } from "react-router-dom";
import swal from "sweetalert";

const Success = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("invoiceData");

    if (stored) {
      const { selectedMeals, total } = JSON.parse(stored);

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
    } else {
      swal("Error", "No invoice data found. Please try again.", "error");
      navigate("/"); // Redirect to homepage if no data
    }
  }, [navigate]);

  return (
    <div className="relative min-h-screen flex flex-col">
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-[url('/bg.jpg')] bg-cover bg-center -z-10">
          <div className="absolute inset-0 bg-black/40" />
        </div>
        <div className="relative z-10 text-white">
          <h1 className="text-3xl font-bold">Thank You for Your Purchase!</h1>
          <p className="mt-2">Your payment was successful, and your invoice is being downloaded.</p>
        </div>
      </section>
    </div>
  );
};

export default Success;
