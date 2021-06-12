import React, { useEffect, useState } from 'react';
import { execTest } from 'lib/api/test';

const App: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const handleExecTest = async () => {
    const response = await execTest();
    if (response.status === 200) {
      setMessage(response.data.message);
    }
  }

  useEffect(() => {
    handleExecTest();
  }, []);

  return (
    <h1>{message}</h1>
  )
}
export default App;
