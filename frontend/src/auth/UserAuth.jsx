import React,{useState,useContext,useEffect} from 'react'
import {useNavigate} from 'react-router'
import {UserContext} from '../context/UserContext'

const userAuth = ({children}) => {
    const {user} = useContext(UserContext)

    const[loading,setLoading] = useState(true);
    const token = localStorage.getItem("token");
  
    const navigate = useNavigate();
  
    
    useEffect(() => {

      if(token || user){
        setLoading(false);
      }

      if(!token || !user){
        navigate('/login');
      }
    },[])
    
    
    if(loading){
      return <div>Loading.....</div>
    }
  
  
    return (
      <>
      {children}
      </>
    )
}

export default userAuth
