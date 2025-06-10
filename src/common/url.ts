export const BASE_URL = 'http://localhost:3001';
const API_VERSION = '/api/v1';

export const urls = Object.freeze({
    endpoints: {
        customer: {
            customer: `${BASE_URL}${API_VERSION}/customer`,
        },
        vendor: {
            vendor: `${BASE_URL}${API_VERSION}/vendor`,
            getAll: `${BASE_URL}${API_VERSION}/vendor/list`,
        },
        rawMaterial: {
            rawMaterial: `${BASE_URL}${API_VERSION}/rawmaterial`,
            getAll: `${BASE_URL}${API_VERSION}/rawmaterial/list`
        },
        purchase: {
            purchase: `${BASE_URL}${API_VERSION}/purchase`
        }
    }
});