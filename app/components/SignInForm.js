"use client"

import React, { useState } from 'react';
import FontAwesomeIcon from '../fontawesome';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

export default function SignInForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const { signIn, loading } = useAuth();
    const router = useRouter();


    const handleSubmit = async (e) => {
        console.log('Signing in...');
        e.preventDefault();
        setError('');
        try {
            await signIn(email, password);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleGoogleSignIn = () => {
        // TODO Implement Google Sign-In logic here
        // For example, redirect to an OAuth route
        window.location.href = '/api/auth/google';
      };


    return (
        <>
            <div className="flex items-center flex-col justify-center min-h-screen">
                <h2 className="font-playwrite text-3xl mb-10">Couple Questions</h2>

                <div className="px-5 py-5 border border-spacing-6 rounded-xl bg-neutral border-base-300 shadow-lg">
                    <div className="w-full max-w-md p-8 space-y-6"> 
                        {/* <h2 className="text-2xl font-bold text-center">Sign Up</h2> */}

                        <form onSubmit={handleSubmit} className="space-y-4">

                            {error && <div role="alert" className="alert alert-error">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6 shrink-0 stroke-current"
                                    fill="none"
                                    viewBox="0 0 24 24">
                                    <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                                </div>
                            }


                            {/* Email */}
                            <label className="input input-bordered flex items-center gap-2 bg-base-100 border-secondary">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    className="h-4 w-4 opacity-70">
                                    <path
                                        d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                                    <path
                                        d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                                </svg>
                                <input type="email" value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="grow"
                                    placeholder="Email" 
                                    // required
                                />
                            </label>

                            {/* Password */}
                            <label className="input input-bordered flex items-center gap-2 bg-base-100 border-secondary">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 16 16"
                                    fill="currentColor"
                                    className="h-4 w-4 opacity-70">
                                    <path
                                        fillRule="evenodd"
                                        d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                        clipRule="evenodd" />
                                </svg>
                                <input type="password"
                                    className="grow"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    // required 
                                />
                            </label>

                            {/* Buttons */}
                            { !loading ? (
                                <>
                                    <button type="submit" className="btn w-full text-pa bg-secondary text-primary-content hover:text-base-content">
                                        Sign in
                                    </button>
                                    <div className="divider divider-base-content text-base-content">OR</div>
                                    <button type="button" className="btn w-full text-pa  bg-secondary text-primary-content hover:text-base-content">
                                        <FontAwesomeIcon icon="fa-brands fa-google" bounce/>
                                        Sign in with Google
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="flex justify-around items-center pt-8">
                                        <span className="loading loading-ring loading-lg"></span>
                                    </div>
                                </>)
                            }

                        </form>
                    </div>
                </div>
            </div>
        </>
    );
}