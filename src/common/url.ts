export const BASE_URL = 'http://localhost:3001';
const API_VERSION = '/api/v1';

export const urls = Object.freeze({
    endpoints: {
        customer: {
            customer: `${BASE_URL}${API_VERSION}/customer`,
        },
        vendor: {
            vendor: `${BASE_URL}${API_VERSION}/vendor`,
        },
        rawMaterial: {
            rawMaterial: `${BASE_URL}${API_VERSION}/rawmaterial`
        }
    }
});