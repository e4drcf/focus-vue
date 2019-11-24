import router from '../router'
import io from 'socket.io-client';
class ViewManager {
    constructor () {
        this.status = null;
        this.socket = null;
    }
    changeView() {
        switch(this.status) {
            case 'CONNECTED':
            router.push({name: 'connected'});
            break;
            case 'FAILED':
            router.push({name: 'failed'});
            break;
            case 'ANSWERED':
            router.push({name: 'answered'})
            break;
        }
    }
    checkStatus() {
        this.socket = io.connect('http://localhost:3000');
        this.socket.on('status', (status) => {
        this.status = status;
        this.changeView();
        })
    }
    stopListening () {
        this.socket.disconnect();
    }
}
export default new ViewManager()