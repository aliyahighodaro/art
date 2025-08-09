import { jwtDecode } from 'jwt-decode';

function setToken(token){ localStorage.setItem('access_token', token); }
export function getToken(){ try{ return localStorage.getItem('access_token'); }catch{ return null; } }
export function removeToken(){ localStorage.removeItem('access_token'); }
export function readToken(){ try{ const t=getToken(); return t?jwtDecode(t):null; }catch{ return null; } }
export function isAuthenticated(){ return !!readToken(); }

export async function authenticateUser(user, password){
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`,{
    method:'POST',
    headers:{'content-type':'application/json'},
    body: JSON.stringify({ userName:user, password })
  });
  const data = await res.json();
  if(res.status===200){ setToken(data.token); return true; }
  else{ throw new Error(data.message); }
}

export async function registerUser(user, password, password2){
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`,{
    method:'POST',
    headers:{'content-type':'application/json'},
    body: JSON.stringify({ userName:user, password, password2 })
  });
  const data = await res.json();
  if(res.status===200){ return true; }
  else{ throw new Error(data.message); }
}
