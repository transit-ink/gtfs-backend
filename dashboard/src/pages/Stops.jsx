import { useState, useEffect } from "react";
import axios from "axios";
import FormModal from "../components/FormModal";
import Pagination from "../components/Pagination";

const columns = [
  { key: "stop_id", label: "Stop ID" },
  { key: "stop_name", label: "Name" },
  { key: "stop_lat", label: "Latitude" },
  { key: "stop_lon", label: "Longitude" },
  { key: "wheelchair_boarding", label: "Wheelchair Access" },
];

export default function Stops() {
  const [stops, setStops] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStop, setEditingStop] = useState(null);
  const [formData, setFormData] = useState({
    stop_id: "",
    stop_name: "",
    stop_desc: "",
    stop_lat: "",
    stop_lon: "",
    zone_id: "",
    stop_url: "",
    location_type: 0,
    parent_station: "",
    stop_timezone: "",
    wheelchair_boarding: 0,
    level_id: "",
    platform_code: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchStops();
  }, [pagination.page]);

  const fetchStops = async () => {
    try {
      const response = await axios.get("http://localhost:3000/gtfs/stops", {
        params: {
          page: pagination.page,
          limit: pagination.limit,
        },
      });
      setStops(response.data.data);
      setPagination((prev) => ({
        ...prev,
        total: response.data.meta.total,
        totalPages: response.data.meta.totalPages,
      }));
    } catch (error) {
      console.error("Error fetching stops:", error);
    }
  };

  const handleEdit = (stop) => {
    setEditingStop(stop);
    setFormData(stop);
    setIsModalOpen(true);
  };

  const handleDelete = async (stop) => {
    if (window.confirm("Are you sure you want to delete this stop?")) {
      try {
        await axios.delete(`http://localhost:3000/gtfs/stops/${stop.stop_id}`);
        fetchStops();
      } catch (error) {
        console.error("Error deleting stop:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStop) {
        await axios.put(
          `http://localhost:3000/gtfs/stops/${editingStop.stop_id}`,
          formData
        );
      } else {
        await axios.post("http://localhost:3000/gtfs/stops", formData);
      }
      setIsModalOpen(false);
      setEditingStop(null);
      setFormData({
        stop_id: "",
        stop_name: "",
        stop_desc: "",
        stop_lat: "",
        stop_lon: "",
        zone_id: "",
        stop_url: "",
        location_type: 0,
        parent_station: "",
        stop_timezone: "",
        wheelchair_boarding: 0,
        level_id: "",
        platform_code: "",
      });
      fetchStops();
    } catch (error) {
      console.error("Error saving stop:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePageChange = (newPage) => {
    setPagination((prev) => ({ ...prev, page: newPage }));
  };

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Stops</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all transit stops in the system.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setEditingStop(null);
              setFormData({
                stop_id: "",
                stop_name: "",
                stop_desc: "",
                stop_lat: "",
                stop_lon: "",
                zone_id: "",
                stop_url: "",
                location_type: 0,
                parent_station: "",
                stop_timezone: "",
                wheelchair_boarding: 0,
                level_id: "",
                platform_code: "",
              });
              setIsModalOpen(true);
            }}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add Stop
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
                  {stops.map((stop) => (
                    <tr key={stop.stop_id}>
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                        >
                          {stop[column.key]}
                        </td>
                      ))}
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleEdit(stop)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(stop)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination meta={pagination} onPageChange={handlePageChange} />
            </div>
          </div>
        </div>
      </div>

      <FormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingStop(null);
        }}
        title={editingStop ? "Edit Stop" : "Add Stop"}
        onSubmit={handleSubmit}
      >
        <div className="space-y-6">
          <div>
            <label
              htmlFor="stop_id"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Stop ID
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="stop_id"
                id="stop_id"
                value={formData.stop_id}
                onChange={handleInputChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="stop_name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Stop Name
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="stop_name"
                id="stop_name"
                value={formData.stop_name}
                onChange={handleInputChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="stop_lat"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Latitude
            </label>
            <div className="mt-2">
              <input
                type="number"
                step="any"
                name="stop_lat"
                id="stop_lat"
                value={formData.stop_lat}
                onChange={handleInputChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="stop_lon"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Longitude
            </label>
            <div className="mt-2">
              <input
                type="number"
                step="any"
                name="stop_lon"
                id="stop_lon"
                value={formData.stop_lon}
                onChange={handleInputChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="wheelchair_boarding"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Wheelchair Access
            </label>
            <div className="mt-2">
              <select
                name="wheelchair_boarding"
                id="wheelchair_boarding"
                value={formData.wheelchair_boarding}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="0">No Information</option>
                <option value="1">Accessible</option>
                <option value="2">Not Accessible</option>
              </select>
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  );
}
