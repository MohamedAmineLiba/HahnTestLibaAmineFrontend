import React, { useState } from 'react';
import axios from 'axios';

interface UpdateTicketModalProps {
  ticket: { idTicket: number; description: string; status: boolean; date: string };
  onClose: () => void;
  onTicketUpdated: () => void;
}

const UpdateTicketModal: React.FC<UpdateTicketModalProps> = ({ ticket, onClose, onTicketUpdated }) => {
  const [description, setDescription] = useState(ticket.description);
  const [status, setStatus] = useState(ticket.status);

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5064/api/Ticket/${ticket.idTicket}`, {
        idTicket: ticket.idTicket, 
        description,
        status,
        date: ticket.date, // Keep the original date 
      });
      onTicketUpdated(); // Refresh the ticket list
      onClose(); 
    } catch (error) {
      console.error('Error updating ticket:', error);
      alert('Failed to update the ticket. Please check the console for more details.');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">Update Ticket</h2>
        <div>
          <label className="block mb-2">Description:</label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded w-full px-2 py-1"
          />
        </div>
        <div className="mt-4">
          <label className="block mb-2">Status:</label>
          <select
            value={status ? 'Open' : 'Closed'}
            onChange={(e) => setStatus(e.target.value === 'Open')}
            className="border rounded w-full px-2 py-1"
          >
            <option value="Open">Open</option>
            <option value="Closed">Closed</option>
          </select>
        </div>
        <div className="mt-4 flex justify-end">
          <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2" onClick={handleUpdate}>
            Save
          </button>
          <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateTicketModal;
