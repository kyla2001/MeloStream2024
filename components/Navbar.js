import React from "react";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { user, loading, loginWithGoogle, logout } = useAuth();

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      console.error(error);
      alert("Login Failed: " + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error(error);
      alert("Logout Failed: " + error.message);
    }
  };

  return (
    <nav className={styles.navbarContainer}>
      <div className={styles.navbarButtons}>
        <Link href="/" passHref>
          <button className="button is-normal is-light">Home</button>
        </Link>
        <Link href="/playlist" passHref>
          <button className="button is-normal is-light">Your Library</button>
        </Link>
      </div>
      <div>
        {loading ? (
          <div>Loading...</div>
        ) : user ? (
          <div style={{ justifyContent: "center", alignItems: "center", display: "flex"}}>
            <button className="button is-normal is-light" onClick={handleLogout}>
              Log out
            </button>
            <img
              src={user.photoURL || "/assets/default_avatar.jpeg"}
              alt="Profile"
              className={styles.profileImage}
              style={{marginLeft: "20px", marginRight: "20px"}}
            />
            <span style={{marginRight: "20px"}}>{user.displayName || "No Name"}</span>
          </div>
        ) : (
          <button className="button is-normal is-light" onClick={handleLogin}>
            Continue with Google
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
