export const encodeToken = (v: any) => btoa(encodeURIComponent(v));
export const decodeToken = (v: any) => decodeURIComponent(atob((v)));