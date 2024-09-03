import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, LineElement, Title, Tooltip, Legend);

const CarbonTracker = () => {
  const navigate = useNavigate();
  const [transportationData, setTransportationData] = useState([{ distance: '', mode: '' }]);
  const [electricityData, setElectricityData] = useState({ previousUsage: '', todayUsage: '' });
  const [wasteData, setWasteData] = useState({ dryWaste: '', wetWaste: '' });
  const [totalEmissions, setTotalEmissions] = useState({ transportation: 0, electricity: 0, waste: 0 });
  const [chartData, setChartData] = useState({ labels: [], datasets: [] });
  const [error, setError] = useState('');
  const userId = localStorage.getItem('userId'); // Ensure userId is stored in localStorage upon login
  const token = localStorage.getItem('jwtToken'); // Get JWT token from localStorage

  useEffect(() => {
    if (!userId || !token) {
      navigate('/authpage'); // Redirect to login if no userId or token
    } else {
      fetchEmissionsData();
    }
  }, [navigate, userId, token]);

  const fetchEmissionsData = async () => {
    try {
      const response = await axios.get(`http://localhost:6688/carbonTrack/user/${userId}/dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`, // Include JWT token in headers
        },
      });
      const { transportation, electricity, waste, chartData } = response.data;

      // Set dummy data if all emissions are 0
      const dummyData = {
        transportation: 10,
        electricity: 15,
        waste: 5,
      };

      if (transportation === 0 && electricity === 0 && waste === 0) {
        setTotalEmissions(dummyData);
        setChartData({
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          datasets: [
            {
              label: 'Dummy Data',
              data: [10, 15, 10, 5],
              borderColor: 'rgba(75,192,192,1)',
              backgroundColor: 'rgba(75,192,192,0.2)',
              fill: true,
            },
          ],
        });
      } else {
        setTotalEmissions({ transportation, electricity, waste });
        setChartData(chartData);
      }
    } catch (error) {
      console.error('Error fetching emissions data:', error);
    }
  };

  const handleTransportationChange = (index, e) => {
    const updatedTransportationData = [...transportationData];
    updatedTransportationData[index][e.target.name] = e.target.value;
    setTransportationData(updatedTransportationData);
  };

  const handleAddTransportation = () => {
    setTransportationData([...transportationData, { distance: '', mode: '' }]);
  };

  const handleElectricityChange = (e) => {
    setElectricityData({
      ...electricityData,
      [e.target.name]: e.target.value,
    });
  };

  const handleWasteChange = (e) => {
    setWasteData({
      ...wasteData,
      [e.target.name]: e.target.value,
    });
  };

  const validateInputs = () => {
    if (
      transportationData.some(data => !data.distance || !data.mode) ||
      !electricityData.previousUsage ||
      !electricityData.todayUsage ||
      !wasteData.dryWaste ||
      !wasteData.wetWaste
    ) {
      setError('Please fill in all fields.');
      return false;
    }
    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
      const response = await axios.post('http://localhost:6688/carbonTrack/calculateAndSubmit', {
        transportationData,
        electricityData,
        wasteData
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Include JWT token in headers
        }
      });

      const { transportation, electricity, waste, chartData } = response.data;
      setTotalEmissions({ transportation, electricity, waste });
      setChartData(chartData);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">Carbon Tracker</h1>
        <nav className="space-x-6">
          <a href="/" className="mx-4 hover:text-blue-500">Home</a>
          <a href="/community" className="mx-4 hover:text-blue-500">Community</a>
          <a href="/authpage" className="mx-4 hover:text-blue-500">Login</a>
          <a href="/authpage" className="mx-4 hover:text-blue-500">Register</a>
        </nav>
      </header>

      <div className="my-8 text-center">
        <h2 className="text-2xl font-semibold">Total Emissions</h2>
        <div className="flex justify-around mt-4">
          <div className="text-center bg-white p-4 rounded shadow-lg w-1/4">
            <h3 className="text-lg font-semibold">Transportation</h3>
            <p>{totalEmissions.transportation} kgCO2e</p>
          </div>
          <div className="text-center bg-white p-4 rounded shadow-lg w-1/4">
            <h3 className="text-lg font-semibold">Electricity</h3>
            <p>{totalEmissions.electricity} kgCO2e</p>
          </div>
          <div className="text-center bg-white p-4 rounded shadow-lg w-1/4">
            <h3 className="text-lg font-semibold">Waste</h3>
            <p>{totalEmissions.waste} kgCO2e</p>
          </div>
        </div>
      </div>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold text-center">Carbon Emissions Chart</h2>
        <div className="max-w-4xl mx-auto">
          <Line data={chartData} />
        </div>
      </section>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-lg max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold mb-4">Submit Emissions Data</h2>
        {error && <p className="text-red-500">{error}</p>}
        {/* Transportation Data */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Transportation</h3>
          {transportationData.map((data, index) => (
            <div key={index} className="mb-2 flex gap-4">
              <input
                type="number"
                name="distance"
                placeholder="Distance (km)"
                value={data.distance}
                onChange={(e) => handleTransportationChange(index, e)}
                className="w-1/2 px-3 py-2 border rounded"
              />
              <input
                type="text"
                name="mode"
                placeholder="Mode of Transport"
                value={data.mode}
                onChange={(e) => handleTransportationChange(index, e)}
                className="w-1/2 px-3 py-2 border rounded"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddTransportation}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add More
          </button>
        </div>

        {/* Electricity Data */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Electricity</h3>
          <input
            type="number"
            name="previousUsage"
            placeholder="Previous Month Usage (kWh)"
            value={electricityData.previousUsage}
            onChange={handleElectricityChange}
            className="w-full px-3 py-2 border rounded mb-2"
          />
          <input
            type="number"
            name="todayUsage"
            placeholder="Today's Usage (kWh)"
            value={electricityData.todayUsage}
            onChange={handleElectricityChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        {/* Waste Data */}
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-2">Waste</h3>
          <input
            type="number"
            name="dryWaste"
            placeholder="Dry Waste (kg)"
            value={wasteData.dryWaste}
            onChange={handleWasteChange}
            className="w-full px-3 py-2 border rounded mb-2"
          />
          <input
            type="number"
            name="wetWaste"
            placeholder="Wet Waste (kg)"
            value={wasteData.wetWaste}
            onChange={handleWasteChange}
            className="w-full px-3 py-2 border rounded"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default CarbonTracker;
