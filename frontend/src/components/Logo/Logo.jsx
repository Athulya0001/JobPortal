import React, { useContext } from 'react'
import { ThemeContext } from '../../Context/ThemeContext'

const Logo = () => {
    const {darkMode} = useContext(ThemeContext)
    return (
        <div className={`${darkMode ? " text-white" : " text-black"
            }`}>
            <h1 className="text-3xl font-bold">
                ne
                <span className="text-3xl text-[#0096FF]">X</span>
                tHire
            </h1>
        </div>
    )
}

export default Logo