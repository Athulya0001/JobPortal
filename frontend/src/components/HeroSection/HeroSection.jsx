import React, { useContext } from 'react'
import { motion } from 'framer-motion';
import { ThemeContext } from '../../Context/ThemeContext';
import SearchBar from '../SearchBar/SearchBar';

const HeroSection = () => {
    const { darkMode } = useContext(ThemeContext);
    return (
        <div
            className={`mt-[145px] pt-15 h-[50vh] flex items-start gap-15 justify-center px-4 transition duration-300 ${darkMode ? "text-white" : "text-black"
                }`}
        >
            <SearchBar />
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="text-center max-w-2xl"
            >
                <h1 className="text-4xl font-extrabold text-[#0096FF] mb-4">
                    Welcome to{' '}
                    <span>
                        ne<span className={`${darkMode ? 'text-white' : 'text-black'} drop-shadow-2xl`}>
                            X
                        </span>tHire
                    </span>
                </h1>

                <p className="text-lg mb-2">
                    Everything you need to hire or get hired — all in one place.
                </p>
                <p className="text-md opacity-55">
                    Discover your next opportunity or find the perfect candidate.
                </p>
            </motion.div>
        </div>
    )
}

export default HeroSection