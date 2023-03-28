import { useState, useEffect } from 'react';
import 'animate.css';

function ValidationError({ message }) {
  const [visible, setVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    setVisible(true);
  
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000);
  
    setTimeoutId(timer);
  
    return () => clearTimeout(timer);
  }, [message]);

  return (
    <>
      {visible ? (
        <div className="position-fixed top-0 start-0 m-3">
          <div className="animate__animated animate__bounceIn d-flex align-items-center justify-content-center bg-danger text-white rounded py-3 px-4 animate__faster">
            {message}
          </div>
        </div>
      ) : (
        <div className="position-fixed top-0 start-0 m-3">
          <div className="animate__animated animate__bounceOut d-flex align-items-center justify-content-center bg-danger text-white rounded py-3 px-4 animate__faster">
            {message}
          </div>
        </div>
      )}
    </>
  );
}
  
export default ValidationError;