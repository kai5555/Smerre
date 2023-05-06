import React, { useEffect, useState } from 'react';
import api from '../api';
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { useNavigate} from 'react-router-dom';
import { COLORS } from '../scripts';
import { withAuth } from './Authentication';
import ComponentControl from './ComponentControl';

const Button = styled.button.attrs({
  className: `btn btn-primary`,
})`
  margin: 15px 15px 15px 5px;
  width: 100px;
`

const SnapshotContainer = styled.div`
  display: inline-block;
  justifyContent: center;
  left: 50%;
  position: absolute;
  transform: translate(-50%,0);
`

const Snapshot = styled.img`
  clip-path: inset(60px 80px);
`

const Dot = styled.span`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: gray;
  margin: 0 5px;
  cursor: pointer;

  &.active {
    background-color: ${COLORS.defaultColor};
  }
`

const SnapshotHolder = styled.div`
  opacity: 0; 
  display: none;
  transition: opacity 0.2s ease;

  &.active {
    opacity: 1;
    display: block;
    transition: opacity 0.2s ease;
  }
`
const SnapshotDate = styled.p`
  text-align: center;
  transform: translateY(60px);
  font-size: 20px;
  font-weight: bold;
`

const Plant = () => {
  const navigate = useNavigate();
  const { name } = useParams();
  const [errorMessage, setErrorMessage] = useState("");
  const [data, setData] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [snapshots, setSnapshots] = useState([]);
  const [selectedSnapshot, setSelectedSnapshot] = useState(0);

  const setup = async () => {
    const resData = await api.getDataOfPlant({name: name});
    setData(resData.data.data);
    setSensors(resData.data.sensors);
    setSnapshots(resData.data.snapshots);
  }
  useEffect( () => {
    setup();
}, []);

  var graphData = { temperature: [], humidity: [] };
  Object.keys(data).forEach((key) => {
    const prop = data[key];

    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 14);

    const filteredProps = (prop || []).filter((p) => {
      const timestamp = new Date(p.timestamp);
      return timestamp >= oneWeekAgo && (typeof p.value === 'number');
    });

    // Remove all the empty values and show it in the graph
    let result = [];
    let prevTimestamp = null;
    for (let i = 0; i < filteredProps.length; i++) {
      const currTimestamp = new Date(filteredProps[i].timestamp);

      if (prevTimestamp !== null && (currTimestamp - prevTimestamp) > 70000) {
        // add null values for missing minutes
        result.push({ timestamp: new Date(prevTimestamp.getTime() + 1000).toISOString(), value: null });
        result.push({ timestamp: new Date(currTimestamp.getTime() - 1000).toISOString(), value: null });
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
      </div>
      <ComponentControl sensors={sensors}></ComponentControl>
      <SnapshotContainer>
        <div>
          {snapshots.map((snapshot, index) => (
            <SnapshotHolder  className={`dot ${index === selectedSnapshot ? "active" : ""}`}>
              <SnapshotDate>{new Date(snapshot.timestamp).toLocaleString('be')}</SnapshotDate>
              <Snapshot key={index} src={`data:image/jpeg;base64,${snapshot.image}`} />
            </SnapshotHolder>
          ))}
        </div>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "50px" }}>
          {snapshots.map((snapshot, index) => (
            <Dot
              key={index}
              className={`dot ${index === selectedSnapshot ? "active" : ""}`}
              onClick={() => setSelectedSnapshot(index)}  
            />
          )).slice(Math.max(selectedSnapshot - 5, 0), Math.min(selectedSnapshot + 5, snapshots.length))}
        </div>
      </SnapshotContainer>
    </>
  );
};

export default withAuth(Plant);

