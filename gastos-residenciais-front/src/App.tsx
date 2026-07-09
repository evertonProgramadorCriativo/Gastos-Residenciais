import { useEffect, useState } from "react";
import { apiGet } from "./lib/api";
import type { Pessoa } from "./types/pessoa";

function App() {
  const [pessoas, setPessoas] = useState<Pessoa[] | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    apiGet<Pessoa[]>("/health/db")
      .then((dados) => setPessoas(dados))
      .catch((err) => setErro(err.message));
  }, []);

  if (erro) {
    return <p style={{ color: "red" }}>Erro ao conectar com a API: {erro}</p>;
  }

  if (pessoas === null) {
    return <p>Carregando...</p>;
  }

  return (
    <div>
      <h1>
        Front end Conversando com <br /> <br /> backend e o banco de dados teste
      </h1>

      <pre>{JSON.stringify(pessoas, null, 2)}</pre>
    </div>
  );
}

export default App;
