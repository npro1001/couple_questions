import Image from "next/image";
import Head from 'next/head';
import Header from "./components/Header"
import Menu from "./components/Menu"
import Form from "./components/Form"

export default function App() {
  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await fetch('/api/auth/me');
        console.log('Token validated', response.data);
        // Handle successful validation
      } catch (error) {
        console.error('Error validating token', error);
        // Handle error, possibly redirect to login
      }
    };

    validateToken();
  }, []);

  return (
    
    <div>
      
      </div>
  );
}
