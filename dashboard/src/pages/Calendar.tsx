import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { calendarService } from '../services/calendar';
import FormModal from '../components/FormModal';
import { Calendar as CalendarType } from '../types/gtfs';
import Pagination from '../components/Pagination';

interface Column {
  key: string;
  label: string;
}

const columns: Column[] = [
  { key: 'service_id', label: 'Service ID' },
  { key: 'monday', label: 'Monday' },
  { key: 'tuesday', label: 'Tuesday' },
  { key: 'wednesday', label: 'Wednesday' },
  { key: 'thursday', label: 'Thursday' },
  { key: 'friday', label: 'Friday' },
  { key: 'saturday', label: 'Saturday' },
  { key: 'sunday', label: 'Sunday' },
  { key: 'start_date', label: 'Start Date' },
  { key: 'end_date', label: 'End Date' },
];

interface FormData {
  service_id: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  sunday: string;
  start_date: string;
  end_date: string;
}

const Calendar: React.FC = () => {
  const [calendars, setCalendars] = useState<CalendarType[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCalendar, setEditingCalendar] = useState<CalendarType | null>(null);
  const [formData, setFormData] = useState<FormData>({
    service_id: '',
    monday: '0',
    tuesday: '0',
    wednesday: '0',
    thursday: '0',
    friday: '0',
    saturday: '0',
    sunday: '0',
    start_date: '',
    end_date: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchCalendars();
  }, [pagination.page]);

  const fetchCalendars = async () => {
    try {
      const response = await calendarService.getAll(pagination.page, pagination.limit);
      setCalendars(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.meta.total,
        totalPages: response.meta.totalPages,
      }));
    } catch (error) {
      console.error('Error fetching calendars:', error);
    }
  };

  const handleEdit = (calendar: CalendarType) => {
    setEditingCalendar(calendar);
    setFormData({
      service_id: calendar.service_id,
      monday: calendar.monday ? '1' : '0',
      tuesday: calendar.tuesday ? '1' : '0',
      wednesday: calendar.wednesday ? '1' : '0',
      thursday: calendar.thursday ? '1' : '0',
      friday: calendar.friday ? '1' : '0',
      saturday: calendar.saturday ? '1' : '0',
      sunday: calendar.sunday ? '1' : '0',
      start_date: calendar.start_date,
      end_date: calendar.end_date,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (calendar: CalendarType) => {
    if (window.confirm('Are you sure you want to delete this calendar?')) {
      try {
        await calendarService.delete(calendar.service_id);
        fetchCalendars();
      } catch (error) {
        console.error('Error deleting calendar:', error);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const calendarData: CalendarType = {
        service_id: formData.service_id,
        monday: formData.monday === '1',
        tuesday: formData.tuesday === '1',
        wednesday: formData.wednesday === '1',
        thursday: formData.thursday === '1',
        friday: formData.friday === '1',
        saturday: formData.saturday === '1',
        sunday: formData.sunday === '1',
        start_date: formData.start_date,
        end_date: formData.end_date,
      };

      if (editingCalendar) {
        await calendarService.update(editingCalendar.service_id, calendarData);
      } else {
        await calendarService.create(calendarData);
      }
      setIsModalOpen(false);
      setEditingCalendar(null);
      setFormData({
        service_id: '',
        monday: '0',
        tuesday: '0',
        wednesday: '0',
        thursday: '0',
        friday: '0',
        saturday: '0',
        sunday: '0',
        start_date: '',
        end_date: '',
      });
      fetchCalendars();
    } catch (error) {
      console.error('Error saving calendar:', error);
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

  const renderDayToggle = (day: keyof FormData) => (
    <div>
      <label htmlFor={day} className="block text-sm font-medium text-gray-700">
        {day.charAt(0).toUpperCase() + day.slice(1)}
      </label>
      <select
        name={day}
        id={day}
        value={formData[day]}
        onChange={handleInputChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        required
      >
        <option value="0">No</option>
        <option value="1">Yes</option>
      </select>
    </div>
  );

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Calendars</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all service calendars in the system.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => {
              setEditingCalendar(null);
              setFormData({
                service_id: '',
                monday: '0',
                tuesday: '0',
                wednesday: '0',
                thursday: '0',
                friday: '0',
                saturday: '0',
                sunday: '0',
                start_date: '',
                end_date: '',
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
                  {calendars.map(calendar => (
                    <tr key={calendar.service_id}>
                      {columns.map(column => (
                        <td
                          key={column.key}
                          className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                        >
                          {calendar[column.key as keyof CalendarType]}
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
          setEditingCalendar(null);
        }}
        title={editingCalendar ? 'Edit Calendar' : 'Add Calendar'}
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
          <div className="grid grid-cols-2 gap-4">
            {renderDayToggle('monday')}
            {renderDayToggle('tuesday')}
            {renderDayToggle('wednesday')}
            {renderDayToggle('thursday')}
            {renderDayToggle('friday')}
            {renderDayToggle('saturday')}
            {renderDayToggle('sunday')}
          </div>
          <div>
            <label htmlFor="start_date" className="block text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              name="start_date"
              id="start_date"
              value={formData.start_date}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="end_date" className="block text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              name="end_date"
              id="end_date"
              value={formData.end_date}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
          </div>
        </div>
      </FormModal>
    </div>
  );
};

export default Calendar;
