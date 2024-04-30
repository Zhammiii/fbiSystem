import jwt from "jsonwebtoken";
import { results as agentesData } from "../data/agentes.js";

const myKey = "credenciales";
const tokenOptions = { expiresIn: "120s" };

export function signUser(req, res) {
  try {
    const { email, password } = req.query;

    const usuario = agentesData.find(
      (agente) => agente.email === email && agente.password === password
    );

    if (usuario) {
      const token = jwt.sign(
        {
          data: usuario,
        },
        myKey,
        tokenOptions
      );

      res.send(
        `<p>Bienvenido Agente <b>${email}</b></p>
        <a href="/dashboard?token=${token}" onclick="event.preventDefault(); sessionStorage.setItem('token', '${token}'); window.location.href = '/dashboard?token=${token}';">Ir a la página secreta</a>
`
      );
    } else {
      res.send(
        "No se ha podido iniciar sesión, email o contraseña incorrectos ⚠️"
      );
    }
  } catch (error) {
    res.status(500).json({
      error: "Error al procesar la solicitud",
      message: error.message,
    });
  }
}

export const restrictedPage = (req, res) => {
  try {
    const token = req.query.token || req.headers.authorization.split(" ")[1];
    jwt.verify(token, myKey, (err, decoded) => {
      if (err) {
        res.status(401).send({
          error: "Agente, su tiempo ha expirado ⌚. Vuelva a usar sus credenciales ",
          message: err.message,
        });
      } else {
        res.send(`Bienvenido a la pagina super secreta Agente <b>${decoded.data.email}</b> 🕵️`);
      }
    });
  } catch (error) {
    res.status(401).send({
      error: "Agente no autorizado, 💣💣 ",
      message: error.message,
    });
  }
};



