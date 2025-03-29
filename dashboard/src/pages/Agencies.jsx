import { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "../components/DataTable";
import FormModal from "../components/FormModal";

const columns = [
  { key: "agency_id", label: "ID" },
  { key: "agency_name", label: "Name" },
  { key: "agency_url", label: "URL" },
  { key: "agency_timezone", label: "Timezone" },
  { key: "agency_lang", label: "Language" },
  { key: "agency_phone", label: "Phone" },
  { key: "agency_fare_url", label: "Fare URL" },
  { key: "agency_email", label: "Email" },
];

export default function Agencies() {
  const [agencies, setAgencies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgency, setEditingAgency] = useState(null);
  const [formData, setFormData] = useState({
    agency_id: "",
    agency_name: "",
    agency_url: "",
    agency_timezone: "",
    agency_lang: "",
    agency_phone: "",
    agency_fare_url: "",
    agency_email: "",
  });

  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    try {
      const response = await axios.get("http://localhost:3000/gtfs/agency");
      setAgencies(response.data);
    } catch (error) {
      console.error("Error fetching agencies:", error);
    }
  };

  const handleEdit = (agency) => {
    setEditingAgency(agency);
    setFormData(agency);
    setIsModalOpen(true);
  };

  const handleDelete = async (agency) => {
    if (window.confirm("Are you sure you want to delete this agency?")) {
      try {
        await axios.delete(
          `http://localhost:3000/gtfs/agency/${agency.agency_id}`
        );
        fetchAgencies();
      } catch (error) {
        console.error("Error deleting agency:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAgency) {
        await axios.put(
          `http://localhost:3000/gtfs/agency/${editingAgency.agency_id}`,
          formData
        );
      } else {
        await axios.post("http://localhost:3000/gtfs/agency", formData);
      }
      setIsModalOpen(false);
      setEditingAgency(null);
      setFormData({
        agency_id: "",
        agency_name: "",
        agency_url: "",
        agency_timezone: "",
        agency_lang: "",
        agency_phone: "",
        agency_fare_url: "",
        agency_email: "",
      });
      fetchAgencies();
    } catch (error) {
      console.error("Error saving agency:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Agencies</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all transit agencies in the system.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setEditingAgency(null);
              setFormData({
                agency_id: "",
                agency_name: "",
                agency_url: "",
                agency_timezone: "",
                agency_lang: "",
                agency_phone: "",
                agency_fare_url: "",
                agency_email: "",
              });
              setIsModalOpen(true);
            }}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add Agency
          </button>
        </div>
      </div>

      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    {columns.map((column) => (
                      <th
                        key={column.key}
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        {column.label}
                      </th>
                    ))}
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {agencies.map((agency) => (
                    <tr key={agency.agency_id}>
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                        >
                          {agency[column.key]}
                        </td>
                      ))}
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleEdit(agency)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(agency)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <FormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAgency(null);
        }}
        title={editingAgency ? "Edit Agency" : "Add Agency"}
        onSubmit={handleSubmit}
      >
        <div className="space-y-6">
          <div>
            <label
              htmlFor="agency_id"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Agency ID
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="agency_id"
                id="agency_id"
                value={formData.agency_id}
                onChange={handleInputChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="agency_name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Agency Name
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="agency_name"
                id="agency_name"
                value={formData.agency_name}
                onChange={handleInputChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="agency_url"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Agency URL
            </label>
            <div className="mt-2">
              <input
                type="url"
                name="agency_url"
                id="agency_url"
                value={formData.agency_url}
                onChange={handleInputChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="agency_timezone"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Timezone
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="agency_timezone"
                id="agency_timezone"
                value={formData.agency_timezone}
                onChange={handleInputChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="agency_lang"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Language
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="agency_lang"
                id="agency_lang"
                value={formData.agency_lang}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="agency_phone"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Phone
            </label>
            <div className="mt-2">
              <input
                type="tel"
                name="agency_phone"
                id="agency_phone"
                value={formData.agency_phone}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="agency_fare_url"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Fare URL
            </label>
            <div className="mt-2">
              <input
                type="url"
                name="agency_fare_url"
                id="agency_fare_url"
                value={formData.agency_fare_url}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="agency_email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email
            </label>
            <div className="mt-2">
              <input
                type="email"
                name="agency_email"
                id="agency_email"
                value={formData.agency_email}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  );
}
