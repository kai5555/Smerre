import React, { Component } from 'react'
import api from '../api'

import styled from 'styled-components'

const Title = styled.h1.attrs({
    className: 'h1',
})``

const Wrapper = styled.div.attrs({
    className: 'form-group',
})`
    margin: 0 30px;
`

const Label = styled.label`
    margin: 5px;
`

const InputText = styled.input.attrs({
    className: 'form-control',
})`
    margin: 5px;
`

const Button = styled.button.attrs({
    className: `btn btn-primary`,
})`
    margin: 15px 15px 15px 5px;
`

const CancelButton = styled.a.attrs({
    className: `btn btn-danger`,
})`
    margin: 15px 15px 15px 5px;
`

class TemperatureInsert extends Component {
    constructor(props) {
        super(props)

        this.state = {
            value: '',
            timestamp: '',
        }
    }

    handleChangeInputValue = async event => {
        const value = event.target.value
        this.setState({ value })
    }

    handleChangeInputTimestamp = async event => {
        const timestamp = event.target.value
        this.setState({ timestamp })
    }

    handleIncludeTemperature = async () => {
        const { value, timestamp } = this.state
        const temp = { value, timestamp }

        await api.insertTemperature(temp).then(res => {
            window.alert(`Temperature inserted successfully`)
            this.setState({
                value: '',
                timestamp: '',
            })
        })
    }

    render() {
        const { value, timestamp } = this.state
        return (
            <Wrapper>
                <Title>Create Temperature</Title>

                <Label>Value: </Label>
                <InputText
                    type="text"
                    value={value}
                    onChange={this.handleChangeInputValue}
                />
                <Label>Timestamp: </Label>
                <InputText
                    type="text"
                    value={timestamp}
                    onChange={this.handleChangeInputTimestamp}
                />

                <Button onClick={this.handleIncludeTemperature}>Add Temperature</Button>
                <CancelButton href={'/temperature/list'}>Cancel</CancelButton>
            </Wrapper>
        )
    }
}

export default TemperatureInsert