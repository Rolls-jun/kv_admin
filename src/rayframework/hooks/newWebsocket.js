import { ws_adress } from './index.js';
function useWebsocket(handleMessage, handleOpen, handleClose, handleError) {
  const ws = new WebSocket(ws_adress);
  const init = () => {
    bindEvents();
  };

  function bindEvents() {
    ws.addEventListener('open', handleOpen, false);
    ws.addEventListener('close', handleClose, false);
    ws.addEventListener('error', handleError, false);
    ws.addEventListener('message', handleMessage, false);
  }
  init();
  return ws;
}
export default useWebsocket;
