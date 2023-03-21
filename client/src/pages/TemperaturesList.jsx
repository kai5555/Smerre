import React, { Component, PureComponent } from 'react'
import api from '../api'
import styled from 'styled-components'
import ApexCharts from 'apexcharts';
import ReactApexChart from 'react-apexcharts';
import moment from 'moment';

const Wrapper = styled.div`
    padding: 0 40px 40px 40px;
`

const Update = styled.div`
    color: #ef9b0f;
    cursor: pointer;
`

const Delete = styled.div`
    color: #ff0000;
    cursor: pointer;
`

class UpdateTemperature extends Component {
    updateUser = event => {
        event.preventDefault()

        window.location.href = `/temperatures/update/${this.props.id}`
    }

    render() {
        return <Update onClick={this.updateUser}>Update</Update>
    }
}

class DeleteTemperature extends Component {
    deleteUser = event => {
        event.preventDefault()

        if (
            window.confirm(
                `Do tou want to delete the temperature ${this.props.id} permanently?`,
            )
        ) {
            api.deleteTemperatureById(this.props.id)
            window.location.reload()
        }
    }

    render() {
        return <Delete onClick={this.deleteUser}>Delete</Delete>
    }
}

class TemperaturesList extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            temperatures: [],
            humidity: [],
            columns: [],
        }
    }

    componentDidMount = async () => {

        await api.getAllTemperatures().then(temperatures => {
            this.setState({
                temperatures: temperatures.data.data,
            })
        })
        await api.getAllHumidity().then(humidity => {
            this.setState({
                humidity: humidity.data.data,
            })
        })

        // await getWeatherData();
        // function getWeatherData() {
        //     if (navigator.geolocation) {
        //       navigator.geolocation.getCurrentPosition(position => {
        //         const lat = position.coords.latitude;
        //         const lon = position.coords.longitude;
          
        //         const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        //         const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=cloudcover,precipitation_probability&daily=sunrise,sunset&timezone=${timezone}`;
          
        //         fetch(url)
        //           .then(response => response.json())
        //           .then(data => {
        //             console.log(data);
        //           });
        //       });
        //     } else {
        //       console.log("Geolocation is not supported by this browser.");
        //     }
        // }
        
    }

	render() {
        const { temperatures, humidity } = this.state
        console.log('TCL: TemperatureList -> render -> temperatures', temperatures)
        console.log('TCL: TemperatureList -> render -> temperatures', humidity)

        if (!temperatures.length) {
            console.log("No temperature found");
        }
        if (!humidity.length) {
            console.log("No humidity found");
        }
        
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 8);
        
        const filteredTemperatures = temperatures.filter(temperature => {
            const timestamp = new Date(temperature.timestamp);
            return timestamp >= oneWeekAgo && typeof temperature.value === 'number';
        });
        const filteredHumidity = humidity.filter(h => {
            const timestamp = new Date(h.timestamp);
            return timestamp >= oneWeekAgo && typeof h.value === 'number';
        });
          
        
        const dataPointsTemperatures = filteredTemperatures.map(temperature => {
          return {
            x: moment(new Date(temperature.timestamp)).format('DD/MM HH:mm'),
            y: temperature.value
          };
        });
        const dataPointsHumidity = filteredHumidity.map(h => {
            return {
              x: moment(new Date(h.timestamp)).format('DD/MM HH:mm'),
              y: h.value
            };
          });

        const graph = {
      
            series: [{
                name: "Temp",
                data: dataPointsTemperatures
            },{
                name: "Water",
                data: dataPointsHumidity
            }],
            options: {
              chart: {
                height: 350,
                type: 'line',
                zoom: {
                  enabled: false
                }
              },
              dataLabels: {
                enabled: false
              },
              stroke: {
                curve: 'smooth'
              },
              title: {
                text: 'Temperatures',
                align: 'left'
              },
              grid: {
                row: {
                  colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                  opacity: 0.5
                },
              },
              xaxis: {
                type: 'datatime',
              }
            }, 
          };
          
         return (
            
            <div id="chart">
                <ReactApexChart options={graph.options} series={graph.series} type="line" height={350} />
            </div>
        )
	}
}
          

export default TemperaturesList