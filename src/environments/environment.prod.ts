
export const environment = {
    production: true,
    apiPath: '/api',
    url: 'http://nestjs-service.nest-ns.svc.cluster.local:3000/api/v1',   // nestjs api
    // url: 'http://34.127.113.47:3000/api/v1',  // nestjs api
    redirectUri: 'http://localhost:4200/',
    firebase: {
        apiKey: "AIzaSyBPmnWZU8ENexukmayvbxtyxZhcyRse-tU",
        authDomain: "first-metric-377704.firebaseapp.com",
        projectId: "first-metric-377704",
        storageBucket: "first-metric-377704.appspot.com",
        messagingSenderId: "649361098659",
        appId: "1:649361098659:web:1072a8448360ab1a037c16",
        measurementId: "G-DXVCXF9X63"
      }
};