import { getToken } from './authenticate';

async function apiCall(method, path){
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`,{
    method,
    headers:{ Authorization:`JWT ${getToken()}` }
  });
  if(res.status===200) return res.json();
  return [];
}

export async function addToFavourites(id){ return apiCall('PUT', `/favourites/${id}`); }
export async function removeFromFavourites(id){ return apiCall('DELETE', `/favourites/${id}`); }
export async function getFavourites(){ return apiCall('GET', `/favourites`); }

export async function addToHistory(q){ return apiCall('PUT', `/history/${encodeURIComponent(q)}`); }
export async function removeFromHistory(q){ return apiCall('DELETE', `/history/${encodeURIComponent(q)}`); }
export async function getHistory(){ return apiCall('GET', `/history`); }
