import Cookies from 'js-cookie';
let BASE_URL = rayframework.webscoketUrl;

let rayAccessToken = Cookies.get('token');
// export let ws_adress = `ws://${BASE_URL}/rayim?rayAccessToken=${rayAccessToken}`;
export let ws_adress = `wss://${BASE_URL}/rayim?rayAccessToken=${rayAccessToken}`;
