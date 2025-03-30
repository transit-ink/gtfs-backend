import { useState, useEffect } from 'react';
import { agenciesService } from '../services/agencies';
import DataTable from '../components/DataTable';
import FormModal from '../components/FormModal';

const columns = [
  { key: 'agency_id', label: 'ID' },
  { key: 'agency_name', label: 'Name' },
  { key: 'agency_url', label: 'URL' },
  { key: 'agency_timezone', label: 'Timezone' },
  { key: 'agency_lang', label: 'Language' },
  { key: 'agency_phone', label: 'Phone' },
  { key: 'agency_fare_url', label: 'Fare URL' },
  { key: 'agency_email', label: 'Email' },
];

export default function Agencies() {
  const [agencies, setAgencies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAgency, setEditingAgency] = useState(null);
  const [formData, setFormData] = useState({
    agency_id: '',
    agency_name: '',
    agency_url: '',
    agency_timezone: '',
    agency_lang: '',
    agency_phone: '',
    agency_fare_url: '',
    agency_email: '',
  });

  useEffect(() => {
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    try {
      const response = await agenciesService.getAll();
      setAgencies(response || []);
    } catch (error) {
      console.error('Error fetching agencies:', error);
      setAgencies([]);
    }
  };

  const handleEdit = agency => {
    setEditingAgency(agency);
    setFormData(agency);
    setIsModalOpen(true);
  };

  const handleDelete = async agency => {
    if (window.confirm('Are you sure you want to delete this agency?')) {
      try {
        await agenciesService.delete(agency.agency_id);
        fetchAgencies();
      } catch (error) {
        console.error('Error deleting agency:', error);
      }
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingAgency) {
        await agenciesService.update(editingAgency.agency_id, formData);
      } else {
        await agenciesService.create(formData);
      }
      setIsModalOpen(false);
      setEditingAgency(null);
      setFormData({
        agency_id: '',
        agency_name: '',
        agency_url: '',
        agency_timezone: '',
        agency_lang: '',
        agency_phone: '',
        agency_fare_url: '',
        agency_email: '',
      });
      fetchAgencies();
    } catch (error) {
      console.error('Error saving agency:', error);
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">Agencies</h1>
          <p className="mt-2 text-sm text-gray-700">
            A list of all transit agencies in the system.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add agency
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
                  {agencies.map(agency => (
                    <tr key={agency.agency_id}>
                      {columns.map(column => (
                        <td
                          key={column.key}
                          className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                        >
                          {agency[column.key]}
                        </td>
                      ))}
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleEdit(agency)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(agency)}
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
          setEditingAgency(null);
          setFormData({
            agency_id: '',
            agency_name: '',
            agency_url: '',
            agency_timezone: '',
            agency_lang: '',
            agency_phone: '',
            agency_fare_url: '',
            agency_email: '',
          });
        }}
        title={editingAgency ? 'Edit Agency' : 'Add Agency'}
        onSubmit={handleSubmit}
      >
        <div className="space-y-4">
          {columns.map(column => (
            <div key={column.key}>
              <label htmlFor={column.key} className="block text-sm font-medium text-gray-700">
                {column.label}
              </label>
              <input
                type="text"
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
