import React, { useContext, useEffect, useState } from 'react';
import LoginForms from './components/LoginForm';
import {Context} from './index'
import { observer } from 'mobx-react-lite';
import UserService from './services/UserService';
import {IUser} from './models/IUser'

function App() {
  const [users, setUsers] = useState<IUser[]>([]);
  const {store} = useContext(Context);
  useEffect(()=>{
    if(localStorage.getItem('token')){
      store.checkAuth();
    }
  },[]);

  async function getUsers(){
    try{
      const responce = await UserService.fetchUsers();
      setUsers(responce.data);
    }catch(e){
        console.log((e as Error).message)
    }
  }

  if(store.isLoading)
    return <div>Загрузка...</div>
  
  if(!store.isAuth){
    return (<LoginForms/>);
  }

  return (
    <>
        <h1>{store.isAuth ? `Пользователь авторизован ${store.user.email}` : `Авторизуйтесь`}</h1>
        <h1>{String(store.user.isActivated)}</h1>
        <button onClick={()=>store.logout()}>Выйти</button>
        <div>
          <button onClick={()=>{getUsers()}}>Получить список пользователей</button>
        </div>
        {
          users.map(user=>(
            <div key={user.email}>
              <div>{user.email}</div>
              <div>{user.id}</div>
            </div>
          ))
        }
    </>
  );
}

export default observer(App);
