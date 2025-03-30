import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { calendarDatesService } from '../services/calendarDates';
import FormModal from '../components/FormModal';
import { CalendarDate } from '../types/gtfs';
import Pagination from '../components/Pagination';

interface Column {
  key: string;
  label: string;
}

const columns: Column[] = [
  { key: 'service_id', label: 'Service ID' },
  { key: 'date', label: 'Date' },
  { key: 'exception_type', label: 'Exception Type' },
];

interface FormData {
  service_id: string;
  date: string;
  exception_type: string;
}

const CalendarDates: React.FC = () => {
  const [calendarDates, setCalendarDates] = useState<CalendarDate[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCalendarDate, setEditingCalendarDate] = useState<CalendarDate | null>(null);
  const [formData, setFormData] = useState<FormData>({
    service_id: '',
    date: '',
    exception_type: '1',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchCalendarDates();
  }, [pagination.page]);

  const fetchCalendarDates = async () => {
    try {
      const response = await calendarDatesService.getAll(pagination.page, pagination.limit);
      setCalendarDates(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.meta.total,
        totalPages: response.meta.totalPages,
      }));
    } catch (error) {
      console.error('Error fetching calendar dates:', error);
    }
  };

  const handleEdit = (calendarDate: CalendarDate) => {
    setEditingCalendarDate(calendarDate);
    setFormData({
      service_id: calendarDate.service_id,
      date: calendarDate.date,
      exception_type: calendarDate.exception_type.toString(),
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (calendarDate: CalendarDate) => {
    try {
      await calendarDatesService.delete(calendarDate.service_id, calendarDate.date);
      fetchCalendarDates();
    } catch (error) {
      console.error('Error deleting calendar date:', error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const calendarDateData: CalendarDate = {
        service_id: formData.service_id,
        date: formData.date,
        exception_type: parseInt(formData.exception_type, 10),
      };

      if (editingCalendarDate) {
        await calendarDatesService.update(
          editingCalendarDate.service_id,
          editingCalendarDate.date,
          calendarDateData
        );
      } else {
        await calendarDatesService.create(calendarDateData);
      }
      setIsModalOpen(false);
      setEditingCalendarDate(null);
      setFormData({
        service_id: '',
        date: '',
        exception_type: '1',
      });
      fetchCalendarDates();
    } catch (error) {
      console.error('Error saving calendar date:', error);
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Calendar Dates</h1>
          <p className="mt-2 text-sm text-gray-700">A list of all calendar dates in the system.</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setEditingCalendarDate(null);
              setFormData({
                service_id: '',
                date: '',
                exception_type: '1',
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
                    {columns.map(column => (
                      <th
                        key={column.key}
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                      >
                        {column.label}
                      </th>
                    ))}
                    <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {calendarDates.map(calendarDate => (
                    <tr key={`${calendarDate.service_id}-${calendarDate.date}`}>
                      {columns.map(column => (
                        <td
                          key={column.key}
                          className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                        >
                          {calendarDate[column.key as keyof CalendarDate]}
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

      <Pagination
        meta={{
          page: pagination.page,
          totalPages: pagination.totalPages,
        }}
        onPageChange={handlePageChange}
      />

      <FormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCalendarDate(null);
        }}
        title={editingCalendarDate ? 'Edit Calendar Date' : 'Add Calendar Date'}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="service_id" className="block text-sm font-medium text-gray-700">
              Service ID
            </label>
            <input
              type="text"
              name="service_id"
              id="service_id"
              value={formData.service_id}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700">
              Date
            </label>
            <input
              type="date"
              name="date"
              id="date"
              value={formData.date}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="exception_type" className="block text-sm font-medium text-gray-700">
              Exception Type
            </label>
            <select
              name="exception_type"
              id="exception_type"
              value={formData.exception_type}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            >
              <option value="1">Added</option>
              <option value="2">Removed</option>
            </select>
          </div>
        </div>
      </FormModal>
    </div>
  );
};

export default CalendarDates;
