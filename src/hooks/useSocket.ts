import { useContext } from 'react';
import { SocketContext } from 'contexts/SocketContext';

const useSocket = () => {
  const socketContext = useContext(SocketContext);

  if (socketContext === undefined) {
    throw new Error('Socket context undefined');
  }

  return socketContext;
};

export default useSocket;
