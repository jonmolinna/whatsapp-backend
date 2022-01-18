export const validateRegister = (name, username, password, confirmPassword) => {
    const errors = {};

    if (name.trim() === '') {
        errors.name = 'El nombre no debe estar vacío';
    }
    else if (name.length <= 2) {
        errors.name = 'El nombre debe tener mas de 2 caracteres';
    }
    else {
        const nameRegex = /^[A-Za-zÑñÁáÉéÍíÓóÚúÜü\s]+$/;
        if (!name.match(nameRegex)) {
            errors.name = "Nombre solo acepta letras y espacios";
        }
    }

    if (username.trim() === '') {
        errors.username = 'El username no debe estar vacío';
    }
    else if (username.length <= 4) {
        errors.username = 'El username debe tener mas de 4 caracteres';
    }
    else {
        const usernameRegex = /^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/;
        if (!username.match(usernameRegex)) {
            errors.username = `${username} no es un username valido`;
        }
    }

    if (password === '') {
        errors.password = 'La contraseña no debe estar vacio';
    }
    else if (password !== confirmPassword) {
        errors.password = 'Las contraseñas deben coincidir';
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
};


export const validateLogin = (username, password) => {
    const errors = {};

    if (username.trim() === '') {
        errors.username = "El username no debe estar vacío";
    }

    if (password.trim() === '') {
        errors.password = "La constraseña no debe estar vacío";
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
};