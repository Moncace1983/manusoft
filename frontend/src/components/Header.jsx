import styles from "./styles/Header.module.css";
import logo from "../assets/manu.png";

function Header() {
  return (
    <header className={styles.header}>
      <img className={styles.logo} src={logo} alt="Logo" />
      <h1 className={styles.header_title}>MANUSOFT</h1>
    </header>
  );
}

export default Header;
