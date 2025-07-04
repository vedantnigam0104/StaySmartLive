import { Link, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { UserContext } from "./UserContext.jsx";
import LocationModal from './LocationModal';
import DatesModal from './DatesModal';
import GuestsModal from './GuestsModal';
import axios from 'axios';

export default function Header() {
  const { user } = useContext(UserContext);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showDatesModal, setShowDatesModal] = useState(false);
  const [showGuestsModal, setShowGuestsModal] = useState(false);
  const [location, setLocation] = useState('Anywhere');
  const [dates, setDates] = useState({
    startDate: 'Any week',
    endDate: 'Any week',
    monthsAhead: 0
  });
  const [guests, setGuests] = useState('Add guests');
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const response = await axios.get('https://staysmart-uxcc.onrender.com/api/search', {
        params: {
          location: location !== 'Anywhere' ? location : undefined,
          checkIn: dates.startDate !== 'Any week' ? new Date(dates.startDate).toISOString() : undefined,
          checkOut: dates.endDate !== 'Any week' ? new Date(dates.endDate).toISOString() : undefined,
          monthsAhead: dates.monthsAhead > 0 ? dates.monthsAhead : undefined,
          guests: guests !== 'Add guests' ? guests : undefined
        }
      });

      console.log(response.data);

      navigate('/places', { state: { places: response.data } });

    } catch (error) {
      console.error('Error fetching places:', error);
    }
  };

  return (
    <header className="flex justify-between items-center py-4 px-8 bg-white shadow-md">
      <Link to={'/'} className="flex items-center gap-1">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 -rotate-90">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
        </svg>
        <span className="font-bold text-xl">StaySmart</span>
      </Link>
      <div className="flex gap-2 border border-gray-300 rounded-full py-2 px-4 shadow-md">
        <div onClick={() => setShowLocationModal(true)} className="cursor-pointer">{location}</div>
        <div className="border-l border-gray-300"></div>
        <div onClick={() => setShowDatesModal(true)} className="cursor-pointer">
          {dates.startDate === 'Any week' ? 'Any week' : `${new Date(dates.startDate).toLocaleDateString()} - ${new Date(dates.endDate).toLocaleDateString()}`} 
          {dates.monthsAhead > 0 && ` (${dates.monthsAhead} months ahead)`}
        </div>
        <div className="border-l border-gray-300"></div>
        <div onClick={() => setShowGuestsModal(true)} className="cursor-pointer">{guests}</div>
        <button 
          onClick={handleSearch} 
          className="bg-primary text-white p-2 rounded-full"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
        </button>
      </div>
      <Link to={user ? '/account' : '/login'} className="flex items-center gap-2 border border-gray-300 rounded-full py-2 px-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
        <div className="bg-gray-500 text-white rounded-full border border-gray-500 overflow-hidden">
          {user && user.avatar ? (
            <img src={user.avatar} alt="Avatar" className="w-6 h-6 rounded-full object-cover" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
            </svg>
          )}
        </div>
        {!!user && (
          <div>
            {user.name}
          </div>
        )}
      </Link>

      {showLocationModal && <LocationModal setLocation={(loc) => { setLocation(loc); setShowLocationModal(false); }} />}
      {showDatesModal && <DatesModal setDates={(dateRange) => { 
        setDates({
          startDate: new Date(dateRange.startDate).toISOString(),
          endDate: new Date(dateRange.endDate).toISOString(),
          monthsAhead: dateRange.monthsAhead
        });
        setShowDatesModal(false);
      }} />}
      {showGuestsModal && <GuestsModal setGuests={(guestCount) => { setGuests(guestCount); setShowGuestsModal(false); }} />}
    </header>
  );
}
