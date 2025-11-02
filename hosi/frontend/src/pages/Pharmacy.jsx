// Pharmacy.jsx
import React, { useState, useEffect, useRef } from "react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const Pharmacy = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [medicines, setMedicines] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [cart, setCart] = useState({}); // keyed by id
  const [showModal, setShowModal] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentDone, setPaymentDone] = useState(false);

  const [patientName, setPatientName] = useState("");
  const [patientProblem, setPatientProblem] = useState("");
  const [consultDoctor, setConsultDoctor] = useState("");
  const [showGenerateOption, setShowGenerateOption] = useState(false); // appears when customer wants receipt

  const receiptRef = useRef(null);

  const TAX = 0.18; // GST 18%
  const DISCOUNT = 0.0; // no discount by default, change if needed

  // load 30 medicines (from your earlier list)
  useEffect(() => {
    async function loadMedicines() {
      await new Promise((res) => setTimeout(res, 400));
      const data = [
        { id: 1, name: "Advil (Ibuprofen)", form: "Tablet", ndc: "0021-0150-01", price: 7.99 },
        { id: 2, name: "Tylenol (Acetaminophen)", form: "Capsule", ndc: "50580-001-01", price: 5.25 },
        { id: 3, name: "Lipitor (Atorvastatin)", form: "Tablet", ndc: "0071-0155-23", price: 25.50 },
        { id: 4, name: "Norvasc (Amlodipine)", form: "Tablet", ndc: "0069-0030-30", price: 18.75 },
        { id: 5, name: "Pepcid AC (Famotidine)", form: "Tablet", ndc: "50580-025-01", price: 11.20 },
        { id: 6, name: "Omeprazole 20mg", form: "Capsule", ndc: "0206-9112-01", price: 15.99 },
        { id: 7, name: "Metformin 500mg", form: "Tablet", ndc: "55154-5723-01", price: 13.25 },
        { id: 8, name: "Azithromycin 250mg", form: "Tablet", ndc: "43598-276-06", price: 42.50 },
        { id: 9, name: "Augmentin (Amoxicillin + Clavulanate)", form: "Tablet", ndc: "43598-022-07", price: 59.99 },
        { id: 10, name: "Cetirizine 10mg", form: "Tablet", ndc: "59746-133-20", price: 6.75 },
        { id: 11, name: "Zyrtec (Cetirizine)", form: "Capsule", ndc: "50580-237-02", price: 14.40 },
        { id: 12, name: "Salbutamol Inhaler", form: "Inhaler", ndc: "0031-0640-81", price: 32.99 },
        { id: 13, name: "Ventolin HFA", form: "Inhaler", ndc: "0006-0034-21", price: 41.99 },
        { id: 14, name: "Paracetamol 500mg", form: "Tablet", ndc: "0093-7242-01", price: 4.99 },
        { id: 15, name: "Insulin Glargine", form: "Injection", ndc: "0002-8215-01", price: 112.00 },
        { id: 16, name: "Prednisone 10mg", form: "Tablet", ndc: "00093-3124-01", price: 9.50 },
        { id: 17, name: "Amoxicillin 500mg", form: "Capsule", ndc: "00143-1262-01", price: 18.25 },
        { id: 18, name: "Dolo 650mg", form: "Tablet", ndc: "39769-650-01", price: 3.50 },
        { id: 19, name: "Aspirin 75mg", form: "Tablet", ndc: "0064-3141-10", price: 6.99 },
        { id: 20, name: "Montelukast 10mg", form: "Tablet", ndc: "00378-5040-93", price: 17.20 },
        { id: 21, name: "Diclofenac Gel 1%", form: "Gel", ndc: "00548-0200-05", price: 12.99 },
        { id: 22, name: "Cough Syrup (Dextromethorphan)", form: "Syrup", ndc: "51079-588-20", price: 9.75 },
        { id: 23, name: "Benadryl (Diphenhydramine)", form: "Syrup", ndc: "50580-729-10", price: 6.40 },
        { id: 24, name: "ORS Oral Rehydration Salt", form: "Sachet", ndc: "59088-0001-01", price: 2.90 },
        { id: 25, name: "Zincovit Multivitamin", form: "Tablet", ndc: "59406-151-01", price: 23.10 },
        { id: 26, name: "B Complex Syrup", form: "Syrup", ndc: "68084-098-01", price: 7.80 },
        { id: 27, name: "Erythromycin 250mg", form: "Tablet", ndc: "70771-001-01", price: 21.99 },
        { id: 28, name: "Folic Acid 5mg", form: "Tablet", ndc: "0054-4567-01", price: 8.10 },
        { id: 29, name: "Cyclopam (Dicyclomine)", form: "Tablet", ndc: "68180-111-01", price: 5.45 },
        { id: 30, name: "Calpol 120mg", form: "Syrup", ndc: "59088-0105-02", price: 4.50 }
      ];
      setMedicines(data);
      setFiltered(data);
    }
    loadMedicines();
  }, []);

  // filter
  useEffect(() => {
    setFiltered(
      medicines.filter((m) =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (m.ndc || "").toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm, medicines]);

  // add to cart (functional update)
  const addToCart = (item, e) => {
    if (e) e.stopPropagation();
    setCart((prev) => {
      const exists = prev[item.id];
      return {
        ...prev,
        [item.id]: exists ? { ...exists, qty: exists.qty + 1 } : { ...item, qty: 1 }
      };
    });
  };

  // update qty (functional update)
  const updateQty = (id, change, e) => {
    if (e) e.stopPropagation();
    setCart((prev) => {
      const current = prev[id];
      if (!current) return prev;
      const updated = { ...prev };
      const newQty = current.qty + change;
      if (newQty <= 0) {
        delete updated[id];
      } else {
        updated[id] = { ...current, qty: newQty };
      }
      return updated;
    });
  };

  // remove item
  const removeItem = (id, e) => {
    if (e) e.stopPropagation();
    setCart((prev) => {
      const updated = { ...prev };
      delete updated[id];
      return updated;
    });
  };

  const subtotal = Object.values(cart).reduce((s, i) => s + i.qty * i.price, 0);
  const discount = subtotal * DISCOUNT;
  const taxable = subtotal - discount;
  const tax = taxable * TAX;
  const total = taxable + tax;

  // Payment (simulate)
  const processPayment = () => {
    if (Object.keys(cart).length === 0) return;
    setIsPaying(true);
    // 2s processing
    setTimeout(() => {
      setIsPaying(false);
      setPaymentDone(true);
      // DO NOT auto-download. instead show generate option if customer wants
      setShowGenerateOption(false); // hide until customer explicitly requests
      setShowModal(false);
    }, 2000);
  };

  // create single-page PDF using html2canvas + jsPDF
  const generateAndDownloadPDF = async () => {
    // Build some dynamic values for receipt
    const now = new Date();
    const admissionDate = now.toLocaleDateString();
    const admissionTime = now.toLocaleTimeString();
    const discharge = new Date(now.getTime() + 2 * 60 * 60 * 1000); // +2 hours
    const dischargeTime = discharge.toLocaleTimeString();

    // Create a receipt DOM node (off-screen) or use a ref'ed element
    // We'll render the receipt in the page (hidden) via receiptRef and then capture it.
    // Fill receipt data into hidden div before converting
    // Populate fields directly by writing innerHTML to the receipt container
    const receiptNode = receiptRef.current;
    if (!receiptNode) return;

    // Fill receiptNode with HTML (styled)
    const hospital = {
      name: "CityCare Hospital",
      logoUrl: "", // you can put a logo URL or keep empty for text logo
      branch: "Main Street Branch",
      address: "123 Health Avenue, Cityville, State - 12345",
      phone: "+91 98765 43210",
      email: "contact@citycare.example"
    };

    // Construct medicines table rows
    const rowsHtml = Object.values(cart).map((c) => {
      const lineTotal = (c.price * c.qty).toFixed(2);
      return `<tr>
        <td style="padding:6px;border:1px solid #ddd;">${c.name}</td>
        <td style="padding:6px;border:1px solid #ddd;text-align:right;">$${c.price.toFixed(2)}</td>
        <td style="padding:6px;border:1px solid #ddd;text-align:center;">${c.qty}</td>
        <td style="padding:6px;border:1px solid #ddd;text-align:right;">$${lineTotal}</td>
      </tr>`;
    }).join("");

    // Prepare receipt HTML
    const receiptHtml = `
      <div style="width: 800px; background: #fff; padding: 20px; font-family: Arial, sans-serif; color: #222;">
        <div style="border-top: 6px solid #0ea5e9; padding-top: 12px; text-align: center;">
          ${hospital.logoUrl ? `<img src="${hospital.logoUrl}" style="width:80px;height:80px;display:block;margin:0 auto;" />` : `<div style="font-size:36px; font-weight:700;">🏥</div>`}
          <h1 style="margin:6px 0 0 0; font-size:20px;">${hospital.name}</h1>
          <p style="margin:2px 0 6px 0; font-size:13px; color:#444;">${hospital.branch} • ${hospital.address}</p>
          <p style="margin:0; font-size:12px; color:#444;">Phone: ${hospital.phone} • Email: ${hospital.email}</p>
        </div>

        <hr style="margin:12px 0 18px 0; border:none; border-top:1px solid #eee;" />

        <div style="display:flex; justify-content:space-between; margin-bottom:10px;">
          <div>
            <strong>Patient:</strong> ${patientName || "Guest Patient"}<br/>
            <strong>Problem:</strong> ${patientProblem || "N/A"}<br/>
            <strong>Doctor:</strong> ${consultDoctor || "N/A"}
          </div>
          <div style="text-align:right;">
            <strong>Receipt:</strong> RCPT-${Date.now()}<br/>
            <strong>Admission:</strong> ${admissionDate} ${admissionTime}<br/>
            <strong>Discharge:</strong> ${discharge.toLocaleDateString()} ${dischargeTime}
          </div>
        </div>

        <div style="margin-top:6px;">
          <table style="width:100%; border-collapse:collapse; font-size:13px;">
            <thead>
              <tr>
                <th style="padding:8px;border:1px solid #ddd;background:#f7f7f7;text-align:left;">Medicine</th>
                <th style="padding:8px;border:1px solid #ddd;background:#f7f7f7;text-align:right;">Price</th>
                <th style="padding:8px;border:1px solid #ddd;background:#f7f7f7;text-align:center;">Qty</th>
                <th style="padding:8px;border:1px solid #ddd;background:#f7f7f7;text-align:right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml || `<tr><td colspan="4" style="padding:10px;border:1px solid #ddd;text-align:center;color:#777;">No items</td></tr>`}
            </tbody>
          </table>
        </div>

        <div style="margin-top:12px; display:flex; justify-content:flex-end;">
          <div style="width:320px;">
            <div style="display:flex;justify-content:space-between;padding:6px 0;"><span>Subtotal</span><strong>$${subtotal.toFixed(2)}</strong></div>
            <div style="display:flex;justify-content:space-between;padding:6px 0;"><span>Discount</span><strong>-$${discount.toFixed(2)}</strong></div>
            <div style="display:flex;justify-content:space-between;padding:6px 0;"><span>Tax (GST ${Math.round(TAX * 100)}%)</span><strong>$${tax.toFixed(2)}</strong></div>
            <div style="border-top:2px solid #eee;margin-top:6px;padding-top:8px;display:flex;justify-content:space-between;"><span style="font-size:16px;">Total Paid</span><strong style="font-size:16px;color:#0b74c9;">$${total.toFixed(2)}</strong></div>
          </div>
        </div>

        <hr style="margin:16px 0;border:none;border-top:1px dashed #ddd;" />

        <div style="font-size:12px;color:#555; text-align:center;">
          <div>Payment Method: Simulated / Cash</div>
          <div style="margin-top:6px;">This is a system-generated receipt. Please retain for future reference.</div>
        </div>
      </div>
    `;

    receiptNode.innerHTML = receiptHtml;

    // Wait a tick for DOM to update
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Capture the receipt node as canvas
    const canvas = await html2canvas(receiptNode, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff"
    });

    const imgData = canvas.toDataURL("image/png");

    // Create PDF and fit single page (A4)
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "pt",
      format: "a4"
    });

    // a4 size in pts
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Calculate image dimensions to fit width (with small margins)
    const margin = 20;
    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pageWidth - margin * 2;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    // If the rendered content is taller than page, scale down to fit one page
    let finalHeight = imgHeight;
    let finalWidth = imgWidth;
    if (imgHeight > pageHeight - margin * 2) {
      const scale = (pageHeight - margin * 2) / imgHeight;
      finalHeight = imgHeight * scale;
      finalWidth = imgWidth * scale;
    }

    pdf.addImage(imgData, "PNG", margin, margin, finalWidth, finalHeight);
    pdf.save(`CityCare_receipt_${Date.now()}.pdf`);
  };

  // UI
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">CityCare / MediMart Pharmacy</h1>

        {/* Search */}
        <div className="mb-6">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search medicines or NDC..."
            className="w-full md:w-2/3 p-3 rounded-lg border shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* medicine grid */}
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 p-6 bg-white rounded shadow">No medicines found</div>
            ) : (
              filtered.map((m) => (
                <div key={m.id} className="bg-white p-4 rounded-lg shadow medicine-card border">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-lg">{m.name}</h3>
                      <p className="text-sm text-gray-500">Form: {m.form} • NDC: {m.ndc}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-blue-600 font-bold text-xl">${m.price.toFixed(2)}</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={(e) => addToCart(m, e)}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg button-hover-effect"
                    >
                      Add to cart
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* cart */}
          <div className="bg-white rounded-lg p-4 shadow sticky top-6">
            <h2 className="text-xl font-bold mb-3">Cart</h2>

            {Object.keys(cart).length === 0 ? (
              <p className="text-gray-500">Your cart is empty</p>
            ) : (
              <>
                <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                  {Object.values(cart).map((c) => (
                    <div key={c.id} className="flex justify-between items-center p-2 border rounded">
                      <div>
                        <div className="font-semibold">{c.name}</div>
                        <div className="text-sm text-gray-500">${c.price.toFixed(2)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => updateQty(c.id, -1, e)}
                          className="bg-gray-200 w-8 h-8 rounded"
                        >
                          -
                        </button>
                        <div className="px-2">{c.qty}</div>
                        <button
                          onClick={(e) => updateQty(c.id, 1, e)}
                          className="bg-gray-200 w-8 h-8 rounded"
                        >
                          +
                        </button>
                        <button
                          onClick={(e) => removeItem(c.id, e)}
                          className="text-red-500 ml-2"
                          title="Remove"
                        >
                          🗑
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <hr className="my-3" />

                <div className="text-right space-y-1">
                  <div>Subtotal: <b>${subtotal.toFixed(2)}</b></div>
                  <div>Discount: <b>-${discount.toFixed(2)}</b></div>
                  <div>GST ({Math.round(TAX * 100)}%): <b>${tax.toFixed(2)}</b></div>
                  <div className="text-xl font-bold">Total: ${total.toFixed(2)}</div>
                </div>

                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => setShowModal(true)}
                    className="w-full bg-green-600 text-white py-2 rounded-lg"
                    disabled={Object.keys(cart).length === 0}
                  >
                    Proceed to Pay
                  </button>

                  {paymentDone && (
                    <div className="mt-2">
                      <button
                        onClick={() => setShowGenerateOption((s) => !s)}
                        className="w-full border border-blue-600 text-blue-600 py-2 rounded-lg"
                      >
                        {showGenerateOption ? "Hide Receipt Option" : "Generate / Download Receipt (PDF)"}
                      </button>
                    </div>
                  )}

                  {showGenerateOption && paymentDone && (
                    <div className="mt-2">
                      <div className="text-sm text-gray-600 mb-2">Click below to generate a single-page PDF receipt.</div>
                      <button
                        onClick={generateAndDownloadPDF}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg"
                      >
                        Download Receipt (PDF)
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* payment modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
              {!paymentDone ? (
                <>
                  <h3 className="text-2xl font-bold mb-3 text-center">Enter Patient & Consultation Details</h3>

                  <input
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Patient Name"
                    className="w-full border p-2 rounded mb-2"
                  />
                  <input
                    value={patientProblem}
                    onChange={(e) => setPatientProblem(e.target.value)}
                    placeholder="Patient Problem / Symptoms"
                    className="w-full border p-2 rounded mb-2"
                  />
                  <input
                    value={consultDoctor}
                    onChange={(e) => setConsultDoctor(e.target.value)}
                    placeholder="Consulted Doctor (Name & Dept)"
                    className="w-full border p-2 rounded mb-4"
                  />

                  {!isPaying ? (
                    <button
                      onClick={processPayment}
                      className="w-full bg-blue-600 text-white py-2 rounded-lg"
                    >
                      Pay ${total.toFixed(2)}
                    </button>
                  ) : (
                    <div className="text-center py-3">
                      <div className="inline-block loading-spinner mr-2" style={{ width: 28, height: 28, borderWidth: 4 }}></div>
                      <div className="text-blue-600 font-medium">Processing Payment...</div>
                    </div>
                  )}

                  <button
                    onClick={() => setShowModal(false)}
                    className="w-full mt-3 text-gray-600"
                    disabled={isPaying}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-green-600 mb-3 text-center">Payment Successful ✅</h3>
                  <p className="text-center text-gray-700 mb-4">If you want a receipt, click "Generate / Download Receipt" from the cart area.</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => { setShowModal(false); }}
                      className="flex-1 bg-gray-600 text-white py-2 rounded"
                    >
                      Close
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Hidden receipt element for PDF capture */}
        <div style={{ position: "fixed", left: -9999, top: -9999 }} aria-hidden>
          <div ref={receiptRef} />
        </div>
      </div>
    </div>
  );
};

export default Pharmacy;
