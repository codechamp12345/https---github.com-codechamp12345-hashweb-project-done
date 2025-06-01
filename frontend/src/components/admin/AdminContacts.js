import React, { useEffect } from 'react';
import { useGetContactsQuery, useDeleteContactMutation } from '../../redux/slices/adminApiSlice';
import { CircularProgress, Alert, Button } from '@mui/material';
import { toast } from 'react-toastify';
import { Delete as DeleteIcon } from '@mui/icons-material';

const AdminContacts = () => {
  const { data: contactsResponse, isLoading, error, refetch } = useGetContactsQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const [deleteContact, { isLoading: isDeleting }] = useDeleteContactMutation();

  useEffect(() => {
    if (error) {
      toast.error(error.data?.message || 'Error loading contacts', {
        toastId: 'contacts-error'
      });
    }
  }, [error]);

  const handleDelete = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact submission?')) {
      try {
        const res = await deleteContact(contactId).unwrap();
        toast.success(res.message || 'Contact submission deleted successfully');
        // Contacts list will automatically refetch due to invalidated tag
      } catch (err) {
        toast.error(err.data?.message || 'Failed to delete contact submission');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert severity="error">
          {error.data?.message || 'Failed to load contacts. Please try again.'}
        </Alert>
      </div>
    );
  }

  // Access the contacts array from the data property of the response
  const contacts = contactsResponse?.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contact Submissions</h1>
        <button
          onClick={() => refetch()}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Refresh
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {contacts.length > 0 ? (
                contacts.map((contact) => (
                  <tr key={contact._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {contact.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {contact.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {contact.phone}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {contact.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(contact.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        startIcon={<DeleteIcon />}
                        onClick={() => handleDelete(contact._id)}
                        disabled={isDeleting}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                    No contact submissions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminContacts; 