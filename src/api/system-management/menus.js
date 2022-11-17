import http from '../../utils/request';

export const getMenu = async (menuId) => {
    return await http.get('/SystemManagement/Menus/' + menuId);
};

export const getMenus = async () => {
    return await http.get('/SystemManagement/Menus');
};

export const addMenu = async (addMenuParams) => {
    return await http.post('/SystemManagement/Menus', addMenuParams);
};

export const editMenu = async (editMenuParams) => {
    return await http.put('/SystemManagement/Menus', editMenuParams);
};

export const deleteMenu = async (menuId) => {
    return await http.delete('/SystemManagement/Menus/' + menuId);
};

export const deleteMenus = async (deleteMenuParams) => {
    return await http.delete('/SystemManagement/Menus', { data: deleteMenuParams });
};

export const editMenuEnabled = async (menuId, isEnabled) => {
    return await http.put(`/SystemManagement/Menus/${menuId}/Enabled`, isEnabled ? 'true' : 'false', { headers: { 'Content-Type': 'application/json' } });
};