import React, { useRef } from "react";
import BASE_URL from "../../utils/config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SearchTours = () => {
  const cityRef = useRef();
  const addRef = useRef();
  const navigate = useNavigate();

  const SubmitHandler = async (action) => {
    const searchTerm = cityRef.current.value;

    if (action === "search") {
      if (searchTerm === "") {
        toast.error("Please fill all the fields");
        return; // Exit early if the input is empty
      }

      const response = await fetch(
        `${BASE_URL}/tour/search?search=${searchTerm}`
      );

      const result = await response.json();

      if (!response.ok) {
        toast.error("No Record Found!");
      } else {
        navigate(`/tours/search?search=${searchTerm}`, { state: result.data });
      }
    } else if (action === "add") {
      navigate("/tours/create"); // Redirect to the create trip page
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      SubmitHandler("search");
    }
  };

  return (
    <div>
      <section className="py-4 px-6 md:px-12">
        <div className="container text-center">
          <h2 className="text-[30px] md:text-[40px] font-bold mb-4 text-center">
            Find a <span className="text-BaseColor">Trip</span>
          </h2>
          <div className="max-w-[570px] mt-[15px] mx-auto bg-gray-100 rounded-md flex items-center justify-between">
            <input
              type="search"
              ref={cityRef}
              onKeyPress={handleKeyPress}
              className="py-4 pl-4 bg-transparent w-full focus:outline-none placeholder:text-TextColor"
              placeholder="Search your trips"
            />
            <button
              onClick={() => SubmitHandler("search")}
              className="Searchbtn mt-0 rounded-[0px] rounded-r-md mx-2 hover:px-8"
            >
              Search
            </button>
          </div>
        </div>
      </section>
      <section className="py-4 px-6 md:px-12">
        <div className="container text-center">
          <h2 className="text-[30px] md:text-[40px] font-bold mb-4 text-center">
            Add a <span className="text-BaseColor">Trip</span>
          </h2>
          <div className="max-w-[570px] mt-[15px] mx-auto bg-gray-100 rounded-md flex items-center justify-between">
            <input
              type="search"
              ref={addRef}
              className="py-4 pl-4 bg-transparent w-full focus:outline-none placeholder:text-TextColor"
              placeholder="Add your trips"
            />
            <button
              onClick={() => SubmitHandler("add")} // Call SubmitHandler with "add"
              className="Searchbtn2 mt-0 rounded-[0px] rounded-r-md mx-2 hover:px-10"
            >
              Add
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SearchTours;
