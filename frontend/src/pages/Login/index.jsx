import { useEffect, useState } from "react";
import styles from "../Login/login.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const [objData, setObjData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isDisabled, setIsDisabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { setAuthData } = useAuth(); // Obtiene el token del contexto de autenticación

  useEffect(() => {
    const isValid = Object.values(errors).every((error) => !error);
    const allFieldsFilled = Object.values(objData).every(
      (value) => value.trim() !== ""
    );
    setIsDisabled(!isValid || !allFieldsFilled);
  }, [errors, objData]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validations = (name, value) => {
    const errorMessages = {
      username: "EL nombre del usuario debe tener al menos 3 caracteres",
      password:
        "La contraseña debe de tener al menos 6 caracteres y una mayúscula",
    };

    let errorMessage = null;

    if (!value.trim()) {
      errorMessage = `El ${name} es requerido`;
    } else if (name === "password") {
      if (value.length < 6 || !/[A-Z]/.test(value)) {
        errorMessage = errorMessages[name];
      }
    } else if (name === "username") {
      if (value.length < 3) {
        errorMessage = errorMessages[name];
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  const handleChange = ({ target: { name, value } }) => {
    setObjData({
      ...objData,
      [name]: value,
    });

    validations(name, value);
  };

  const API_URL = import.meta.env.VITE_API_URL;
  const senData = async () => {
    try {
      //console.log("Enviando datos", objData); // Verifica que se esta enviando
      const response = await fetch(`${API_URL}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(objData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Login fallido:", errorData);
        setErrors({
          username: errorData.message || "Error interno del servidor",
        });
        return;
      }

      const data = await response.json();
      console.log("Login successful", data);
      sessionStorage.setItem("authToken", data.token);
      sessionStorage.setItem("userData", JSON.stringify(data.username));
      setAuthData(data.token, data.username);
      navigate("/home");
    } catch (error) {
      console.error("There was an error posting data", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    senData();
  };

  return (
    <div>
      <div className={styles.container}>
        <h2 className={styles.titleInicio}>Iniciar Sesión</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.containerLabel}>
            <label>Usuario</label>
          </div>
          <div className={styles.inputContainer}>
            <FontAwesomeIcon icon={faUser} className={styles.icon} />
            <input
              className={styles.inputLogin}
              type="text"
              name="username"
              onChange={handleChange}
              value={objData.username}
            />
          </div>

          {errors.username && (
            <span className={styles["error-message"]}>{errors.username}</span>
          )}

          <div className={styles.containerLabel}>
            <label>Contraseña</label>
          </div>
          <div className={styles.inputContainer}>
            <FontAwesomeIcon icon={faLock} className={styles.icon} />
            <input
              className={styles.inputLogin}
              type={showPassword ? "text" : "password"}
              name="password"
              onChange={handleChange}
              value={objData.password}
            />
            <FontAwesomeIcon
              icon={showPassword ? faEyeSlash : faEye}
              className={styles.eyeIcon}
              onClick={togglePasswordVisibility}
            />
          </div>

          {errors.password && (
            <span className={styles["error-message"]}>{errors.password}</span>
          )}

          <button
            style={isDisabled ? { opacity: 0.5 } : null}
            disabled={isDisabled}
            className={styles.button}
          >
            Login
          </button>
        </form>
        <p>
          ¿Deseas crear una cuenta?|
          <Link className={styles.inicioLink} to="/register">
            Crear Cuenta
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
