import { useContext, useEffect, useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./UserContext.jsx";
import Modal from "./Modal.jsx";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'; 

export default function BookingWidget({ place }) {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState(''); // State for user email
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email || ''); // Assuming user object contains email
    }
  }, [user]);

  let numberOfNights = 0;
  if (checkIn && checkOut) {
    numberOfNights = differenceInCalendarDays(new Date(checkOut), new Date(checkIn));
  }

 async function bookThisPlace() {

  // User not logged in
 if (!user?._id) {
  navigate('/login');
  return;
}

  // User trying to book their own property
  if (place.owner.toString() === user._id.toString()) {
    setModalMessage('You cannot book your own property.');
    setShowModal(true);
    return;
  }

  if (!phone || phone.length < 10) {
    setModalMessage('Please enter a valid phone number.');
    setShowModal(true);
    return;
    }
    if (!checkIn || !checkOut) {
  setModalMessage('Please select check-in and check-out dates.');
  setShowModal(true);
  return;
  }
  if (numberOfNights <= 0) {
  setModalMessage('Check-out date must be after check-in date.');
  setShowModal(true);
  return;
  }

  if (numberOfGuests < 1) {
  setModalMessage('Please enter a valid number of guests.');
  setShowModal(true);
  return;
  }


  try {
    const response = await axios.post('/api/bookings', {
      checkIn,
      checkOut,
      numberOfGuests,
      name,
      phone,
      place: place._id,
      price: numberOfNights * place.price,
      email: email, // use state value instead of user.email
    });
    
    const newBookingId = response.data._id;

    // Redirect to payment page
    navigate(`/payment/${newBookingId}`);

  } catch (error) {
    console.error('Error booking the place:', error);
    setModalMessage('Something went wrong while creating the booking.');
    setShowModal(true);
  }
}

  return (
    <div className="bg-white shadow p-4 rounded-2xl">
      <div className="text-2xl text-center">
        Price: ${place.price} / per night
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="flex">
          <div className="py-3 px-4">
            <label>Check in:</label>
            <input type="date"
                   value={checkIn}
                   onChange={ev => setCheckIn(ev.target.value)} />
          </div>
          <div className="py-3 px-4 border-l">
            <label>Check out:</label>
            <input type="date"
                   value={checkOut}
                   onChange={ev => setCheckOut(ev.target.value)} />
          </div>
        </div>
        <div className="py-3 px-4 border-t">
          <label>Number of guests:</label>
          <input type="number"
                 value={numberOfGuests}
                 onChange={ev => setNumberOfGuests(ev.target.value)} />
        </div>
        {numberOfNights > 0 && (
          <div className="py-3 px-4 border-t">
            <label>Your full name:</label>
            <input type="text"
                   value={name}
                   onChange={ev => setName(ev.target.value)} />
           <label>Phone number:</label>
           <PhoneInput
            country={'in'}
            value={phone}
            onChange={(phone) => setPhone(phone)}
            inputStyle={{
            width: '100%',
          }}
          />
            <label>Email:</label>
            <input type="email"
                   value={email}
                   onChange={ev => setEmail(ev.target.value)} />
          </div>
        )}
      </div>
      <button onClick={bookThisPlace} className="primary mt-4">
        Book this place
        {numberOfNights > 0 && (
          <span> ${numberOfNights * place.price}</span>
        )}
      </button>

      {/* Modal for booking error or self-booking prevention */}
      <Modal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Booking Error"
      >
        <p>{modalMessage}</p>
      </Modal>
    </div>
  );
}
