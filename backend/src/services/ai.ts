import OpenAI from 'openai';

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `Eres Smart Tribut, un asistente experto en tributación y fiscalidad. 
Tu rol es ayudar a los usuarios con consultas sobre impuestos, declaraciones fiscales, 
deducciones, IVA, IRPF, y legislación tributaria vigente.
Responde siempre en el idioma en que te hagan la pregunta (español, inglés o francés).
Sé claro, preciso y cita referencias legales cuando sea relevante.
Siempre recuerda al usuario que tus respuestas son orientativas y no sustituyen el asesoramiento profesional.`;

export async function askAI(query: string, history: { role: 'user' | 'assistant', content: string }[] = []) {
  const response = await client.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history,
      { role: 'user', content: query },
    ],
    max_tokens: 800,
    temperature: 0.7,
  });

  return response.choices[0].message.content || 'No se pudo generar una respuesta.';
}
