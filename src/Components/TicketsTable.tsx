import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import UpdateTicketModal from './UpdateTicketModal';
import AddTicketModal from './AddTicketModal'; // Import the AddTicketModal
import ConfirmationModal from './ConfirmationModal';

interface Ticket {
  idTicket: number;
  description: string;
  status: boolean;
  date: string;
}

interface TicketsTableProps {
  searchTerm: string;
}

const TicketsTable: React.FC<TicketsTableProps> = ({ searchTerm }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false); // State to control AddTicketModal visibility
  const [currentTicket, setCurrentTicket] = useState<Ticket | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState<number | null>(null);

  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'closed'>('all');
  const [sortOptionsVisible, setSortOptionsVisible] = useState(false);
  const [sortCriteria, setSortCriteria] = useState<'date' | 'status' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

  const [currentPage, setCurrentPage] = useState(1);  // State for current page
  const [totalPages, setTotalPages] = useState(1);    // State for total pages

  // Fetch tickets with pagination
  const fetchTickets = useCallback(async (pageNumber: number = 1) => {
    try {
      const response = await axios.get(`http://localhost:5064/api/Ticket?pageNumber=${pageNumber}&pageSize=7`);
      setTickets(response.data.tickets);
      setTotalPages(response.data.totalPages);
      setCurrentPage(response.data.currentPage);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleUpdateClick = (ticket: Ticket) => {
    setCurrentTicket(ticket);
    setIsModalOpen(true);
  };

  const handleTicketUpdated = () => {
    fetchTickets(currentPage); // Refetch tickets for the current page
    setSuccessMessage('Ticket updated successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
    setIsModalOpen(false);
  };

  const handleTicketAdded = () => {
    fetchTickets(currentPage); // Refetch tickets for the current page
  };

  const handleDelete = (id: number) => {
    setTicketToDelete(id);
    setIsConfirmationModalOpen(true);
  };

  const confirmDelete = async () => {
    if (ticketToDelete !== null) {
      try {
        await axios.delete(`http://localhost:5064/api/Ticket/${ticketToDelete}`);
        fetchTickets(currentPage); // Refetch tickets for the current page
      } catch (error) {
        console.error('Error deleting ticket:', error);
      }
      setTicketToDelete(null);
      setIsConfirmationModalOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setIsConfirmationModalOpen(false);
    setTicketToDelete(null);
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesId = ticket.idTicket.toString().includes(searchTerm);
    const matchesDescription = ticket.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (statusFilter === 'open' && ticket.status) || (statusFilter === 'closed' && !ticket.status);

    return (matchesId || matchesDescription) && matchesStatus;
  });

  // Sorting function
  const sortedTickets = filteredTickets.sort((a, b) => {
    if (sortCriteria === 'date') {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortCriteria === 'status') {
      return sortDirection === 'asc'
        ? (a.status === b.status ? 0 : a.status ? -1 : 1)
        : (a.status === b.status ? 0 : a.status ? 1 : -1);
    }
    return 0;
  });

  const handleSortClick = (criteria: 'date' | 'status', direction: 'asc' | 'desc') => {
    setSortCriteria(criteria);
    setSortDirection(direction);
    setSortOptionsVisible(false);
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      fetchTickets(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      fetchTickets(currentPage - 1);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {successMessage && <div className="text-green-500">{successMessage}</div>}

      <div className="flex justify-between mb-4">
        <button 
          className="flex items-center bg-blue-500 text-white font-bold py-2 px-4 rounded"
          onClick={() => setSortOptionsVisible(!sortOptionsVisible)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5 mr-2">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l4-4m0 0l4 4m-4-4v12" />
          </svg>
          Sort
        </button>

        {/* Sorting present options*/}
        {sortOptionsVisible && (
          <div className="absolute bg-white shadow-lg rounded mt-2 p-2">
            <div className="flex flex-col">
              <span className="font-bold">Sort by:</span>
              <button onClick={() => handleSortClick('date', 'asc')} className="p-2 hover:bg-gray-200">Date (Ascending)</button>
              <button onClick={() => handleSortClick('date', 'desc')} className="p-2 hover:bg-gray-200">Date (Descending)</button>
              <button onClick={() => handleSortClick('status', 'asc')} className="p-2 hover:bg-gray-200">Status (Open First)</button>
              <button onClick={() => handleSortClick('status', 'desc')} className="p-2 hover:bg-gray-200">Status (Closed First)</button>
            </div>
          </div>
        )}
      </div>

      <div className="mb-4">
        <label className="mr-2">Filter by Status:</label>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'open' | 'closed')}
          className="border rounded px-2 py-1"
        >
          <option value="all">All</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <table className="min-w-full table-auto border-collapse border border-gray-300 mb-4">
        <thead>
          <tr className="bg-green-500 text-white">
            <th className="border px-4 py-2">Ticket ID</th>
            <th className="border px-4 py-2">Description</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sortedTickets.map((ticket) => (
            <tr key={ticket.idTicket} className="text-center">
              <td className="border px-4 py-2">{ticket.idTicket}</td>
              <td className="border px-4 py-2">{ticket.description}</td>
              <td className="border px-4 py-2">{ticket.status ? 'Open' : 'Closed'}</td>
              <td className="border px-4 py-2">
                {new Date(ticket.date).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </td>
              <td className="border px-4 py-2">
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded mr-2" onClick={() => handleUpdateClick(ticket)}>Update</button>
                <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded" onClick={() => handleDelete(ticket.idTicket)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between mb-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Previous
        </button>

        <span>Page {currentPage} of {totalPages}</span>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="bg-gray-300 px-4 py-2 rounded"
        >
          Next
        </button>
      </div>

      {/* Add Ticket Button */}
      <button
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        onClick={() => setShowModal(true)}
      >
        Add New Ticket
      </button>

  {/* Modal for updating a specific Ticket */}
  {isModalOpen && currentTicket && (
        <UpdateTicketModal
          ticket={currentTicket}
          onClose={() => setIsModalOpen(false)}
          onTicketUpdated={handleTicketUpdated}
        />
      )}

   {/* Modal for Adding New Ticket */}
   {showModal && (
        <AddTicketModal onClose={() => setShowModal(false)} onTicketAdded={handleTicketAdded} />
      )}

      {/* Modal for confirmation while deleting a Ticket */}
      {isConfirmationModalOpen && (
        <ConfirmationModal
          message="Are you sure you want to delete this ticket?"
          onConfirm={confirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </div>
  );
};

export default TicketsTable;
