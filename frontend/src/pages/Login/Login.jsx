import './login.css'
import { Tilt } from 'react-tilt'
import { useEffect, useState } from 'react'
import Loader from '../../components/Loader/Loader'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom'
import { loginAdmin } from './../../features/AdminSlice';


const Login = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [user, setUser] = useState({
        email: '', password: ''
    });
    const [loading, setLoading] = useState(false);

    const admin = useSelector((state) => state.admin);

    useEffect(() => {
        if (admin._id) {
            navigate('/_mailer')
        }
    }, [navigate, admin])

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    const defaultOptions = {
        reverse: false,  // reverse the tilt direction
        max: 55,     // max tilt rotation (degrees)
        perspective: 1000,   // Transform perspective, the lower the more extreme the tilt gets.
        scale: 1.1,    // 2 = 200%, 1.5 = 150%, etc..
        speed: 1000,   // Speed of the enter/exit transition
        transition: true,   // Set a transition on enter/exit.
        axis: null,   // What axis should be disabled. Can be X or Y.
        reset: true,    // If the tilt effect has to be reset on exit.
        easing: "cubic-bezier(.03,.98,.52,.99)",    // Easing on enter/exit.
    }
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = async (event) => {
        setLoading(true);
        event.preventDefault();
        dispatch(loginAdmin(user)).then(() => {
            setLoading(false);
        });
    }

    return (
        <div className='sign_up'>
            <div className="signup-main">
                <div className="left">
                    <Tilt options={defaultOptions} style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <img className='left-img w-2/3 p-3 md:w-full' src="https://res.cloudinary.com/dztkzhtla/image/upload/v1684817261/html%20mailer/bglogin_spn4f2.webp" alt="" />
                        {/* <img className='left-img w-1/2' src="https://res.cloudinary.com/dztkzhtla/image/upload/v1692338397/html%20mailer/We-Avec-U-logo-PNG_i4umth.webp" alt="" /> */}
                    </Tilt>
                </div>
                <div className="right">
                    <form onSubmit={handleSubmit}>
                        <span className='create-account-span'>Login to Your Account</span>
                        <input type="email" name="email" value={user.email} onChange={handleChange} required={true} placeholder='Enter Email' />
                        <input type="password" name="password" value={user.password} onChange={handleChange} required={true} placeholder='Enter Password' autoComplete='current-password' />
                        <button type="submit">
                            {
                                loading ? <Loader /> : "Login"
                            }
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Login