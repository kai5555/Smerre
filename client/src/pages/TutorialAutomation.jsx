import { useCallback, useState } from 'react';
import Container from '../components/Container.jsx';
import CustomDragLayer from '../components/CustomDragLayer.jsx';
import { DndProvider } from 'react-dnd';
import { TouchBackend } from 'react-dnd-touch-backend'
import styled from 'styled-components'
import ValidationError from './ValidationError'
import { useNavigate, Link} from 'react-router-dom';
import { withAuth } from './Authentication';
import Tour from 'reactour'
import COLORS from '../scripts/colors'

const Button = styled.button.attrs({
    className: `btn btn-primary`,
})`
    width: 100px;
    height: 40px;
    font-size: 14px;
    font-weight: 800;
    line-height: 1;
    font-family: -apple-system,BlinkMacSystemFont,Segoe UI,roboto,Helvetica Neue,helvetica,arial,sans-serif;
    color: #fff;
    box-shadow: 0px 10px 20px -10px  ${COLORS.defaultColor};
    transition: transform 0.2s ease-in-out;

    &:hover {
        color: #fff;
        animation: bop 0.5s ease-out;
    }

    &:active {
        color: #fff !important;
    }
    
    @keyframes bop {
        0% {
            transform: translateY(0px);
        }
        25% {
            transform: translateY(-8px);
        }
        50% {
            transform: translateY(0px);
        }
        75% {
            transform: translateY(-4px);
        }
        100% {
            transform: translateY(0px);
        }
    }
`


const TutorialAutomation = () => {
  const [selectedExample, setSelectedExample] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [errorKey, setErrorKey] = useState(0);
  const navigate = useNavigate();
  const [isTourOpen, setIsTourOpen] = useState(true);

  const handleContainerSubmitCall = useCallback(async (automation, lines, boxes) => {
    console.log("Tutorial finished");
    navigate('/automation');
  }, []);

  const handleNextExample = useCallback((index) => {
    setSelectedExample(index);
  }, []);

  const tutorial =[
    {
      selector: '[data-tut="container"]',
      content: () => (
        <p>This is the <b>Automation Creation tool</b>, here all your automation magic happens. However there are a few restriction on how to do this. In this tour we will explain everything you need to know!</p>
      ),
      action: () => {
        handleNextExample(1);

      },
    },
    {
      selector: '[data-tut="picks"]',
      content: () => (
        <p>The first step to create your own automation is to drag some cards around. All the usable cards are shown here below. You can drag them from here.</p>
      ),
      action: () => {
        handleNextExample(2);
        console.log("Step 2");
      },
      position: "top"
    },
    {
      selector: '[data-tut="container"]',
      content: () => (
        <p>To connect boxes you can draw lines between them, to do this you can click on the start box first and next on the end box. This will draw a line which has a dot on the end box</p>
      ),
      action: () => {
        handleNextExample(3);
        console.log("Step 3");
      },
    },
    {
      selector: '[data-tut="container"]',
      content: () => (
        <p>Every box contains some additional content you might need to set, try double clicking any box to access this. This also works for lines, you can use this to delete them.</p>
      ),
      action: () => {
        handleNextExample(4);
        console.log("Step 4");
      },
    },
    {
      selector: '[data-tut="container"]',
      content: () => (
        <p>In this info box you can alter the information but also delete the box here.</p>
      ),
      action: () => {
        handleNextExample(5);
        console.log("Step 5");
      },
    },
    {
      selector: '[data-tut="steps"]',
      content: () => (
        <p>At the moment we are in the 'Conditions' tab, here you can set your conditions and trigger of a automation. We will show some examples later. Now we navigate to the next tab via the steps menu.</p>
      ),
      action: () => {
        handleNextExample(6);
        console.log("Step 6");
      },
    },
    {
      selector: '[data-tut="container"]',
      content: () => (
        <p>If any error occur in your scheme the program will detect those and you won't be able to go any further. The boxes will be colored to show these errors, <span style={{color: COLORS.errorColor, fontWeight:"bold"}}>connection error</span> or <span style={{color: COLORS.warningColor, fontWeight:"bold"}}>content error</span>. To view the precise error double click such a box and it will be shown in the info window.</p>
      ),
      action: () => {
        handleNextExample(7);
        console.log("Step 7");
      },
    },
    {
      selector: '[data-tut="container"]',
      content: () => (
        <p>As you can see this box has some errors which need to be fixed, here our entity has no child box connected to it.</p>
      ),
      action: () => {
        handleNextExample(8);
        console.log("Step 8");
      },
    },
    {
      selector: '[data-tut="steps"]',
      content: () => (
        <p>Now you have fixed the error, we can move on to the next pag succesfully.</p>
      ),
      action: () => {
        handleNextExample(9);
        console.log("Step 9");
      },
    },
    {
      selector: '[data-tut="container"]',
      content: () => (
        <p>Now you are in the 'Action' tab, here you can execute a action if all the previous defined conditions are met. Everything works the same as before.</p>
      ),
      style:{},
      action: () => {
        handleNextExample(10);
        console.log("Step 10");
      },
    },
    {
      selector: '[data-tut="container"]',
      content: () => (
        <>
          <p>To learn which box to use or to connect you can just experiment a bit or look here for a more in depth look. When adding a new automation there are already some presest fro which you can start.</p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link to="/automation/add"><Button style={{ display: 'inline-block', margin: '0 auto' }}>Start creating</Button></Link>
          </div>
        </>

      ),
      action: () => {
        handleNextExample(11);
        console.log("Step 11");
      },
    },
  ]
  

  return (
    <>
      <Tour steps={tutorial} isOpen={isTourOpen} onRequestClose={() => setIsTourOpen(false)} accentColor={COLORS.defaultColor} rounded={5}  disableDotsNavigation={true}/>
      {errorMessage && <ValidationError key={errorKey} message={errorMessage} />}
        <DndProvider backend={TouchBackend} options={{ enableMouseEvents: true }}>
          <div>
            <Container onSubmitCall={handleContainerSubmitCall} tutorialStep={selectedExample}/>
            <CustomDragLayer />
          </div>
        </DndProvider>
    </>
  );

  
};

export default withAuth(TutorialAutomation);