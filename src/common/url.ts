export const BASE_URL = 'http://localhost:3001';
// export const BASE_URL = 'http://139.59.19.212:3001';
const API_VERSION = '/api/v1';

export const urls = Object.freeze({
    endpoints: {
        customer: {
            customer: `${BASE_URL}${API_VERSION}/customer`,
        },
        employee: {
            employee: `${BASE_URL}${API_VERSION}/employee`,
            login: `${BASE_URL}${API_VERSION}/employee/login`,
            getAll: `${BASE_URL}${API_VERSION}/employee`,
            logout: `${BASE_URL}${API_VERSION}/employee/logout`
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
            getAll: `${BASE_URL}${API_VERSION}/product`
        },
        machine: {
            machine: `${BASE_URL}${API_VERSION}/machine`,
            getAll: `${BASE_URL}${API_VERSION}/machine`,
            maintenance: `${BASE_URL}${API_VERSION}/machine/maintenance`,
        },
        order: {
            order: `${BASE_URL}${API_VERSION}/order`
        },
        inventory: {
            inventory: `${BASE_URL}${API_VERSION}/inventory`
        },
        production: {
            create: `${BASE_URL}${API_VERSION}/production`,
            getAll: `${BASE_URL}${API_VERSION}/production`,
            status: (productionId: number)=>`${BASE_URL}${API_VERSION}/production/${productionId}`
        }
    }
});