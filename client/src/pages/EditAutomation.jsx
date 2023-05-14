import { useCallback, useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Container from '../components/Container.jsx'
import CustomDragLayer from '../components/CustomDragLayer.jsx'
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend'
import { useNavigate} from 'react-router-dom';
import api from '../api'
import { withAuth } from './Authentication';

const EditAutomation = () => {
    const { name } = useParams(); 
    const [automation, setAutomation] = useState(null);
    const navigate = useNavigate();

    const handleContainerSubmitCall = useCallback(async (automation, lines, boxes) => {
        await api.updateAutomation({automation, automationName:name, lines, boxes});
        navigate('/automation');
    }, [name]);

    const setup = async () => {
        try {
            var newAutomation = [];
            var res = await api.getAutomationByName({name});
            newAutomation = res.data.data;

            setAutomation(newAutomation);

        } catch (err) {

        }
    }
    useEffect( () => {
        setup();
    }, []);


    return (
        <>
        <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
            <div>
            <Container onSubmitCall={handleContainerSubmitCall} automation={automation}/>
            <CustomDragLayer />
            </div>
        </DndProvider>
        </>
    )
}

export default withAuth(EditAutomation);