// app/components/Header.js
import NavMenu from "./NavMenu"
import { useAuth } from '../../contexts/AuthContext';


export default function Header() {
    const { user } = useAuth();

    return (
      <div className="relative mt-3 flex flex-row justify-between w-full">

        <NavMenu/>
        
        <div className="absolute left-1/2 transform -translate-x-1/2 items-center align-middle justify-self-center">
          <h2 className="font-playwrite text-3xl">--CQ--</h2>
        </div>

        <div className="flex flex-shrink-0 items-center">
          <button className="btn btn-neutral-content hover:btn-primary" onClick={(e) => handleNewGame(e)}>Request Feature</button>
          <div className="avatar placeholder ml-3">
            <div className="bg-neutral text-neutral-content w-12 rounded-full">
              <span>{user.firstName[0].toUpperCase()}{user.lastName[0].toUpperCase()}</span>
            </div>
          </div>
        </div>

      </div>
    );
  }