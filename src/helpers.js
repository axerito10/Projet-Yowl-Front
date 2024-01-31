export const getToken = () => {
    const jwtToken = sessionStorage.getItem('jwt');
return jwtToken
};

export const getTokenFirebase = () => {
    const jwtTokenFirebase = sessionStorage.getItem('firebaseToken');
return jwtTokenFirebase
};

export const getUserId = () => {
    const idUser = sessionStorage.getItem('userId');
return idUser
};

export const logout = () => {
    sessionStorage.removeItem('jwt');
    sessionStorage.removeItem('userId');
};