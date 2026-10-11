
const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body.message;

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "Você é o Vocazinho, um chatbot divertido que responde em português brasileiro."
            },
            { role: "user", content: message }
          ]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: "Erro ao consultar a IA." });
    }

    res.json({
      reply: data.choices[0].message.content
    });
  } catch (error) {
    res.status(500).json({ error: "Erro no servidor." });
  }
});

app.get("/", (req, res) => {
  res.send("Servidor do Vocazinho está funcionando!");
});

app.listen(process.env.PORT || 3000);
