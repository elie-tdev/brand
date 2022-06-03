import * as firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

// TODO: create config service
const config = {
  apiKey: 'AIzaSyDza3Z-pu9HrO63dhHYtb_P0Jy_nod8Ogc',
  authDomain: 'onebrand-dev-1e9e6.firebaseapp.com',
  databaseURL: 'https://onebrand-dev-1e9e6.firebaseio.com',
  projectId: 'onebrand-dev-1e9e6',
  storageBucket: 'onebrand-dev-1e9e6.appspot.com',
  messagingSenderId: '328127408388',
}

if (!firebase.apps.length) {
  firebase.initializeApp(config)
}

export const auth = firebase.auth()
export { firebase }
