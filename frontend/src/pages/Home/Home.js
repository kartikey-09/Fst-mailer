import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar/Navbar';
import './home.css'
import ParticlesBackground from './ParticlesBackground'

const Home = () => {
    const navigate = useNavigate();
    const admin = useSelector((state) => state.admin);


    useEffect(() => {
        if (!admin._id) {
            navigate('/login')
        }
    }, [navigate, admin])


    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])


    return (
        <div>
            <ParticlesBackground />
            <Navbar />
            <div className="main-container">
                <div className="content">
                    <h1>WELCOME TO FST MAILER</h1>
                    <Link to='/_compose' ><button className='font-[Roboto]'>Click Here to Start Writing</button></Link>
                </div>
            </div>
        </div>
    )
}

export default Home