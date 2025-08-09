import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { isAuthenticated } from '@/lib/authenticate';
import { useAtom } from 'jotai';
import { favouritesAtom, searchHistoryAtom } from '@/store';
import { getFavourites, getHistory } from '@/lib/userData';

const PUBLIC_PATHS=['/login','/register','/'];

export default function RouteGuard({ children }){
  const router=useRouter();
  const [authorized,setAuthorized]=useState(false);
  const [,setFavouritesList]=useAtom(favouritesAtom);
  const [,setSearchHistory]=useAtom(searchHistoryAtom);

  async function updateAtoms(){
    setFavouritesList(await getFavourites());
    setSearchHistory(await getHistory());
  }

  useEffect(()=>{
    const urlCheck=(url)=>{
      const path=url.split('?')[0];
      if(!isAuthenticated() && !PUBLIC_PATHS.includes(path)){
        setAuthorized(false);
        router.push('/login');
      }else{
        setAuthorized(true);
      }
    };
    updateAtoms();
    urlCheck(router.asPath);
    const handleRouteChange=(url)=>urlCheck(url);
    router.events.on('routeChangeStart',handleRouteChange);
    return ()=>{ router.events.off('routeChangeStart',handleRouteChange); };
  },[]);

  return authorized?children:null;
}
