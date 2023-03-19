// export const environment = {
//   production: true,
//   azure: {
//     issuer: "https://idsvr4.azurewebsites.net",
//     redirectUri: window.location.origin + '/index.html',
//     clientId: 'spa',
//     reponseType: 'code',
//     scope: "openid, profile email offline_access api",
//     showDebugInformation: true
//   }
// }

import {KeycloakConfig} from 'keycloak-js';
import { JOBBER_CLIENT, JOBBER_ISSUER, JOBBER_REALM } from './keycloak-parameter';

const keycloakConfig: KeycloakConfig = {
    url: `${JOBBER_ISSUER}`,
    // url: `${JOBBER_ISSUER}/auth`,
    realm: `${JOBBER_REALM}`,
    clientId: `${JOBBER_CLIENT}`
};

export const environment = {
    production: true,
    apiPath: '/api',
    keycloak: keycloakConfig,
    url: 'http://localhost:3000/api/v1',  // nestjs api
    // url: 'https://192.168.1.248:3030/api/v1',  // nestjs api
};