import { useState, useEffect } from "react";
import axios from "axios";
import FormModal from "../components/FormModal";

const columns = [
  { key: "service_id", label: "Service ID" },
  { key: "date", label: "Date" },
  { key: "exception_type", label: "Exception Type" },
];

export default function CalendarDates() {
  const [calendarDates, setCalendarDates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCalendarDate, setEditingCalendarDate] = useState(null);
  const [formData, setFormData] = useState({
    service_id: "",
    date: "",
    exception_type: "1",
  });

  useEffect(() => {
    fetchCalendarDates();
  }, []);

  const fetchCalendarDates = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/gtfs/calendar_dates"
      );
      setCalendarDates(response.data);
    } catch (error) {
      console.error("Error fetching calendar dates:", error);
    }
  };

  const handleEdit = (calendarDate) => {
    setEditingCalendarDate(calendarDate);
    setFormData(calendarDate);
    setIsModalOpen(true);
  };

  const handleDelete = async (calendarDate) => {
    if (window.confirm("Are you sure you want to delete this calendar date?")) {
      try {
        await axios.delete(
          `http://localhost:3000/gtfs/calendar_dates/${calendarDate.service_id}/${calendarDate.date}`
        );
        fetchCalendarDates();
      } catch (error) {
        console.error("Error deleting calendar date:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCalendarDate) {
        await axios.put(
          `http://localhost:3000/gtfs/calendar_dates/${editingCalendarDate.service_id}/${editingCalendarDate.date}`,
          formData
        );
      } else {
        await axios.post("http://localhost:3000/gtfs/calendar_dates", formData);
      }
      setIsModalOpen(false);
      setEditingCalendarDate(null);
      setFormData({
        service_id: "",
        date: "",
        exception_type: "1",
      });
      fetchCalendarDates();
    } catch (error) {
      console.error("Error saving calendar date:", error);
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
          <h1 className="text-2xl font-semibold text-gray-900">
            Calendar Dates
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all transit service calendar date exceptions in the
            system.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setEditingCalendarDate(null);
              setFormData({
                service_id: "",
                date: "",
                exception_type: "1",
              });
              setIsModalOpen(true);
            }}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add Calendar Date
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
                  {calendarDates.map((calendarDate) => (
                    <tr key={`${calendarDate.service_id}-${calendarDate.date}`}>
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                        >
                          {calendarDate[column.key]}
                        </td>
                      ))}
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleEdit(calendarDate)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(calendarDate)}
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
          setEditingCalendarDate(null);
        }}
        title={editingCalendarDate ? "Edit Calendar Date" : "Add Calendar Date"}
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

          <div>
            <label
              htmlFor="date"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Date
            </label>
            <div className="mt-2">
              <input
                type="date"
                name="date"
                id="date"
                value={formData.date}
                onChange={handleInputChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="exception_type"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Exception Type
            </label>
            <div className="mt-2">
              <select
                name="exception_type"
                id="exception_type"
                value={formData.exception_type}
                onChange={handleInputChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              >
                <option value="1">Service added on this date</option>
                <option value="2">Service removed on this date</option>
              </select>
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  );
}
