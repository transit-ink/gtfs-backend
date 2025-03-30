import { useState, useEffect } from 'react';
import { routesService } from '../services/routes';
import FormModal from '../components/FormModal';
import Pagination from '../components/Pagination';

const columns = [
  { key: 'route_id', label: 'Route ID' },
  { key: 'route_short_name', label: 'Short Name' },
  { key: 'route_long_name', label: 'Long Name' },
  { key: 'route_type', label: 'Type' },
  { key: 'route_color', label: 'Color' },
];

const routeTypes = [
  { value: '0', label: 'Tram, Streetcar, Light rail' },
  { value: '1', label: 'Subway, Metro' },
  { value: '2', label: 'Rail' },
  { value: '3', label: 'Bus' },
  { value: '4', label: 'Ferry' },
  { value: '5', label: 'Cable car' },
  { value: '6', label: 'Gondola, Suspended cable car' },
  { value: '7', label: 'Funicular' },
];

export default function Routes() {
  const [routes, setRoutes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoute, setEditingRoute] = useState(null);
  const [formData, setFormData] = useState({
    route_id: '',
    agency_id: '',
    route_short_name: '',
    route_long_name: '',
    route_desc: '',
    route_type: 3,
    route_url: '',
    route_color: '',
    route_text_color: '',
    route_sort_order: '',
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
      const response = await routesService.getAll('1', pagination.page, pagination.limit);
      setRoutes(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.meta.total,
        totalPages: response.meta.totalPages,
      }));
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  };

  const handleEdit = route => {
    setEditingRoute(route);
    setFormData(route);
    setIsModalOpen(true);
  };

  const handleDelete = async route => {
    if (window.confirm('Are you sure you want to delete this route?')) {
      try {
        await routesService.delete(route.route_id);
        fetchRoutes();
      } catch (error) {
        console.error('Error deleting route:', error);
      }
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingRoute) {
        await routesService.update(editingRoute.route_id, formData);
      } else {
        await routesService.create(formData);
      }
      setIsModalOpen(false);
      setEditingRoute(null);
      setFormData({
        route_id: '',
        agency_id: '',
        route_short_name: '',
        route_long_name: '',
        route_desc: '',
        route_type: 3,
        route_url: '',
        route_color: '',
        route_text_color: '',
        route_sort_order: '',
      });
      fetchRoutes();
    } catch (error) {
      console.error('Error saving route:', error);
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
          <h1 className="text-base font-semibold leading-6 text-gray-900">Routes</h1>
          <p className="mt-2 text-sm text-gray-700">A list of all routes in the system.</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add route
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
                  {routes.map(route => (
                    <tr key={route.route_id}>
                      {columns.map(column => (
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
          setEditingRoute(null);
          setFormData({
            route_id: '',
            agency_id: '',
            route_short_name: '',
            route_long_name: '',
            route_desc: '',
            route_type: 3,
            route_url: '',
            route_color: '',
            route_text_color: '',
            route_sort_order: '',
          });
        }}
        title={editingRoute ? 'Edit Route' : 'Add Route'}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          {columns.map(column => (
            <div key={column.key}>
              <label htmlFor={column.key} className="block text-sm font-medium text-gray-700">
                {column.label}
              </label>
              {column.key === 'route_type' ? (
                <select
                  name={column.key}
                  id={column.key}
                  value={formData[column.key]}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  {routeTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  name={column.key}
                  id={column.key}
                  value={formData[column.key]}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              )}
            </div>
          ))}
        </div>
      </FormModal>
    </div>
  );
}
