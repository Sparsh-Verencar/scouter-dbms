"use client";

import { useEffect, useState } from "react";

export function useUser() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        async function loadUser() {
            try {
                const res = await fetch("http://localhost:3001/api/auth/free-me", {
                    method: "GET",
                    credentials: "include",
                });


                if (!res.ok) {
                    if (isMounted) {
                        setUser(null);
                        setLoading(false);
                    }
                    return;
                }

                const data = await res.json();

                if (isMounted) {
                    console.log(data.user)
                    setUser(data.user);
                    setLoading(false);
                }
            } catch (err) {
                if (isMounted) {
                    console.error(err);
                    setUser(null);
                    setLoading(false);
                }
            }
        }

        loadUser();
        return () => (isMounted = false);
    }, []);

    return { user, loading };
}
