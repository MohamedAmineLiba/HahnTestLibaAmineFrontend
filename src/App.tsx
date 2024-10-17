import React, { useState } from 'react';
import './App.css';
import TicketsTable from './Components/TicketsTable';

function App() {
  const [searchTerm, setSearchTerm] = useState(''); 

  return (
    <div className="App">
      <div className="flex flex-col justify-start items-center min-h-screen mt-12">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Explore Tickets</h2>

        {/* Search bar section */}
        <div className="relative mb-10">
          <input 
            type="text" 
            placeholder="Search tickets by identifier ..." 
            className="w-80 sm:w-96 lg:w-[28rem] px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} 
          />

          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-blue-500 rounded-full text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 active:shadow-lg" aria-label="Search">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2a5 5 0 11-6.977-6.977A5 5 0 0110 14z" />
            </svg>
          </button>
        </div>

        <div className="w-full border-t border-gray-200 mb-6"></div>

        {/* Table section */}
        <div className="w-full max-w-5xl mx-auto px-4">
          <TicketsTable searchTerm={searchTerm} /> 
        </div>
      </div>
    </div>
  );
}

export default App;
