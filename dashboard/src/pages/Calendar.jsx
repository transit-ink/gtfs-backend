import { useState, useEffect } from "react";
import axios from "axios";
import FormModal from "../components/FormModal";

const columns = [
  { key: "service_id", label: "Service ID" },
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
  { key: "start_date", label: "Start Date" },
  { key: "end_date", label: "End Date" },
];

export default function Calendar() {
  const [calendars, setCalendars] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCalendar, setEditingCalendar] = useState(null);
  const [formData, setFormData] = useState({
    service_id: "",
    monday: "0",
    tuesday: "0",
    wednesday: "0",
    thursday: "0",
    friday: "0",
    saturday: "0",
    sunday: "0",
    start_date: "",
    end_date: "",
  });

  useEffect(() => {
    fetchCalendars();
  }, []);

  const fetchCalendars = async () => {
    try {
      const response = await axios.get("http://localhost:3000/gtfs/calendar");
      setCalendars(response.data);
    } catch (error) {
      console.error("Error fetching calendars:", error);
    }
  };

  const handleEdit = (calendar) => {
    setEditingCalendar(calendar);
    setFormData(calendar);
    setIsModalOpen(true);
  };

  const handleDelete = async (calendar) => {
    if (window.confirm("Are you sure you want to delete this calendar?")) {
      try {
        await axios.delete(
          `http://localhost:3000/gtfs/calendar/${calendar.service_id}`
        );
        fetchCalendars();
      } catch (error) {
        console.error("Error deleting calendar:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCalendar) {
        await axios.put(
          `http://localhost:3000/gtfs/calendar/${editingCalendar.service_id}`,
          formData
        );
      } else {
        await axios.post("http://localhost:3000/gtfs/calendar", formData);
      }
      setIsModalOpen(false);
      setEditingCalendar(null);
      setFormData({
        service_id: "",
        monday: "0",
        tuesday: "0",
        wednesday: "0",
        thursday: "0",
        friday: "0",
        saturday: "0",
        sunday: "0",
        start_date: "",
        end_date: "",
      });
      fetchCalendars();
    } catch (error) {
      console.error("Error saving calendar:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const renderDayToggle = (day) => (
    <div>
      <label
        htmlFor={day}
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        {day.charAt(0).toUpperCase() + day.slice(1)}
      </label>
      <div className="mt-2">
        <select
          name={day}
          id={day}
          value={formData[day]}
          onChange={handleInputChange}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        >
          <option value="0">No service</option>
          <option value="1">Service available</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Calendar</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all transit service calendars in the system.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setEditingCalendar(null);
              setFormData({
                service_id: "",
                monday: "0",
                tuesday: "0",
                wednesday: "0",
                thursday: "0",
                friday: "0",
                saturday: "0",
                sunday: "0",
                start_date: "",
                end_date: "",
              });
              setIsModalOpen(true);
            }}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add Calendar
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
                  {calendars.map((calendar) => (
                    <tr key={calendar.service_id}>
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                        >
                          {calendar[column.key]}
                        </td>
                      ))}
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleEdit(calendar)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(calendar)}
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
          setEditingCalendar(null);
        }}
        title={editingCalendar ? "Edit Calendar" : "Add Calendar"}
        onSubmit={handleSubmit}
      >
        <div className="space-y-6">
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

          <div className="grid grid-cols-2 gap-4">
            {renderDayToggle("monday")}
            {renderDayToggle("tuesday")}
            {renderDayToggle("wednesday")}
            {renderDayToggle("thursday")}
            {renderDayToggle("friday")}
            {renderDayToggle("saturday")}
            {renderDayToggle("sunday")}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="start_date"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Start Date
              </label>
              <div className="mt-2">
                <input
                  type="date"
                  name="start_date"
                  id="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="end_date"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                End Date
              </label>
              <div className="mt-2">
                <input
                  type="date"
                  name="end_date"
                  id="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  );
}
