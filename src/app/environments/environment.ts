
import {KeycloakConfig} from 'keycloak-js';
import { JOBBER_CLIENT, JOBBER_ISSUER, JOBBER_REALM } from './keycloak-parameter';

const keycloakConfig: KeycloakConfig = {
  url: JOBBER_ISSUER,
  realm: JOBBER_REALM,
  clientId: JOBBER_CLIENT
  // url: `${JOBBER_ISSUER}`,
  // realm: `${JOBBER_REALM}`,
  // clientId: `${JOBBER_CLIENT}`
};

export const environment = {
    production: false,
    apiPath: '/api/v1',
    keycloak: keycloakConfig,
    url: 'http://localhost:3000/api/v1',  // nestjs api
    // url: 'https://192.168.1.248:3030/api/v1',  // nestjs api
};