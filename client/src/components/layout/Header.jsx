import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate, } from 'react-router-dom'
import firebase from '../../firebase.js'

// icon
import { IoMdSearch } from "react-icons/io";

const Header = () => {
    // 시간
    const [selectedTimezone, setSelectedTimezone] = useState('KOREA');
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, [currentTime]);

    const getTimeWithOffset = (offset) => {
        const localTime = new Date();
        const utc = localTime.getTime() + localTime.getTimezoneOffset() * 60000;
        const newTime = new Date(utc + 3600000 * offset);
        return newTime.toLocaleTimeString();
    };

    const renderTimeInfo = (timezone, offset, label) => {
        return (
            <option value={timezone}>
                {label}: {getTimeWithOffset(offset)} (GMT{offset >= 0 ? '+' : ''}{offset})
            </option>
        );
    };

    const handleChangeTimezone = (e) => {
        setSelectedTimezone(e.target.value);
    };

    // 로그아웃
    const user = useSelector(state => state.user);
    // console.log(user);
    const navigate = useNavigate();

    const LogoutHandler = () => {
        firebase.auth().signOut();
        navigate("/");
    }

    // option 링크

    const handleChange = (event) => {
        // 사용자가 선택한 값에 따라 URL 변경
        const path = event.target.value;
        if (path) {
            navigate(`/${path}`);
        }
    };

    const HomeLink = () => {
        navigate('/')
    }

    return (
        <header id="header">
            <div className="header__left">
                <h1 className="logo" onClick={HomeLink}>
                    KICKOFF
                </h1>
                <div className="search">
                    <IoMdSearch />
                    <label htmlFor="search">SEARCH</label>
                    <input type="text" name="search" placeholder="Premier League, Chelsea" />
                </div>
            </div>

            <div className="header__right">
                <div className="link">
                    <label htmlFor="link" className="blind">LINK</label>
                    <select name="link" id="link" onChange={handleChange}>
                        <option value="NOTICE">NOTICE</option>
                        <option value="boardlist">BOARD</option>
                    </select>
                </div>
                <div className="time">
                    <label htmlFor="time" className="blind">LINK</label>
                    <select name="time" id="lintimek" onChange={handleChangeTimezone} value={selectedTimezone}>
                        {renderTimeInfo('KOREA', 9, 'Korea')}
                        {renderTimeInfo('LONDON', 1, 'London')}
                        {renderTimeInfo('USA', -5, 'USA')}
                    </select>
                </div>
                <div className="login">
                    {user.accessToken === "" ? (
                        <Link to="/login">
                            LOGIN
                        </Link>
                    ) : (
                        <Link onClick={(() => LogoutHandler())}>
                            Logout
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}

export default Header