import React, { useState, useCallback } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './HomePage.css';
import { MultiSelect } from 'react-multi-select-component';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const HomePage = () => {
  const [query, setQuery] = useState('');
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [responseData, setResponseData] = useState([]);
  const [normalizedName, setNormalizedName] = useState('');


  const handleSearch = useCallback(async () => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/search-data/?q=${query}`);
      const data = await response.json();
      setResponseData(data);
      toast.success('Data fetched successfully!', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000
      });
    } catch (error) {
      toast.error("Error occurred while fetching data.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
      });
    }
  }, [query]);

  const handleOptionChange = useCallback((selected) => {
    setSelectedOptions(selected);
  }, []);

  const handleSubmit = useCallback(async (e) => {
    const postData = {
      "name": normalizedName,
      "ids": selectedOptions.map(option => option.value )
    }

    e.preventDefault();
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postData)
    };

    try {
      const response = await fetch('http://127.0.0.1:8000/api/normalize-data/', requestOptions);
      const data = await response.json();
      console.log(data);
      if (response.status === 200) {
        toast.success('Data submitted successfully!', {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000
        });
      } else {
        toast.error("Error occurred while submitting the data.", {
          position: toast.POSITION.TOP_RIGHT,
          autoClose: 2000
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Error occurred while submitting the data.", {
        position: toast.POSITION.TOP_RIGHT,
        autoClose: 2000
      });
    }
    
    

  });

  const handleChange = (event) => {
    setNormalizedName(event.target.value);
  }

  return (
    <div className="container">
      <div className="header">
        <h1 className="header-title">Normalize<sub><i className="header-subtitle">your data.</i></sub></h1>
      </div>

      <div className="search-bar-container">
        <input
          className="search-input"
          type="text"
          placeholder="Search..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <button className="search-button" onClick={handleSearch}>
          <i className="fas fa-search"></i>
        </button>
      </div>
{/* 
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error}</div>} */}

      <div className="multiselect-container">
      {responseData.length > 0 && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="multiselect">Select options:</label>
              <MultiSelect
                className='multiselect-input'
                id="multiselect"
                options={responseData.map(option => ({ label: option.name, value: option.id }))}
                value={selectedOptions}
                onChange={handleOptionChange}
                labelledBy="Select"
                disableSearch={true}
                overrideStrings={{
                  selectSomeItems: "Select options...",
                  allItemsAreSelected: "All options are selected",
                  removeAllItems: "Remove all options"
                }}
              />
            </div>

            <div className="form-group"><br/>
              <label htmlFor="input">Normalized Name:</label><br />
              <input
                type="text"
                className="name-input"
                value={normalizedName}
                onChange={handleChange}
              />
            </div>

            <button type="submit" className="submit-button">Submit</button>
          </form>
        )}
      </div>
      <ToastContainer/>

    </div>
  );
};

export default HomePage;
