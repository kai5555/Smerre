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

class TemperatureUpdate extends Component {
    constructor(props) {
        super(props)

        this.state = {
            id: this.props.match.params.id,
            payload: '',
        }
    }

    handleChangeInputPayload = async event => {
        const payload = event.target.value
        this.setState({ payload })
    }

    handleUpdateTemperature = async () => {
        const { id, p } = this.state
        const payload = { p }

        await api.updateMovieById(id, payload).then(res => {
            window.alert(`Temperature updated successfully`)
            this.setState({
                payload: '',
            })
        })
    }

    componentDidMount = async () => {
        const { id } = this.state
        const temperature = await api.getTemperatureById(id)

        this.setState({
            payload: temperature.data.data.name,
        })
    }

    render() {
        const { payload } = this.state
        return (
            <Wrapper>
                <Title>Create Temperature</Title>

                <Label>Payload: </Label>
                <InputText
                    type="text"
                    value={payload}
                    onChange={this.handleChangeInputPayload}
                />

                <Button onClick={this.handleUpdateTemperature}>Update Temperature</Button>
                <CancelButton href={'/temperatures/list'}>Cancel</CancelButton>
            </Wrapper>
        )
    }
}

export default TemperatureUpdate