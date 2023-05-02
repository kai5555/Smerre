import { useCallback, useState, useLayoutEffect } from 'react'
import { useParams } from 'react-router-dom'
import Container from '../components/Container.jsx'
import CustomDragLayer from '../components/CustomDragLayer.jsx'
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend'
import { useNavigate} from 'react-router-dom';
import api from '../api'

const EditAutomation = () => {
    const { name } = useParams(); 
    const [automation, setAutomation] = useState(null);
    const navigate = useNavigate();

    const handleContainerSubmitCall = useCallback(async (automation, lines, boxes) => {
        await api.updateAutomation({automation, automationName:name, lines, boxes});
        navigate('/automation');
    }, [name]);

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
              console.log(err);
            }
        }
        checkUserAuth();
      }, [navigate]);

    const setup = async () => {
        try {
            var newAutomation = [];
            var res = await api.getAutomationByName({name});
            newAutomation = res.data.data;
            console.log(newAutomation);

            setAutomation(newAutomation);

        } catch (err) {

        }
    }


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

export default EditAutomation;