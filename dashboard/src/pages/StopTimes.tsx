import { useState, useEffect } from 'react';
import { stopTimesService } from '../services/stopTimes';
import { tripsService } from '../services/trips';
import { stopsService } from '../services/stops';
import FormModal from '../components/FormModal';
import Pagination from '../components/Pagination';

const columns = [
  { key: 'trip_id', label: 'Trip ID' },
  { key: 'stop_id', label: 'Stop ID' },
  { key: 'stop_sequence', label: 'Sequence' },
  { key: 'arrival_time', label: 'Arrival Time' },
  { key: 'departure_time', label: 'Departure Time' },
  { key: 'pickup_type', label: 'Pickup Type' },
  { key: 'drop_off_type', label: 'Drop-off Type' },
];

export default function StopTimes() {
  const [stopTimes, setStopTimes] = useState([]);
  const [trips, setTrips] = useState([]);
  const [stops, setStops] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStopTime, setEditingStopTime] = useState(null);
  const [formData, setFormData] = useState({
    trip_id: '',
    stop_id: '',
    stop_sequence: '',
    stop_headsign: '',
    pickup_type: 0,
    drop_off_type: 0,
    arrival_time: '',
    departure_time: '',
    shape_dist_traveled: '',
    timepoint: 1,
    continuous_pickup: '',
    continuous_drop_off: '',
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
      const response = await stopTimesService.getAll(pagination.page, pagination.limit);
      setStopTimes(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.meta.total,
        totalPages: response.meta.totalPages,
      }));
    } catch (error) {
      console.error('Error fetching stop times:', error);
    }
  };

  const fetchTrips = async () => {
    try {
      const response = await tripsService.getAll();
      setTrips(response.data);
    } catch (error) {
      console.error('Error fetching trips:', error);
    }
  };

  const fetchStops = async () => {
    try {
      const response = await stopsService.getAll();
      setStops(response.data);
    } catch (error) {
      console.error('Error fetching stops:', error);
    }
  };

  const handleEdit = stopTime => {
    setEditingStopTime(stopTime);
    setFormData(stopTime);
    setIsModalOpen(true);
  };

  const handleDelete = async stopTime => {
    if (window.confirm('Are you sure you want to delete this stop time?')) {
      try {
        await stopTimesService.delete(stopTime.trip_id, stopTime.stop_id);
        fetchStopTimes();
      } catch (error) {
        console.error('Error deleting stop time:', error);
      }
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingStopTime) {
        await stopTimesService.update(editingStopTime.trip_id, editingStopTime.stop_id, formData);
      } else {
        await stopTimesService.create(formData);
      }
      setIsModalOpen(false);
      setEditingStopTime(null);
      setFormData({
        trip_id: '',
        stop_id: '',
        stop_sequence: '',
        stop_headsign: '',
        pickup_type: 0,
        drop_off_type: 0,
        arrival_time: '',
        departure_time: '',
        shape_dist_traveled: '',
        timepoint: 1,
        continuous_pickup: '',
        continuous_drop_off: '',
      });
      fetchStopTimes();
    } catch (error) {
      console.error('Error saving stop time:', error);
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePageChange = newPage => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Stop Times</h1>
          <p className="mt-2 text-sm text-gray-700">A list of all stop times in the system.</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add stop time
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
                  {stopTimes.map(stopTime => (
                    <tr key={`${stopTime.trip_id}-${stopTime.stop_id}`}>
                      {columns.map(column => (
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
          setEditingStopTime(null);
          setFormData({
            trip_id: '',
            stop_id: '',
            stop_sequence: '',
            stop_headsign: '',
            pickup_type: 0,
            drop_off_type: 0,
            arrival_time: '',
            departure_time: '',
            shape_dist_traveled: '',
            timepoint: 1,
            continuous_pickup: '',
            continuous_drop_off: '',
          });
        }}
        title={editingStopTime ? 'Edit Stop Time' : 'Add Stop Time'}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="trip_id" className="block text-sm font-medium text-gray-700">
              Trip
            </label>
            <select
              name="trip_id"
              id="trip_id"
              value={formData.trip_id}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select a trip</option>
              {trips.map(trip => (
                <option key={trip.trip_id} value={trip.trip_id}>
                  {trip.trip_id}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="stop_id" className="block text-sm font-medium text-gray-700">
              Stop
            </label>
            <select
              name="stop_id"
              id="stop_id"
              value={formData.stop_id}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">Select a stop</option>
              {stops.map(stop => (
                <option key={stop.stop_id} value={stop.stop_id}>
                  {stop.stop_name}
                </option>
              ))}
            </select>
          </div>

          {columns
            .filter(column => !['trip_id', 'stop_id'].includes(column.key))
            .map(column => (
              <div key={column.key}>
                <label htmlFor={column.key} className="block text-sm font-medium text-gray-700">
                  {column.label}
                </label>
                <input
                  type={
                    column.key.includes('time')
                      ? 'time'
                      : column.key.includes('sequence')
                        ? 'number'
                        : 'text'
                  }
                  name={column.key}
                  id={column.key}
                  value={formData[column.key]}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            ))}
        </div>
      </FormModal>
    </div>
  );
}
