import {createContext, useEffect, useState} from "react";
import axios from 'axios';

export const UserContext = createContext({});

export function UserContextProvider({children}) {
    const [isEditor, setIsEditor] = useState(false);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (localStorage.getItem('token')) {
            axios.post("/check.php", { token: localStorage.getItem('token') }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            })
            .then(response => {
                if (response.data.invalid_token) {
                    console.log("invalid_token");
                }
                else {
                    setIsEditor(true);
                }

                setReady(true);
            })
            .catch(error => {
                console.log('DB Error ', error);
            });
        }
        else {
            setReady(true);
        }
    }, []);
    return (
        <UserContext.Provider value={{isEditor, setIsEditor, ready}}>
            {children}
        </UserContext.Provider>
    );
}