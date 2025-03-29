import { useState, useEffect } from "react";
import axios from "axios";
import FormModal from "../components/FormModal";
import Pagination from "../components/Pagination";

const columns = [
  { key: "route_id", label: "Route ID" },
  { key: "route_short_name", label: "Short Name" },
  { key: "route_long_name", label: "Long Name" },
  { key: "route_type", label: "Type" },
  { key: "route_color", label: "Color" },
];

const routeTypes = [
  { value: "0", label: "Tram, Streetcar, Light rail" },
  { value: "1", label: "Subway, Metro" },
  { value: "2", label: "Rail" },
  { value: "3", label: "Bus" },
  { value: "4", label: "Ferry" },
  { value: "5", label: "Cable car" },
  { value: "6", label: "Gondola, Suspended cable car" },
  { value: "7", label: "Funicular" },
];

export default function Routes() {
  const [routes, setRoutes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [formData, setFormData] = useState({
    route_id: "",
    agency_id: "",
    route_short_name: "",
    route_long_name: "",
    route_desc: "",
    route_type: 3,
    route_url: "",
    route_color: "",
    route_text_color: "",
    route_sort_order: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchRoutes();
  }, [pagination.page]);

  const fetchRoutes = async () => {
    try {
      const response = await axios.get("http://localhost:3000/gtfs/routes", {
        params: {
          agencyId: "1", // TODO: Get from context or props
          page: pagination.page,
          limit: pagination.limit,
        },
      });
      setRoutes(response.data.data);
      setPagination((prev) => ({
        ...prev,
        total: response.data.meta.total,
        totalPages: response.data.meta.totalPages,
      }));
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
  };

  const handleEdit = (route) => {
    setEditingRoute(route);
    setFormData(route);
    setIsModalOpen(true);
  };

  const handleDelete = async (route) => {
    if (window.confirm("Are you sure you want to delete this route?")) {
      try {
        await axios.delete(
          `http://localhost:3000/gtfs/routes/${route.route_id}`
        );
        fetchRoutes();
      } catch (error) {
        console.error("Error deleting route:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingRoute) {
        await axios.put(
          `http://localhost:3000/gtfs/routes/${editingRoute.route_id}`,
          formData
        );
      } else {
        await axios.post("http://localhost:3000/gtfs/routes", formData);
      }
      setIsModalOpen(false);
      setEditingRoute(null);
      setFormData({
        route_id: "",
        agency_id: "",
        route_short_name: "",
        route_long_name: "",
        route_desc: "",
        route_type: 3,
        route_url: "",
        route_color: "",
        route_text_color: "",
        route_sort_order: "",
      });
      fetchRoutes();
    } catch (error) {
      console.error("Error saving route:", error);
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
          <h1 className="text-2xl font-semibold text-gray-900">Routes</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all transit routes in the system.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setEditingRoute(null);
              setFormData({
                route_id: "",
                agency_id: "",
                route_short_name: "",
                route_long_name: "",
                route_desc: "",
                route_type: 3,
                route_url: "",
                route_color: "",
                route_text_color: "",
                route_sort_order: "",
              });
              setIsModalOpen(true);
            }}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add Route
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
                  {routes.map((route) => (
                    <tr key={route.route_id}>
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                        >
                          {route[column.key]}
                        </td>
                      ))}
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleEdit(route)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(route)}
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
          setEditingRoute(null);
        }}
        title={editingRoute ? "Edit Route" : "Add Route"}
        onSubmit={handleSubmit}
      >
        <div className="space-y-6">
          <div>
            <label
              htmlFor="route_id"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Route ID
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="route_id"
                id="route_id"
                value={formData.route_id}
                onChange={handleInputChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="route_short_name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Short Name
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="route_short_name"
                id="route_short_name"
                value={formData.route_short_name}
                onChange={handleInputChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="route_long_name"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Long Name
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="route_long_name"
                id="route_long_name"
                value={formData.route_long_name}
                onChange={handleInputChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="route_type"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Route Type
            </label>
            <div className="mt-2">
              <select
                name="route_type"
                id="route_type"
                value={formData.route_type}
                onChange={handleInputChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="0">Tram</option>
                <option value="1">Subway</option>
                <option value="2">Rail</option>
                <option value="3">Bus</option>
                <option value="4">Ferry</option>
                <option value="5">Cable Tram</option>
                <option value="6">Aerial Lift</option>
                <option value="7">Funicular</option>
                <option value="800">Trolleybus</option>
                <option value="900">Monorail</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="route_color"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Route Color
            </label>
            <div className="mt-2">
              <input
                type="color"
                name="route_color"
                id="route_color"
                value={formData.route_color}
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
