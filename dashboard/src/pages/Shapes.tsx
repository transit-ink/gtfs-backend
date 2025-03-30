import { useState, useEffect } from 'react';
import { shapesService } from '../services/shapes';
import FormModal from '../components/FormModal';
import Pagination from '../components/Pagination';

const columns = [
  { key: 'shape_id', label: 'Shape ID' },
  { key: 'shape_pt_lat', label: 'Latitude' },
  { key: 'shape_pt_lon', label: 'Longitude' },
  { key: 'shape_pt_sequence', label: 'Sequence' },
  { key: 'shape_dist_traveled', label: 'Distance Traveled' },
];

export default function Shapes() {
  const [shapes, setShapes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingShape, setEditingShape] = useState(null);
  const [formData, setFormData] = useState({
    shape_id: '',
    shape_pt_lat: '',
    shape_pt_lon: '',
    shape_pt_sequence: '',
    shape_dist_traveled: '',
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchShapes();
  }, [pagination.page]);

  const fetchShapes = async () => {
    try {
      const response = await shapesService.getAll(pagination.page, pagination.limit);
      setShapes(response.data);
      setPagination(prev => ({
        ...prev,
        total: response.meta.total,
        totalPages: response.meta.totalPages,
      }));
    } catch (error) {
      console.error('Error fetching shapes:', error);
    }
  };

  const handleEdit = shape => {
    setEditingShape(shape);
    setFormData(shape);
    setIsModalOpen(true);
  };

  const handleDelete = async shape => {
    if (window.confirm('Are you sure you want to delete this shape point?')) {
      try {
        await shapesService.delete(shape.shape_id, shape.shape_pt_sequence);
        fetchShapes();
      } catch (error) {
        console.error('Error deleting shape:', error);
      }
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (editingShape) {
        await shapesService.update(editingShape.shape_id, editingShape.shape_pt_sequence, formData);
      } else {
        await shapesService.create(formData);
      }
      setIsModalOpen(false);
      setEditingShape(null);
      setFormData({
        shape_id: '',
        shape_pt_lat: '',
        shape_pt_lon: '',
        shape_pt_sequence: '',
        shape_dist_traveled: '',
      });
      fetchShapes();
    } catch (error) {
      console.error('Error saving shape:', error);
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
          <h1 className="text-base font-semibold leading-6 text-gray-900">Shapes</h1>
          <p className="mt-2 text-sm text-gray-700">A list of all shape points in the system.</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add shape point
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
                  {shapes.map(shape => (
                    <tr key={`${shape.shape_id}-${shape.shape_pt_sequence}`}>
                      {columns.map(column => (
                        <td
                          key={column.key}
                          className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6"
                        >
                          {shape[column.key]}
                        </td>
                      ))}
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                        <button
                          onClick={() => handleEdit(shape)}
                          className="text-indigo-600 hover:text-indigo-900 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(shape)}
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
          setEditingShape(null);
          setFormData({
            shape_id: '',
            shape_pt_lat: '',
            shape_pt_lon: '',
            shape_pt_sequence: '',
            shape_dist_traveled: '',
          });
        }}
        title={editingShape ? 'Edit Shape Point' : 'Add Shape Point'}
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
