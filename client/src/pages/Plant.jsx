import React, { useLayoutEffect, useState } from 'react';
import api from '../api';
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { useNavigate} from 'react-router-dom';

const Button = styled.button.attrs({
  className: `btn btn-primary`,
})`
  margin: 15px 15px 15px 5px;
  width: 100px;
`

const Plant = () => {
  const navigate = useNavigate();
  const { name } = useParams(); 
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState([]);
  const [sensors, setSensors] = useState([]);

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
    const resData = await api.getDataOfPlant({name: name});
    console.log(resData);
    setData(resData.data.data);
    setSensors(resData.data.sensors);
  }

  var graphData = { temperature: [], humidity: [] };
  Object.keys(data).forEach((key) => {
    const prop = data[key];

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 1);
  
    const filteredProps = (prop || []).filter((p) => {
      const timestamp = new Date(p.timestamp);
      return timestamp >= oneWeekAgo && typeof p.value === 'number';
    });

    // Remove all the empty values and show it in the graph
    let result = [];
    let prevTimestamp = null;
    for (let i = 0; i < filteredProps.length; i++) {
      const currTimestamp = new Date(filteredProps[i].timestamp);
      
      if (prevTimestamp !== null && (currTimestamp - prevTimestamp) > 60000) {
        // add null values for missing minutes
        const minutesDiff = Math.floor((currTimestamp - prevTimestamp) / 60000);
        for (let j = 1; j < minutesDiff; j++) {
          result.push({ timestamp: new Date(prevTimestamp.getTime() + (j * 60000)).toISOString(), value: null });
        }
      }
      
      result.push(filteredProps[i]);
      prevTimestamp = currTimestamp;
    }
    
    // Add the current time to the graph
    result.push({
      timestamp: new Date(),
      value: null,
    });

    const dataPoints = result.map((h) => {
      return {
        x: new Date(h.timestamp),
        y: h.value,
      };
    });

    // Update the state with the new data
    graphData[key] = dataPoints;
});

console.log(graphData);
  const graph = {
    series: [
      {
        name: 'Temp',
        data: graphData.temperature,
      },
      {
        name: 'Water',
        data: graphData.humidity,
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
    <>
      <div id='chart'>
        <ReactApexChart options={graph.options} series={graph.series} type='line' height={350} />
      </div>
      <div>
        <h1>Sensors</h1>
        {console.log(sensors)}
        {sensors.map((sensor) => (
          <>
            {sensor.sub_type === 'led' && (
              <Button key={sensor.name} onClick={() => console.log("Clicked Led")}>Led</Button>
            )}
            {sensor.sub_type === 'ventiel' && (
              <Button key={sensor.name} onClick={() => console.log("Clicked Ventiel")}>Ventiel</Button>
            )}
          </>
        ))}
      </div>
    </>
  );
};

export default Plant;
