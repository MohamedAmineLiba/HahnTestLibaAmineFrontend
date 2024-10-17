import React, { useState } from 'react';
import axios from 'axios';

interface AddTicketModalProps {
  onClose: () => void;
  onTicketAdded: () => void; // Callback to update the table after adding a ticket
}

const AddTicketModal: React.FC<AddTicketModalProps> = ({ onClose, onTicketAdded }) => {
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<boolean>(true); 
  const [date] = useState(new Date().toISOString()); // Automatically set to current date and time  
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Loading state

  const handleSave = async () => {
    // Checking if description is empty (Implement client-side form validation for required items)
    if (!description.trim()) {
      setErrorMessage('Description cannot be empty.');
      return;
    }

    setErrorMessage(''); // Clear any previous error messages
    setIsLoading(true); // Start loading

    try {
      const newTicket = {
        description,
        status,
        date,
      };

      await axios.post('http://localhost:5064/api/Ticket', newTicket);
      onTicketAdded(); // this makes a callback to update the table
      onClose(); // Close the modal
    } catch (error) {
      console.error('Error adding ticket:', error);
      setErrorMessage('Failed to add ticket. Please try again.'); // Show error message
    } finally {
      setIsLoading(false); // End loading
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add New Ticket</h2>
        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>} {/* Display error message */}
        <div className="mb-4">
          <label className="block mb-1">Description:</label>
          <input
            type="text"
            className="border rounded w-full px-3 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1">Status:</label>
          <select
            className="border rounded w-full px-3 py-2"
            value={status ? 'Open' : 'Closed'}
            onChange={(e) => setStatus(e.target.value === 'Open')}
          >
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
        <div className="flex justify-end">
          <button 
            className={`bg-blue-500 text-white px-4 py-2 rounded mr-2 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`} 
            onClick={handleSave}
            disabled={isLoading} // Disable button when loading
          >
            {isLoading ? 'Saving...' : 'Save'}
          </button>
          <button className="bg-gray-300 px-4 py-2 rounded" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTicketModal;
