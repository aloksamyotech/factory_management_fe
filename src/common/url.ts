export const BASE_URL = 'http://localhost:3001';
const API_VERSION = '/api/v1';

export const urls = Object.freeze({
    endpoints: {
        customer: {
            customer: `${BASE_URL}${API_VERSION}/customer`,
        },
        employee: {
            employee: `${BASE_URL}${API_VERSION}/employee`,
            getAll: `${BASE_URL}${API_VERSION}/employee`
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
        },
        product: {
            product: `${BASE_URL}${API_VERSION}/product`,
            getAll: `${BASE_URL}${API_VERSION}/product/list`
        },
        machine: {
            machine: `${BASE_URL}${API_VERSION}/machine`,
            getAll: `${BASE_URL}${API_VERSION}/machine/list`,
        },
        order: {
            order: `${BASE_URL}${API_VERSION}/order`
        },
        inventory: {
            inventory: `${BASE_URL}${API_VERSION}/inventory`
        },
        production: {
            create: `${BASE_URL}${API_VERSION}/production`,
        }
    }
});