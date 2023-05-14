import React, { useEffect, useState } from 'react';
import api from '../api';
import ReactApexChart from 'react-apexcharts';
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
import { COLORS } from '../scripts';
import { withAuth } from './Authentication';
import ComponentControl from './ComponentControl';
import LoadingSpinner from "../components/LoadingSpinner";
import {
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBTypography,
} from "mdb-react-ui-kit";
import Slider from "@mui/material/Slider/Slider"

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

const options = [
  { days: 1, value: 1, label: "1 Day" },
  { days: 3, value: 2, label: "3 Days" },
  { days: 7, value: 3, label: "1 Week" },
  { days: 30, value: 4, label: "1 Month" },
  { days: 90, value: 5, label: "3 Months" },
  { days: 180, value: 6, label: "6 Months" },
  { days: 365, value: 7, label: "1 Year" },
];

const Plant = () => {
  const { name } = useParams();
  const [data, setData] = useState([]);
  const [sensors, setSensors] = useState([]);
  const [actors, setActors] = useState([]);
  const [humTime, setHumTime] = useState(1);
  const [tempTime, setTempTime] = useState(1);
  const [snapshots, setSnapshots] = useState([]);
  const [selectedSnapshot, setSelectedSnapshot] = useState(0);

  const setup = async () => {
    const resData = await api.getDataOfPlant({name: name});
    console.log(resData);
    setData(resData.data.data);
    setSensors(resData.data.sensors);
    setActors(resData.data.actors);
    setSnapshots(resData.data.snapshots);
  }

  useEffect( () => {
      setup();
  }, []);

  var graphData = { temperature: [], humidity: [] };  
  Object.keys(data).forEach((key) => {
    const prop = data[key];

    const oneWeekAgo = new Date();
    if(key === "temperature"){
      oneWeekAgo.setDate(oneWeekAgo.getDate() - options[tempTime - 1].days);
    }
    else if(key === "humidity"){
      oneWeekAgo.setDate(oneWeekAgo.getDate() - options[humTime - 1].days);
    }

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

const tempGraph = {
  series: [
    {
      name: 'Temp',
      data: graphData.temperature,
    },
  ],
  options: {
    chart: {
      type: 'line',
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
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
      }
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
      ],
    },
    grid: {
      show: true
    },
    yaxis: {
      tickAmount: 3
    },
    colors: [COLORS.defaultColor]
  },
};

const humGraph = {
  series: [
    {
      name: 'Hum',
      data: graphData.humidity,
    },
  ],
  options: {
    chart: {
      type: 'line',
      toolbar: {
        show: false,
      },
      animations: {
        enabled: false
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'smooth',
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
      }
    ],
    tooltip: {
      x: {
        format: 'dd/MM/yy HH:mm'
      },
      y: [
        {
          formatter: function (val) {
            if(val == undefined || val == null) return "Geen waarde";
            return val.toFixed(2) + " g/m3"
          },
        },
      ],
    },
    grid: {
      show: true
    },
    yaxis: {
      tickAmount: 3
    },
    color: '#008ff'
  },
};



  const actorsList = () => {
    if (actors.length > 0) {
      return (
          <div className="container">
            <ComponentControl actors={actors}></ComponentControl>
          </div>
      );
    } else {
      return <LoadingSpinner />;
    }
  };

  const max = options.length ;
  const tempTimeLabel = options[tempTime - 1]?.label;
  const handleChangeTempTime = (e) => {
    const value = parseInt(e.target.value);
    setTempTime(value);
  };
  const humTimeLabel = options[humTime - 1]?.label;
  const handleChangeHumTime = (e) => {
    const value = parseInt(e.target.value);
    setHumTime(value);
  };

  return (
    <>
     <section className="vh-20">
          <MDBContainer className="h-100">
            <MDBRow className="justify-content-center align-items-center h-100">
              <MDBCol md="8" lg="6" xl="12">
                <MDBCard style={{ color: "#4B515D", borderRadius: "10px", marginTop: "30px" }}>
                  <MDBCardBody className="p-4">
                    <div className="d-flex">
                      <MDBTypography tag="h6" className="flex-grow-1">
                        Temperature
                      </MDBTypography>
                      <MDBTypography tag="h6">
                        {tempTimeLabel}
                      </MDBTypography>
                    </div>
                    <div className="d-flex flex-column text-center">
                      <ReactApexChart options={tempGraph.options} series={tempGraph.series} type='line' height={150} />
                    </div>
                    <div className="d-flex flex-column text-center">
                      <MDBTypography className="display-4 mb-0" >
                        <Slider
                          style={{width: "50%", color: COLORS.defaultColor}}
                          value={tempTime}
                          onChange={handleChangeTempTime}
                          // marks={options}
                          step={1}
                          min={1}
                          max={max}
                        />
                      </MDBTypography>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
          <MDBContainer className="h-100">
            <MDBRow className="justify-content-center align-items-center h-100 ">
              <MDBCol md="8" lg="6" xl="12">
                <MDBCard style={{ color: "#4B515D", borderRadius: "10px", marginTop: "30px" }}>
                  <MDBCardBody className="p-4">
                    <div className="d-flex">
                      <MDBTypography tag="h6" className="flex-grow-1">
                        Humidity
                      </MDBTypography>
                      <MDBTypography tag="h6">
                        {humTimeLabel}
                      </MDBTypography>
                    </div>
                    <div className="d-flex flex-column text-center">
                      <ReactApexChart options={humGraph.options} series={humGraph.series} type='line' height={150} />
                    </div>
                    <div className="d-flex flex-column text-center">
                      <MDBTypography className="display-4 mb-0" >
                        <Slider
                          style={{width: "50%", color: "#008ff"}}
                          value={humTime}
                          onChange={handleChangeHumTime}
                          // marks={options}
                          step={1}
                          min={1}
                          max={max}
                        />
                      </MDBTypography>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        </section>
      <div>{actorsList()}</div>
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

