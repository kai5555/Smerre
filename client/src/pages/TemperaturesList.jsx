import React, { useLayoutEffect, useState } from 'react';
import api from '../api';
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';
import { useNavigate} from 'react-router-dom';

const TemperaturesList = () => {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");
  const [temperatures, setTemperatures] = useState([]);
  const [humidity, setHumidity] = useState([]);

  useLayoutEffect(() => {
    async function checkUserAuth() {
        try {
            const res = await api.isUserAuth({token: localStorage.getItem("token")});
            if(res.data.isLoggedIn) {
                console.log("Logged in");
                setup();
            }
            else{
                console.log("Not logged in");
                navigate('/login');
            }
        } catch (err) {
            setErrorMessage(err)
        }
    }
    checkUserAuth();
  }, [navigate])

  const setup = async () => {
    const temperaturesResponse = await api.getAllTemperatures();
    console.log(temperaturesResponse);
    const humidityResponse = await api.getAllHumidity();
    setTemperatures(temperaturesResponse.data.data);
    setHumidity(humidityResponse.data.data);
}

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 1);

  const filteredTemperatures = temperatures.filter((temperature) => {
    const timestamp = new Date(temperature.timestamp);
    return timestamp >= oneWeekAgo && typeof temperature.value === 'number';
  });
  const filteredHumidity = humidity.filter((h) => {
    const timestamp = new Date(h.timestamp);
    return timestamp >= oneWeekAgo && typeof h.value === 'number';
  });

  // Remove all the empty values and show it in the graph
  let result = [];
  let prevTimestamp = null;
  for (let i = 0; i < filteredTemperatures.length; i++) {
    const currTimestamp = new Date(filteredTemperatures[i].timestamp);
    
    if (prevTimestamp !== null && (currTimestamp - prevTimestamp) > 60000) {
      // add null values for missing minutes
      const minutesDiff = Math.floor((currTimestamp - prevTimestamp) / 60000);
      for (let j = 1; j < minutesDiff; j++) {
        result.push({ timestamp: new Date(prevTimestamp.getTime() + (j * 60000)).toISOString(), value: null });
      }
    }
    
    result.push(filteredTemperatures[i]);
    prevTimestamp = currTimestamp;
  }
  // Add the current time to the graph
  result.push({
    timestamp: new Date(),
    value: null,
  });


  const dataPointsTemperatures = result.map((h) => {
    return {
      x: new Date(h.timestamp),
      y: h.value,
    };
  });


  
  // Remove all the empty values and show it in the graph
  result = [];
  prevTimestamp = null;
  for (let i = 0; i < filteredHumidity.length; i++) {
    const currTimestamp = new Date(filteredHumidity[i].timestamp);
    
    if (prevTimestamp !== null && (currTimestamp - prevTimestamp) > 60000) {
      // add null values for missing minutes
      const minutesDiff = Math.floor((currTimestamp - prevTimestamp) / 60000);
      for (let j = 1; j < minutesDiff; j++) {
        result.push({ timestamp: new Date(prevTimestamp.getTime() + (j * 60000)).toISOString(), value: null });
      }
    }
    
    result.push(filteredHumidity[i]);
    prevTimestamp = currTimestamp;
  }
  // Add the current time to the graph
  result.push({
    timestamp: new Date(),
    value: null,
  });

  console.log(result);

  const dataPointsHumidity = result.map((h) => {
    return {
      x: new Date(h.timestamp),
      y: h.value,
    };
  });

  console.log(dataPointsHumidity);

  const graph = {
    series: [
      {
        name: 'Temp',
        data: dataPointsTemperatures,
      },
      {
        name: 'Water',
        data: dataPointsHumidity,
      },
    ],
    options: {
      chart: {
        height: 350,
        type: 'line',
        zoom: {
          enabled: false,
        },
        toolbar: {
          show: false, 
        },
        animations: {
          enabled: false
        },
        zoom: {
            type: 'x',
            enabled: true,
            autoScaleYaxis: true
          },
      },
      dataLabels: {
        enabled: false,
      },
      stroke: {
        curve: 'smooth',
      },
      title: {
        text: 'Algemene data',
        align: 'left',
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
          opacity: 0.5,
        },
      },
      xaxis: {
        type: 'datetime',
        tickAmount: 24, // Display every hour
        labels: {
          datetimeFormatter: {
            hour: 'HH:mm'
          }
        },
      },
      yaxis: [
        {
          title: {
            text: "°C",
          },
        },
        {
          opposite: true,
          title: {
            text: "g/m3",
          },
        },
      ],
      tooltip: {
        x: {
          format: 'dd/MM/yy HH:mm'
        },
        y: [
          {
            formatter: function (val) {
              if(val == undefined || val == null) return "Geen waarde";
              return val.toFixed(2) + " c°"
            },  
          },
          {
            formatter: function (val) {
              if(val == undefined || val == null) return "Geen waarde";
              return val.toFixed(2) + " g/m3"
            },
          },
        ],
      },
    },
  };

  return (
    <div id='chart'>
      <ReactApexChart options={graph.options} series={graph.series} type='line' height={350} />
    </div>
  );
};

export default TemperaturesList;
