import { useState, useEffect } from "react";
import axios from "axios";
import FormModal from "../components/FormModal";
import Pagination from "../components/Pagination";

const columns = [
  { key: "trip_id", label: "Trip ID" },
  { key: "route_id", label: "Route ID" },
  { key: "service_id", label: "Service ID" },
  { key: "trip_headsign", label: "Headsign" },
  { key: "direction_id", label: "Direction" },
  { key: "wheelchair_accessible", label: "Wheelchair Access" },
];

export default function Trips() {
  const [trips, setTrips] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrip, setEditingTrip] = useState(null);
  const [formData, setFormData] = useState({
    trip_id: "",
    route_id: "",
    service_id: "",
    trip_headsign: "",
    trip_short_name: "",
    direction_id: 0,
    block_id: "",
    shape_id: "",
    wheelchair_accessible: 0,
    bikes_allowed: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchTrips();
    fetchRoutes();
  }, [pagination.page]);

  const fetchTrips = async () => {
    try {
      const response = await axios.get("http://localhost:3000/gtfs/trips", {
        params: {
          page: pagination.page,
          limit: pagination.limit,
        },
      });
      setTrips(response.data.data);
      setPagination((prev) => ({
        ...prev,
        total: response.data.meta.total,
        totalPages: response.data.meta.totalPages,
      }));
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  const fetchRoutes = async () => {
    try {
      const response = await axios.get("http://localhost:3000/gtfs/routes");
      setRoutes(response.data.data);
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  const handleEdit = (trip) => {
    setEditingTrip(trip);
    setFormData(trip);
    setIsModalOpen(true);
  };

  const handleDelete = async (trip) => {
    if (window.confirm("Are you sure you want to delete this trip?")) {
      try {
        await axios.delete(`http://localhost:3000/gtfs/trips/${trip.trip_id}`);
        fetchTrips();
      } catch (error) {
        console.error("Error deleting trip:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTrip) {
        await axios.put(
          `http://localhost:3000/gtfs/trips/${editingTrip.trip_id}`,
          formData
        );
      } else {
        await axios.post("http://localhost:3000/gtfs/trips", formData);
      }
      setIsModalOpen(false);
      setEditingTrip(null);
      setFormData({
        trip_id: "",
        route_id: "",
        service_id: "",
        trip_headsign: "",
        trip_short_name: "",
        direction_id: 0,
        block_id: "",
        shape_id: "",
        wheelchair_accessible: 0,
        bikes_allowed: 0,
      });
      fetchTrips();
    } catch (error) {
      console.error("Error saving trip:", error);
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
          <h1 className="text-2xl font-semibold text-gray-900">Trips</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all transit trips in the system.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setEditingTrip(null);
              setFormData({
                trip_id: "",
                route_id: "",
                service_id: "",
                trip_headsign: "",
                trip_short_name: "",
                direction_id: 0,
                block_id: "",
                shape_id: "",
                wheelchair_accessible: 0,
                bikes_allowed: 0,
              });
              setIsModalOpen(true);
            }}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add Trip
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
                  {trips.map((trip) => (
                    <tr key={trip.trip_id}>
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                        >
                          {trip[column.key]}
                        </td>
                      ))}
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleEdit(trip)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(trip)}
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
          setEditingTrip(null);
        }}
        title={editingTrip ? "Edit Trip" : "Add Trip"}
        onSubmit={handleSubmit}
      >
        <div className="space-y-6">
          <div>
            <label
              htmlFor="trip_id"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Trip ID
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="trip_id"
                id="trip_id"
                value={formData.trip_id}
                onChange={handleInputChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="route_id"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Route
            </label>
            <div className="mt-2">
              <select
                name="route_id"
                id="route_id"
                value={formData.route_id}
                onChange={handleInputChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="">Select a route</option>
                {routes.map((route) => (
                  <option key={route.route_id} value={route.route_id}>
                    {route.route_short_name} - {route.route_long_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="service_id"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Service ID
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="service_id"
                id="service_id"
                value={formData.service_id}
                onChange={handleInputChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="trip_headsign"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Trip Headsign
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="trip_headsign"
                id="trip_headsign"
                value={formData.trip_headsign}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="direction_id"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Direction
            </label>
            <div className="mt-2">
              <select
                name="direction_id"
                id="direction_id"
                value={formData.direction_id}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="0">Outbound</option>
                <option value="1">Inbound</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="wheelchair_accessible"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Wheelchair Access
            </label>
            <div className="mt-2">
              <select
                name="wheelchair_accessible"
                id="wheelchair_accessible"
                value={formData.wheelchair_accessible}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="0">No Information</option>
                <option value="1">Accessible</option>
                <option value="2">Not Accessible</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="bikes_allowed"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Bikes Allowed
            </label>
            <div className="mt-2">
              <select
                name="bikes_allowed"
                id="bikes_allowed"
                value={formData.bikes_allowed}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="0">No Information</option>
                <option value="1">Allowed</option>
                <option value="2">Not Allowed</option>
              </select>
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  );
}
