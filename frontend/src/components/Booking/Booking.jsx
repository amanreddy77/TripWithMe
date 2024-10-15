import React, { useState, useContext, useEffect } from "react";
import { FaStar } from "react-icons/fa6";
import { toast } from "react-toastify";
import { AuthContext } from "../../context/AuthContext";
import BASE_URL from "../../utils/config";
import { useNavigate } from "react-router-dom";
import emailjs from "@emailjs/browser"; // Ensure you're importing EmailJS browser

const Booking = ({ reviewsArray, avgRating }) => {
  const currentDate = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [data, setData] = useState({
    userId: user && user._id,
    tourName: "",
    fullName: "",
    totalPrice: 0,
    price: 0,
    phone: "",
    maxGroupSize: 1,
    bookAt: currentDate,
    date: "",
  });
  const [existingBookings, setExistingBookings] = useState([]); // State to hold existing bookings
  const calculatedPrice = data.maxGroupSize * data.price;

  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      totalPrice: calculatedPrice,
    }));
  }, [calculatedPrice]);

  useEffect(() => {
    // Fetch existing bookings when the component mounts
    const fetchExistingBookings = async () => {
      try {
        const response = await fetch(`${BASE_URL}/booking`);
        const result = await response.json();
        if (response.ok) {
          setExistingBookings(result.data);
        }
      } catch (error) {
        console.error("Error fetching existing bookings:", error);
      }
    };

    fetchExistingBookings();
  }, []);

  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!user) {
        toast.error("Please Sign In first");
        return;
      }

      // Check for overlapping bookings from all users
      const overlappingBookings = existingBookings.filter(
        (booking) => booking.date === data.date // Just check if the date matches
      );

      // Notify existing users if there are overlaps
      if (overlappingBookings.length > 0) {
        const emailPromises = overlappingBookings.map((booking) => {
          return emailjs.send("service_dzwm4zr", "template_t3a1ryo", {
            to_email: booking.userEmail,
            tour_name: data.tourName,
            date: data.date,
            customer_name: data.fullName, 
            customer_phone: data.phone,      // Send the customer's phone number
            number_of_persons: data.maxGroupSize,
            message: `A new booking has been made on ${data.date} for the tour: ${data.tourName}.`,
          }, "IfkQHSAOVoRq2aq2u") // Replace with your public key
          .then((response) => {
            console.log("Notification sent!", response);
          })
          .catch((error) => {
            console.error("Error sending notification:", error);
          });
        });
        await Promise.all(emailPromises);
      }

      // Proceed to create a new booking
      const response = await fetch(`${BASE_URL}/booking`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();

      if (response.ok) {
        toast.success("Booked");
        navigate("/booked");
      } else {
        toast.error(result.message);
      }
    } catch (err) {
      toast.error("Server not responding");
    }
  };

  return (
    <div className="">
      <div className="flex justify-between items-center ">
        <h3 className="text-[25px] md:text-[40px] font-bold mb-4 text-start text-BaseColor">
          {data.price > 0 ? `$${data.price}` : "$0"} <span>/per person</span>
        </h3>
        <div className="flex items-center gap-2">
          <i>
            <FaStar />
          </i>
          <span className="flex gap-1">
            <div>{avgRating}</div>
            <div>({reviewsArray.length})</div>
          </span>
        </div>
      </div>

      <div className="py-6 space-y-4">
        <h5 className="text-[18px] md:text-2xl font-semibold">
          Booking Information
        </h5>
        <form onSubmit={handleSubmit}>
          <div>
            <input
              className="booking_input"
              type="text"
              placeholder="Tour Name"
              id="tourName"
              required
              value={data.tourName} // Controlled input
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              className="booking_input"
              type="text"
              placeholder="Full Name"
              id="fullName"
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              className="booking_input"
              type="text"
              placeholder="Contact No."
              id="phone"
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              className="booking_input"
              type="number"
              placeholder="Number of Persons?"
              id="maxGroupSize"
              value={data.maxGroupSize}
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              className="booking_input"
              type="date"
              id="date"
              required
              onChange={handleChange}
            />
          </div>
          <div>
            <input
              className="booking_input"
              type="number"
              placeholder="Enter Price per Person"
              id="price"
              value={data.price}
              min="0"
              required
              onChange={handleChange}
            />
          </div>
          <div className="mt-12">
            <div className="flex my-4 justify-between">
              <span>Gross Price: </span>
              <p className="font-semibold">Rs. {data.price > 0 ? data.price : 0}</p>
            </div>
            <div className="flex my-4 border-b-[1px] pb-2 border-black justify-between">
              <span>GST: </span>
              <p className="font-semibold">0%</p>
            </div>
            <div className="flex my-6 justify-between font-bold text-lg">
              <span>Net Price: </span>
              <p>Rs. {calculatedPrice}</p>
            </div>
          </div>
          <button type="submit" className="btn w-full hover:bg-red-700">
            Book
          </button>
        </form>
      </div>
    </div>
  );
};

export default Booking;
