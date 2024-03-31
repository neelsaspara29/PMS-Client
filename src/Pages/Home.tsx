import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setLogout } from '../store/slice/auth';

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleLogout = (e:any) => {
        e.preventDefault();
        dispatch(setLogout());
        navigate('/login');
    }
    return <>
        <div>home</div>
        <button onClick={handleLogout}>Logout</button>
    </>
}

export default Home;