import http from '../../utils/request';

export const getPermission = async () => {
    return await http.get('/SystemManagement/Permissions');
};

export const getPermissions = async (paginationQueryParams) => {
    return await http.get('/SystemManagement/Permissions', {
        params: paginationQueryParams,
    });
};

export const addPermission = async (addPermissionParams) => {
    return await http.post('/SystemManagement/Permissions/', addPermissionParams);
};

export const editPermission = async (editPermissionParams) => {
    return await http.put('/SystemManagement/Permissions/', editPermissionParams);
};

export const deletePermission = async (permissionId) => {
    return await http.delete('/SystemManagement/Permissions/' + permissionId);
};

export const deletePermissions = async (deletePermissionParams) => {
    return await http.delete('/SystemManagement/Permissions/', { data: deletePermissionParams });
};
