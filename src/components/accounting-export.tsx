import { useState } from "react"
import { Download, FileText, FileSpreadsheet, Filter, Calendar, X, Check } from 'lucide-react'
import { jsPDF } from "jspdf"
import autoTable from "jspdf-autotable"
import Swal from "sweetalert2"

interface OrderItem {
  name: string
  quantity: number
  price: number
  subtotal: number
  image?: string
  price_id?: string
  description?: string
}

interface Order {
  id: string
  date: string
  time: string
  rawDate: Date
  items: OrderItem[]
  total: number
  noteCommande?: string
}

interface AccountingExportProps {
  orders: Order[]
  filteredOrders: Order[]
}

const AccountingExport = ({ orders, filteredOrders }: AccountingExportProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: "", end: "" })
  const [minAmount, setMinAmount] = useState("")
  const [maxAmount, setMaxAmount] = useState("")
  const [exportFormat, setExportFormat] = useState<"pdf" | "csv">("pdf")
  const [includeDetails, setIncludeDetails] = useState(true)
  const [groupBy, setGroupBy] = useState<"none" | "day" | "month">("none")
  const [isExporting, setIsExporting] = useState(false)

  // Apply advanced filters to orders
  const getFilteredOrdersForExport = () => {
    let result = filteredOrders.length > 0 ? [...filteredOrders] : [...orders]

    // Apply date range filter if provided
    if (dateRange.start && dateRange.end) {
      const startDate = new Date(dateRange.start)
      const endDate = new Date(dateRange.end)
      endDate.setHours(23, 59, 59, 999) // Include the entire end day

      result = result.filter((order) => {
        const orderDate = new Date(order.rawDate)
        return orderDate >= startDate && orderDate <= endDate
      })
    }

    // Apply amount filters if provided
    if (minAmount) {
      result = result.filter((order) => order.total >= parseFloat(minAmount))
    }

    if (maxAmount) {
      result = result.filter((order) => order.total <= parseFloat(maxAmount))
    }

    return result
  }

  // Group orders by day or month for accounting purposes
  const groupOrders = (ordersToGroup: Order[]) => {
    if (groupBy === "none") return ordersToGroup

    const grouped: Record<string, { orders: Order[]; total: number }> = {}

    ordersToGroup.forEach((order) => {
      const date = new Date(order.rawDate)
      let key: string

      if (groupBy === "day") {
        key = date.toISOString().split("T")[0] // YYYY-MM-DD
      } else {
        // month
        key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}` // YYYY-MM
      }

      if (!grouped[key]) {
        grouped[key] = { orders: [], total: 0 }
      }

      grouped[key].orders.push(order)
      grouped[key].total += order.total
    })

    return grouped
  }

  // Generate PDF with accounting data
  const generateAccountingPDF = (ordersToExport: Order[]) => {
    const doc = new jsPDF()
    const now = new Date()
    const formattedDate = now.toLocaleDateString()
    const formattedTime = now.toLocaleTimeString()

    // Add header
    doc.setFontSize(18)
    doc.text("Accounting Report", 14, 22)

    doc.setFontSize(11)
    doc.text(`Generated on: ${formattedDate} at ${formattedTime}`, 14, 30)
    doc.text(`Total Orders: ${ordersToExport.length}`, 14, 36)
    doc.text(
      `Total Revenue: $${ordersToExport.reduce((sum, order) => sum + order.total, 0).toFixed(2)}`,
      14,
      42
    )

    if (groupBy !== "none") {
      const grouped = groupOrders(ordersToExport)
      const groupedData = Object.entries(grouped).map(([period, data]) => [
        period,
        data.orders.length,
        `$${data.total.toFixed(2)}`,
      ])

      // Add summary table by period
      autoTable(doc, {
        startY: 50,
        head: [["Period", "Number of Orders", "Total Revenue"]],
        body: groupedData,
      })

      // If details are requested, add individual orders after the summary
      if (includeDetails) {
        doc.addPage()
        doc.setFontSize(16)
        doc.text("Detailed Orders", 14, 20)
      }
    }

    // If not grouping or details are requested, add individual orders
    if (groupBy === "none" || includeDetails) {
      const tableData = ordersToExport.map((order) => [
        order.id.slice(-6),
        order.date,
        order.time,
        order.items.length,
        `$${order.total.toFixed(2)}`,
      ])

      autoTable(doc, {
        startY: groupBy !== "none" ? 30 : 50,
        head: [["Order ID", "Date", "Time", "Items", "Total"]],
        body: tableData,
      })

      // Add item details if requested
      if (includeDetails) {
        let currentY = doc.lastAutoTable?.finalY || 50

        ordersToExport.forEach((order, index) => {
          // Check if we need a new page
          if (currentY > doc.internal.pageSize.height - 60) {
            doc.addPage()
            currentY = 20
          }

          currentY += 10
          doc.setFontSize(12)
          doc.text(`Order #${order.id.slice(-6)} Details:`, 14, currentY)
          currentY += 5

          const itemsData = order.items.map((item) => [
            item.name,
            item.quantity,
            `$${item.price.toFixed(2)}`,
            `$${item.subtotal.toFixed(2)}`,
          ])

          autoTable(doc, {
            startY: currentY,
            head: [["Item", "Quantity", "Price", "Subtotal"]],
            body: itemsData,
            margin: { left: 20 },
            tableWidth: 170,
          })

          currentY = doc.lastAutoTable?.finalY || currentY + 20
        })
      }
    }

    // Generate filename based on filters
    let filename = "accounting-report"
    if (dateRange.start && dateRange.end) {
      filename += `_${dateRange.start}_to_${dateRange.end}`
    }
    filename += ".pdf"

    doc.save(filename)
  }

  // Generate CSV with accounting data
  const generateAccountingCSV = (ordersToExport: Order[]) => {
    let csvContent = "data:text/csv;charset=utf-8,"

    // Add headers
    if (groupBy !== "none") {
      csvContent += "Period,Number of Orders,Total Revenue\n"

      // Add grouped data
      const grouped = groupOrders(ordersToExport)
      Object.entries(grouped).forEach(([period, data]) => {
        csvContent += `${period},${data.orders.length},$${data.total.toFixed(2)}\n`
      })

      // Add separator if including details
      if (includeDetails) {
        csvContent += "\n\nDetailed Orders:\n"
      }
    }

    // Add individual orders if not grouping or details are requested
    if (groupBy === "none" || includeDetails) {
      csvContent += "Order ID,Date,Time,Number of Items,Total\n"

      ordersToExport.forEach((order) => {
        csvContent += `${order.id.slice(-6)},${order.date},${order.time},${order.items.length},$${order.total.toFixed(
          2
        )}\n`
      })

      // Add item details if requested
      if (includeDetails) {
        csvContent += "\n\nOrder Details:\n"
        csvContent += "Order ID,Item Name,Quantity,Price,Subtotal\n"

        ordersToExport.forEach((order) => {
          order.items.forEach((item) => {
            csvContent += `${order.id.slice(-6)},${item.name},${item.quantity},$${item.price.toFixed(
              2
            )},$${item.subtotal.toFixed(2)}\n`
          })
        })
      }
    }

    // Create download link
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    
    // Generate filename based on filters
    let filename = "accounting-report"
    if (dateRange.start && dateRange.end) {
      filename += `_${dateRange.start}_to_${dateRange.end}`
    }
    filename += ".csv"
    
    link.setAttribute("download", filename)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleExport = async () => {
    const ordersToExport = getFilteredOrdersForExport()

    if (ordersToExport.length === 0) {
      Swal.fire({
        icon: "info",
        title: "No Orders",
        text: "There are no orders matching your filter criteria.",
      })
      return
    }

    setIsExporting(true)

    try {
      if (exportFormat === "pdf") {
        generateAccountingPDF(ordersToExport)
      } else {
        generateAccountingCSV(ordersToExport)
      }

      Swal.fire({
        icon: "success",
        title: "Export Successful",
        text: `Your accounting report has been ${exportFormat === "pdf" ? "saved" : "downloaded"}.`,
      })
    } catch (error) {
      console.error("Error exporting data:", error)
      Swal.fire({
        icon: "error",
        title: "Export Failed",
        text: "There was a problem generating your report. Please try again.",
      })
    } finally {
      setIsExporting(false)
      setIsOpen(false)
    }
  }

  const resetFilters = () => {
    setDateRange({ start: "", end: "" })
    setMinAmount("")
    setMaxAmount("")
    setExportFormat("pdf")
    setIncludeDetails(true)
    setGroupBy("none")
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-full transition-colors"
      >
        <FileText className="h-4 w-4" />
        <span>Accounting Export</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-black/80 backdrop-blur-lg border border-white/10 rounded-lg shadow-xl z-20 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">Export for Accounting</h3>
            <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">Date Range</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                  className="w-full p-2 bg-white/10 text-white border border-white/20 rounded-md"
                />
                <span className="text-white self-center">to</span>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                  className="w-full p-2 bg-white/10 text-white border border-white/20 rounded-md"
                />
              </div>
            </div>

            {/* Amount Range */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">Amount Range ($)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                  className="w-full p-2 bg-white/10 text-white border border-white/20 rounded-md"
                />
                <span className="text-white self-center">to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                  className="w-full p-2 bg-white/10 text-white border border-white/20 rounded-md"
                />
              </div>
            </div>

            {/* Group By */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">Group By</label>
              <select
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value as "none" | "day" | "month")}
                className="w-full p-2 bg-black/80 text-white border border-white/20 rounded-md"
              >
                <option value="none">No Grouping</option>
                <option value="day">Day</option>
                <option value="month">Month</option>
              </select>
            </div>

            {/* Export Format */}
            <div>
              <label className="block text-sm font-medium text-white mb-1">Export Format</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={exportFormat === "pdf"}
                    onChange={() => setExportFormat("pdf")}
                    className="hidden"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border ${
                      exportFormat === "pdf" ? "border-yellow-500 bg-yellow-500" : "border-white/50"
                    } flex items-center justify-center`}
                  >
                    {exportFormat === "pdf" && <Check className="h-3 w-3 text-black" />}
                  </div>
                  <span className="text-white">PDF</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    checked={exportFormat === "csv"}
                    onChange={() => setExportFormat("csv")}
                    className="hidden"
                  />
                  <div
                    className={`w-5 h-5 rounded-full border ${
                      exportFormat === "csv" ? "border-yellow-500 bg-yellow-500" : "border-white/50"
                    } flex items-center justify-center`}
                  >
                    {exportFormat === "csv" && <Check className="h-3 w-3 text-black" />}
                  </div>
                  <span className="text-white">CSV</span>
                </label>
              </div>
            </div>

            {/* Include Details */}
            <div className="flex items-center gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeDetails}
                  onChange={() => setIncludeDetails(!includeDetails)}
                  className="hidden"
                />
                <div
                  className={`w-5 h-5 rounded border ${
                    includeDetails ? "border-yellow-500 bg-yellow-500" : "border-white/50"
                  } flex items-center justify-center`}
                >
                  {includeDetails && <Check className="h-3 w-3 text-black" />}
                </div>
                <span className="text-white">Include Item Details</span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between pt-2">
              <button
                onClick={resetFilters}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors"
              >
                Reset Filters
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className={`px-4 py-1.5 ${
                  isExporting ? "bg-yellow-500/50" : "bg-yellow-500 hover:bg-yellow-400"
                } text-black rounded-md transition-colors flex items-center gap-2`}
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-black/20 border-t-black rounded-full"></div>
                    <span>Exporting...</span>
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>Export</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountingExport
