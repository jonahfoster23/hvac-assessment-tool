import { useState } from "react"

const createBlankEquipment = () => ({
  id: crypto.randomUUID(),
  tag: "",
  type: "",
  manufacturer: "",
  model: "",
  age: "",
  condition: "",
  mechanicalNotes: "",
  controlsNotes: "",
  deficiencies: "",
  recommendations: "",
  photoFileNames: [],
  checks: {
    cooling: false,
    heating: false,
    economizer: false,
    filters: false,
    belts: false,
    controls: false,
  },
})

const equipmentTypes = [
  "RTU",
  "AHU",
  "Split System",
  "Chiller",
  "Boiler",
  "VAV",
  "Exhaust Fan",
  "Pump",
  "Fan Coil Unit"
  "MAU"
  "ERV"
  "Cooling Tower"
  "Other",
]

const conditionRatings = ["Excellent", "Good", "Fair", "Poor", "Critical"]

const operationalChecks = [
  ["cooling", "Cooling Operational"],
  ["heating", "Heating Operational"],
  ["economizer", "Economizer Functional"],
  ["filters", "Filters Acceptable"],
  ["belts", "Belts Acceptable"],
  ["controls", "Controls Functional"],
]

export default function App() {
  const [site, setSite] = useState({
    customer: "",
    address: "",
    date: "",
    technician: "",
  })

  const [equipmentList, setEquipmentList] = useState([createBlankEquipment()])

  const updateSite = (field, value) => {
    setSite((currentSite) => ({ ...currentSite, [field]: value }))
  }

  const addEquipment = () => {
    setEquipmentList((currentList) => [...currentList, createBlankEquipment()])
  }

  const removeEquipment = (id) => {
    setEquipmentList((currentList) => {
      if (currentList.length === 1) return currentList
      return currentList.filter((equipment) => equipment.id !== id)
    })
  }

  const updateEquipment = (id, field, value) => {
    setEquipmentList((currentList) =>
      currentList.map((equipment) =>
        equipment.id === id ? { ...equipment, [field]: value } : equipment
      )
    )
  }

  const updateOperationalCheck = (id, checkKey, value) => {
    setEquipmentList((currentList) =>
      currentList.map((equipment) =>
        equipment.id === id
          ? {
              ...equipment,
              checks: {
                ...equipment.checks,
                [checkKey]: value,
              },
            }
          : equipment
      )
    )
  }

  const updatePhotoFileNames = (id, files) => {
    const fileNames = Array.from(files || []).map((file) => file.name)
    updateEquipment(id, "photoFileNames", fileNames)
  }

  const valueOrDash = (value) => value || "—"

  const formatCheck = (checked) => (checked ? "Yes" : "No / Not Verified")

  const generatePreliminaryReport = () => {
    const reportWindow = window.open("", "_blank")

    if (!reportWindow) {
      alert("Please allow pop-ups so the preliminary PDF report can open.")
      return
    }

    const equipmentSections = equipmentList
      .map((equipment, index) => {
        const operationalRows = operationalChecks
          .map(
            ([key, label]) => `
              <tr>
                <td>${label}</td>
                <td>${formatCheck(equipment.checks[key])}</td>
              </tr>
            `
          )
          .join("")

        const photoList = equipment.photoFileNames.length
          ? equipment.photoFileNames.map((name) => `<li>${name}</li>`).join("")
          : "<li>No photos selected in field form.</li>"

        return `
          <section class="equipment-section">
            <h2>Equipment #${index + 1}: ${valueOrDash(equipment.tag)}</h2>

            <table>
              <tr><th>Equipment Type</th><td>${valueOrDash(equipment.type)}</td></tr>
              <tr><th>Manufacturer</th><td>${valueOrDash(equipment.manufacturer)}</td></tr>
              <tr><th>Model Number</th><td>${valueOrDash(equipment.model)}</td></tr>
              <tr><th>Approximate Age</th><td>${valueOrDash(equipment.age)}</td></tr>
              <tr><th>Condition Rating</th><td>${valueOrDash(equipment.condition)}</td></tr>
            </table>

            <h3>Mechanical Observations</h3>
            <p>${valueOrDash(equipment.mechanicalNotes)}</p>

            <h3>Controls / BAS Notes</h3>
            <p>${valueOrDash(equipment.controlsNotes)}</p>

            <h3>Deficiencies Identified</h3>
            <p>${valueOrDash(equipment.deficiencies)}</p>

            <h3>Recommendations</h3>
            <p>${valueOrDash(equipment.recommendations)}</p>

            <h3>Operational Checks</h3>
            <table>
              <tr><th>Check</th><th>Status</th></tr>
              ${operationalRows}
            </table>

            <h3>Photos Selected</h3>
            <ul>${photoList}</ul>
          </section>
        `
      })
      .join("")

    const reportHtml = `
      <!doctype html>
      <html>
        <head>
          <title>Preliminary HVAC Assessment Report</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              color: #111827;
              line-height: 1.45;
              margin: 40px;
            }

            h1, h2, h3 {
              color: #111827;
              margin-bottom: 8px;
            }

            h1 {
              font-size: 28px;
              border-bottom: 3px solid #111827;
              padding-bottom: 12px;
            }

            h2 {
              font-size: 20px;
              margin-top: 28px;
            }

            h3 {
              font-size: 15px;
              margin-top: 18px;
            }

            .subtitle {
              color: #4b5563;
              margin-top: -4px;
            }

            .summary-box {
              background: #f3f4f6;
              border: 1px solid #d1d5db;
              border-radius: 12px;
              padding: 16px;
              margin: 20px 0;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin: 10px 0 16px;
            }

            th, td {
              border: 1px solid #d1d5db;
              padding: 8px;
              text-align: left;
              vertical-align: top;
            }

            th {
              background: #f9fafb;
              width: 35%;
            }

            p {
              white-space: pre-wrap;
              margin-top: 4px;
            }

            .equipment-section {
              page-break-inside: avoid;
              border-top: 1px solid #d1d5db;
              padding-top: 16px;
              margin-top: 24px;
            }

            .footer-note {
              margin-top: 30px;
              color: #6b7280;
              font-size: 12px;
              border-top: 1px solid #d1d5db;
              padding-top: 12px;
            }

            @media print {
              body {
                margin: 24px;
              }
            }
          </style>
        </head>
        <body>
          <h1>Preliminary Commercial HVAC Assessment Report</h1>
          <p class="subtitle">Generated from field assessment notes.</p>

          <div class="summary-box">
            <table>
              <tr><th>Customer</th><td>${valueOrDash(site.customer)}</td></tr>
              <tr><th>Site Address</th><td>${valueOrDash(site.address)}</td></tr>
              <tr><th>Assessment Date</th><td>${valueOrDash(site.date)}</td></tr>
              <tr><th>Technician / PM</th><td>${valueOrDash(site.technician)}</td></tr>
              <tr><th>Total Equipment Assessed</th><td>${equipmentList.length}</td></tr>
            </table>
          </div>

          ${equipmentSections}

          <p class="footer-note">
            Preliminary report generated from field observations. Final recommendations, pricing, engineering review, and photo documentation may be added separately before customer submission.
          </p>

          <script>
            window.onload = function () {
              window.print()
            }
          </script>
        </body>
      </html>
    `

    reportWindow.document.open()
    reportWindow.document.write(reportHtml)
    reportWindow.document.close()
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="mx-auto max-w-3xl space-y-6 rounded-3xl bg-white p-6 shadow-xl">
        <header>
          <h1 className="text-3xl font-bold">Commercial HVAC Assessment Form</h1>
          <p className="mt-2 text-gray-500">
            Mobile-friendly field assessment form for commercial HVAC equipment.
          </p>
        </header>

        <section className="space-y-4 border-b pb-6">
          <h2 className="text-xl font-semibold">Site Information</h2>

          <div>
            <label className="mb-1 block text-sm font-medium">Customer Name</label>
            <input
              type="text"
              value={site.customer}
              onChange={(event) => updateSite("customer", event.target.value)}
              placeholder="Enter customer name"
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Site Address</label>
            <input
              type="text"
              value={site.address}
              onChange={(event) => updateSite("address", event.target.value)}
              placeholder="Enter site address"
              className="w-full rounded-xl border p-3"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Assessment Date</label>
              <input
                type="date"
                value={site.date}
                onChange={(event) => updateSite("date", event.target.value)}
                className="w-full rounded-xl border p-3"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Technician / PM</label>
              <input
                type="text"
                value={site.technician}
                onChange={(event) => updateSite("technician", event.target.value)}
                placeholder="Your name"
                className="w-full rounded-xl border p-3"
              />
            </div>
          </div>
        </section>

        <section className="space-y-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">Equipment Assessed</h2>
              <p className="text-sm text-gray-500">
                Add one card for each RTU, AHU, chiller, boiler, VAV, or split system.
              </p>
            </div>
            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
              {equipmentList.length} unit{equipmentList.length === 1 ? "" : "s"}
            </span>
          </div>

          {equipmentList.map((equipment, index) => (
            <div key={equipment.id} className="space-y-5 rounded-3xl border bg-gray-50 p-5">
              <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold">Equipment #{index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeEquipment(equipment.id)}
                  disabled={equipmentList.length === 1}
                  className="rounded-xl border bg-white px-3 py-2 text-sm disabled:opacity-40"
                >
                  Remove
                </button>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Equipment Information</h4>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Equipment Tag</label>
                    <input
                      type="text"
                      value={equipment.tag}
                      onChange={(event) => updateEquipment(equipment.id, "tag", event.target.value)}
                      placeholder="RTU-1"
                      className="w-full rounded-xl border bg-white p-3"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">Equipment Type</label>
                    <select
                      value={equipment.type}
                      onChange={(event) => updateEquipment(equipment.id, "type", event.target.value)}
                      className="w-full rounded-xl border bg-white p-3"
                    >
                      <option value="">Select type</option>
                      {equipmentTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Manufacturer</label>
                    <input
                      type="text"
                      value={equipment.manufacturer}
                      onChange={(event) =>
                        updateEquipment(equipment.id, "manufacturer", event.target.value)
                      }
                      placeholder="Carrier"
                      className="w-full rounded-xl border bg-white p-3"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">Model Number</label>
                    <input
                      type="text"
                      value={equipment.model}
                      onChange={(event) => updateEquipment(equipment.id, "model", event.target.value)}
                      placeholder="48TC"
                      className="w-full rounded-xl border bg-white p-3"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Approximate Age</label>
                    <input
                      type="text"
                      value={equipment.age}
                      onChange={(event) => updateEquipment(equipment.id, "age", event.target.value)}
                      placeholder="12 years"
                      className="w-full rounded-xl border bg-white p-3"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">Condition Rating</label>
                    <select
                      value={equipment.condition}
                      onChange={(event) => updateEquipment(equipment.id, "condition", event.target.value)}
                      className="w-full rounded-xl border bg-white p-3"
                    >
                      <option value="">Select condition</option>
                      {conditionRatings.map((rating) => (
                        <option key={rating} value={rating}>
                          {rating}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Assessment Notes</h4>

                <div>
                  <label className="mb-1 block text-sm font-medium">Mechanical Observations</label>
                  <textarea
                    rows={4}
                    value={equipment.mechanicalNotes}
                    onChange={(event) =>
                      updateEquipment(equipment.id, "mechanicalNotes", event.target.value)
                    }
                    placeholder="Document mechanical condition, wear, vibration, leaks, etc."
                    className="w-full rounded-xl border bg-white p-3"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Controls / BAS Notes</label>
                  <textarea
                    rows={4}
                    value={equipment.controlsNotes}
                    onChange={(event) =>
                      updateEquipment(equipment.id, "controlsNotes", event.target.value)
                    }
                    placeholder="Document controls, thermostats, BAS observations, economizer operation, etc."
                    className="w-full rounded-xl border bg-white p-3"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Deficiencies Identified</label>
                  <textarea
                    rows={4}
                    value={equipment.deficiencies}
                    onChange={(event) =>
                      updateEquipment(equipment.id, "deficiencies", event.target.value)
                    }
                    placeholder="List issues discovered during assessment"
                    className="w-full rounded-xl border bg-white p-3"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">Recommendations</label>
                  <textarea
                    rows={4}
                    value={equipment.recommendations}
                    onChange={(event) =>
                      updateEquipment(equipment.id, "recommendations", event.target.value)
                    }
                    placeholder="Recommended repairs, upgrades, or replacement actions"
                    className="w-full rounded-xl border bg-white p-3"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Photo Uploads</h4>

                <div className="rounded-2xl border-2 border-dashed bg-white p-6 text-center">
                  <p className="mb-3 text-gray-600">
                    Upload equipment photos, nameplates, deficiencies, controls, and meter readings.
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(event) => updatePhotoFileNames(equipment.id, event.target.files)}
                    className="w-full"
                  />

                  {equipment.photoFileNames.length > 0 && (
                    <p className="mt-3 text-sm text-gray-500">
                      {equipment.photoFileNames.length} photo{equipment.photoFileNames.length === 1 ? "" : "s"} selected
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Operational Checks</h4>

                <div className="space-y-3">
                  {operationalChecks.map(([key, label]) => (
                    <label key={key} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={equipment.checks[key]}
                        onChange={(event) =>
                          updateOperationalCheck(equipment.id, key, event.target.checked)
                        }
                        className="h-5 w-5"
                      />
                      <span>{label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addEquipment}
            className="w-full rounded-2xl border-2 border-dashed border-gray-300 bg-white py-4 text-lg font-semibold transition hover:bg-gray-50"
          >
            + Add Another Piece of Equipment
          </button>
        </section>

        <section className="space-y-4">
          <button
            type="button"
            onClick={generatePreliminaryReport}
            className="w-full rounded-2xl bg-black py-4 text-lg font-semibold text-white transition hover:opacity-90"
          >
            Generate Preliminary PDF Report
          </button>

          <div className="space-y-2 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900">
            <p className="font-semibold">PDF Workflow</p>
            <ol className="list-inside list-decimal space-y-1">
              <li>Complete the assessment onsite.</li>
              <li>Tap “Generate Preliminary PDF Report.”</li>
              <li>Choose “Save as PDF” from the print dialog.</li>
              <li>Use the preliminary PDF as your starting point for the final customer report.</li>
            </ol>
          </div>
        </section>
      </div>
    </div>
  )
}
