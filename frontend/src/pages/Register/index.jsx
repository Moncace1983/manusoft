import { useEffect, useState } from "react";
import styles from "../Register/register.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faUser,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-regular-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [objData, setObjData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isDisabled, setIsDisabled] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMsg, setSuccessMsg] = useState(""); // Nuevo estado para el mensaje

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
      username: "El nombre es requerido",
      email: "Debes ingresar un email válido",
      password:
        "La contraseña debe tener al menos 6 caracteres y una mayúscula",
    };

    let errorMessage = null;

    if (!value.trim()) {
      errorMessage = `El ${name} es requerido`;
    } else if (name === "password") {
      if (value.length < 6 || !/[A-Z]/.test(value)) {
        errorMessage = errorMessages[name];
      }
    } else if (name === "email") {
      const isValidEmail = /\S+@\S+\.\S+/.test(value);
      if (!isValidEmail) {
        errorMessage = errorMessages[name];
      }
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
  };

  const handleChange = ({ target: { value, name } }) => {
    setObjData({
      ...objData,
      [name]: value,
    });

    validations(name, value);
  };

  const API_URL = import.meta.env.VITE_API_URL;

  const senData = async () => {
    try {
      console.log("Enviando datos", objData);

      const response = await fetch("${API_URL}/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(objData),
      });

      if (response.status === 400) {
        const responseData = await response.json();
        console.log(responseData.errors);
        const errorMessages = {};
        responseData.errors.forEach((error) => {
          errorMessages[error.path] = error.msg;
        });
        setErrors(errorMessages);
        throw new Error("Error en la validación de datos");
      } else {
        const data = await response.json();
        setSuccessMsg("¡Registro exitoso! Redirigiendo al login...");
        setTimeout(() => {
          sessionStorage.setItem("authToken", data.token);
          sessionStorage.setItem("userData", JSON.stringify(data.username));
          navigate("/");
        }, 5000); // Espera unos segundos antes de redirigir
      }
    } catch (error) {
      console.error("There was an error posting data", error);
    }
  };

  const handleReset = () => {
    setObjData({
      username: "",
      email: "",
      password: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    senData();
    handleReset();
  };

  return (
    <div>
      <div className={styles.containerRegister}>
        <div>
          <h2 className={styles.titleRegister}>Registrar Usuario</h2>
          {successMsg && (
            <div
              style={{
                color: "green",
                textAlign: "center",
                marginBottom: "10px",
              }}
            >
              {successMsg}
            </div>
          )}
          <form className={styles.formRegister} onSubmit={handleSubmit}>
            <div className={styles.container_labelRegister}>
              <label>Nombre de usuario</label>
            </div>
            <div className={styles.input_containerRegister}>
              <FontAwesomeIcon icon={faUser} className={styles.iconRegister} />
              <input
                className={styles.inputRegister}
                type="text"
                name="username"
                onChange={handleChange}
                value={objData.username}
              />
            </div>
            {errors.username && (
              <span className={styles["error-message"]}>{errors.username}</span>
            )}

            <div className={styles.container_labelRegister}>
              <label>Email</label>
            </div>
            <div className={styles.input_containerRegister}>
              <FontAwesomeIcon
                icon={faEnvelope}
                className={styles.iconRegister}
              />
              <input
                className={styles.inputRegister}
                type="email"
                name="email"
                onChange={handleChange}
                value={objData.email}
              />
            </div>
            {errors.email && (
              <span className={styles["error-message"]}>{errors.email}</span>
            )}

            <div className={styles.container_labelRegister}>
              <label>Contraseña</label>
            </div>
            <div className={styles.input_containerRegister}>
              <FontAwesomeIcon icon={faLock} className={styles.iconRegister} />
              <input
                className={styles.inputRegister}
                type={showPassword ? "text" : "password"}
                name="password"
                onChange={handleChange}
                value={objData.password}
              />
              <FontAwesomeIcon
                icon={showPassword ? faEyeSlash : faEye}
                className={styles.eye_iconRegister}
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
              Registrarse
            </button>
          </form>
          <p style={{ textAlign: "center", color: "blue", marginLeft: "80px" }}>
            ¿Ya tienes cuenta? |{" "}
            <Link className={styles.link_register} to="/">
              Inicia Sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
