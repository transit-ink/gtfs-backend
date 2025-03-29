import { useState, useEffect } from "react";
import axios from "axios";
import FormModal from "../components/FormModal";
import Pagination from "../components/Pagination";

const columns = [
  { key: "trip_id", label: "Trip ID" },
  { key: "stop_id", label: "Stop ID" },
  { key: "stop_sequence", label: "Sequence" },
  { key: "arrival_time", label: "Arrival Time" },
  { key: "departure_time", label: "Departure Time" },
  { key: "pickup_type", label: "Pickup Type" },
  { key: "drop_off_type", label: "Drop-off Type" },
];

export default function StopTimes() {
  const [stopTimes, setStopTimes] = useState([]);
  const [trips, setTrips] = useState([]);
  const [stops, setStops] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStopTime, setEditingStopTime] = useState(null);
  const [formData, setFormData] = useState({
    trip_id: "",
    stop_id: "",
    stop_sequence: "",
    stop_headsign: "",
    pickup_type: 0,
    drop_off_type: 0,
    arrival_time: "",
    departure_time: "",
    shape_dist_traveled: "",
    timepoint: 1,
    continuous_pickup: "",
    continuous_drop_off: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchStopTimes();
    fetchTrips();
    fetchStops();
  }, [pagination.page]);

  const fetchStopTimes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/gtfs/stop_times",
        {
          params: {
            page: pagination.page,
            limit: pagination.limit,
          },
        }
      );
      setStopTimes(response.data.data);
      setPagination((prev) => ({
        ...prev,
        total: response.data.meta.total,
        totalPages: response.data.meta.totalPages,
      }));
    } catch (error) {
      console.error("Error fetching stop times:", error);
    }
  };

  const fetchTrips = async () => {
    try {
      const response = await axios.get("http://localhost:3000/gtfs/trips");
      setTrips(response.data.data);
    } catch (error) {
      console.error("Error fetching trips:", error);
    }
  };

  const fetchStops = async () => {
    try {
      const response = await axios.get("http://localhost:3000/gtfs/stops");
      setStops(response.data.data);
    } catch (error) {
      console.error("Error fetching stops:", error);
    }
  };

  const handleEdit = (stopTime) => {
    setEditingStopTime(stopTime);
    setFormData(stopTime);
    setIsModalOpen(true);
  };

  const handleDelete = async (stopTime) => {
    if (window.confirm("Are you sure you want to delete this stop time?")) {
      try {
        await axios.delete(
          `http://localhost:3000/gtfs/stop_times/${editingStopTime.id}`
        );
        fetchStopTimes();
      } catch (error) {
        console.error("Error deleting stop time:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingStopTime) {
        await axios.put(
          `http://localhost:3000/gtfs/stop_times/${editingStopTime.id}`,
          formData
        );
      } else {
        await axios.post("http://localhost:3000/gtfs/stop_times", formData);
      }
      setIsModalOpen(false);
      setEditingStopTime(null);
      setFormData({
        trip_id: "",
        stop_id: "",
        stop_sequence: "",
        stop_headsign: "",
        pickup_type: 0,
        drop_off_type: 0,
        arrival_time: "",
        departure_time: "",
        shape_dist_traveled: "",
        timepoint: 1,
        continuous_pickup: "",
        continuous_drop_off: "",
      });
      fetchStopTimes();
    } catch (error) {
      console.error("Error saving stop time:", error);
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
          <h1 className="text-2xl font-semibold text-gray-900">Stop Times</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all stop times in the system.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setEditingStopTime(null);
              setFormData({
                trip_id: "",
                stop_id: "",
                stop_sequence: "",
                stop_headsign: "",
                pickup_type: 0,
                drop_off_type: 0,
                arrival_time: "",
                departure_time: "",
                shape_dist_traveled: "",
                timepoint: 1,
                continuous_pickup: "",
                continuous_drop_off: "",
              });
              setIsModalOpen(true);
            }}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add Stop Time
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
                  {stopTimes.map((stopTime) => (
                    <tr key={stopTime.id}>
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                        >
                          {stopTime[column.key]}
                        </td>
                      ))}
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleEdit(stopTime)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(stopTime)}
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
          setEditingStopTime(null);
        }}
        title={editingStopTime ? "Edit Stop Time" : "Add Stop Time"}
        onSubmit={handleSubmit}
      >
        <div className="space-y-6">
          <div>
            <label
              htmlFor="trip_id"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Trip
            </label>
            <div className="mt-2">
              <select
                name="trip_id"
                id="trip_id"
                value={formData.trip_id}
                onChange={handleInputChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="">Select a trip</option>
                {trips.map((trip) => (
                  <option key={trip.trip_id} value={trip.trip_id}>
                    {trip.trip_id}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="stop_id"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Stop
            </label>
            <div className="mt-2">
              <select
                name="stop_id"
                id="stop_id"
                value={formData.stop_id}
                onChange={handleInputChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="">Select a stop</option>
                {stops.map((stop) => (
                  <option key={stop.stop_id} value={stop.stop_id}>
                    {stop.stop_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="stop_sequence"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Stop Sequence
            </label>
            <div className="mt-2">
              <input
                type="number"
                name="stop_sequence"
                id="stop_sequence"
                value={formData.stop_sequence}
                onChange={handleInputChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="arrival_time"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Arrival Time
            </label>
            <div className="mt-2">
              <input
                type="time"
                name="arrival_time"
                id="arrival_time"
                value={formData.arrival_time}
                onChange={handleInputChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="departure_time"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Departure Time
            </label>
            <div className="mt-2">
              <input
                type="time"
                name="departure_time"
                id="departure_time"
                value={formData.departure_time}
                onChange={handleInputChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="pickup_type"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Pickup Type
            </label>
            <div className="mt-2">
              <select
                name="pickup_type"
                id="pickup_type"
                value={formData.pickup_type}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="0">Regular</option>
                <option value="1">No pickup</option>
                <option value="2">Phone agency</option>
                <option value="3">Coordinate with driver</option>
              </select>
            </div>
          </div>

          <div>
            <label
              htmlFor="drop_off_type"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Drop-off Type
            </label>
            <div className="mt-2">
              <select
                name="drop_off_type"
                id="drop_off_type"
                value={formData.drop_off_type}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="0">Regular</option>
                <option value="1">No drop-off</option>
                <option value="2">Phone agency</option>
                <option value="3">Coordinate with driver</option>
              </select>
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  );
}
