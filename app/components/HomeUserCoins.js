import React from "react";
import Image from 'next/image'
import { useAuth } from '../../contexts/AuthContext'


export default function HomeUserCoins() {
    const { user } = useAuth();

    return <div className="flex-grow flex items-start justify-around mt-5">
            <div className="flex flex-col">
              <div className="stats bg-primary bg-opacity-85 text-primary-content">

                <div className="stat">
                  <div className="stat-title text-primary-content">Q-coins</div>
                  <div className="flex flex-row justify-around items-center">
                    <Image className="w-full h-auto" src="/coin.png" alt="coin" width={30} height={30} />
                    <div className="stat-value ml-2">{user.questionCredits?.toString()}</div>
                  </div>
                </div>

                <div className="stat">
                  <div className="stat-title text-primary-content">Q-skips</div>
                  <div className="flex flex-row justify-around items-center">
                    <Image className="w-full h-auto" src="/skip.png" alt="coin" width={30} height={30} />
                    <div className="stat-value ml-2">{user.questionSkipCredits?.toString()}</div>
                  </div>
                </div>

              </div>
              <div className="stat-actions w-full mt-2">
                <button className="btn btn-sm btn-success w-full hover:btn-primary">Add more Q-coins</button>
              </div>
            </div>
          </div>;
}
  