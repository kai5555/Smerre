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
            payload: '',
        }
    }

    handleChangeInputPayload = async event => {
        const payload = event.target.value
        this.setState({ payload })
    }

    handleIncludeTemperature = async () => {
        const { p } = this.state
        const payload = { p }

        await api.insertTemperature(payload).then(res => {
            window.alert(`Temperature inserted successfully`)
            this.setState({
                payload: '',
            })
        })
    }

    render() {
        const { p } = this.state
        return (
            <Wrapper>
                <Title>Create Temperature</Title>

                <Label>Payload: </Label>
                <InputText
                    type="text"
                    value={p}
                    onChange={this.handleChangeInputTemperature}
                />

                <Button onClick={this.handleIncludeTemperature}>Add Temperature</Button>
                <CancelButton href={'/temperature/list'}>Cancel</CancelButton>
            </Wrapper>
        )
    }
}

export default TemperatureInsert