const businesses = {
  colmado: {
    name: '🏪 Colmado Don Pedro',
    menu: `📋 *Menú - Colmado Don Pedro*\n\n🍚 Arroz (lb) — RD$25\n🍗 Pollo (lb) — RD$120\n🥚 Huevos (docena) — RD$90\n🥛 Leche (litro) — RD$75\n🧃 Jugo — RD$50\n🥤 Refresco — RD$40\n🍞 Pan — RD$15\n🫙 Aceite (litro) — RD$180\n\n¿Deseas hacer un pedido?`,
    hours: '⏰ Horario: Lunes a Sábado 7am - 9pm\nDomingo 8am - 2pm',
  },
  cafeteria: {
    name: '☕ Cafetería La Esquina',
    menu: `📋 *Menú - Cafetería La Esquina*\n\n☕ Café — RD$50\n🥛 Café con leche — RD$75\n🧃 Jugo natural — RD$80\n🥐 Croissant — RD$60\n🥪 Sándwich — RD$120\n🍰 Pastel del día — RD$90\n🍳 Desayuno completo — RD$200\n\n¿Deseas hacer un pedido?`,
    hours: '⏰ Horario: Lunes a Viernes 6am - 6pm\nSábado 7am - 3pm',
  },
  tienda: {
    name: '👗 Tienda Moda Express',
    menu: `📋 *Catálogo - Moda Express*\n\n👗 Vestidos — desde RD$800\n👕 Camisetas — desde RD$350\n👖 Pantalones — desde RD$600\n👟 Zapatos — desde RD$1,200\n👜 Carteras — desde RD$500\n🧢 Gorras — desde RD$250\n\n¿Deseas ver más detalles de algún artículo?`,
    hours: '⏰ Horario: Lunes a Sábado 9am - 7pm',
  },
  farmacia: {
    name: '💊 Farmacia Salud Plus',
    menu: `📋 *Servicios - Farmacia Salud Plus*\n\n💊 Medicamentos con y sin receta\n🩺 Toma de presión — RD$50\n💉 Inyecciones — RD$100\n🩹 Primeros auxilios\n🧴 Productos de higiene\n👶 Artículos para bebé\n\n¿En qué te podemos ayudar?`,
    hours: '⏰ Horario: Todos los días 8am - 10pm',
  },
  restaurante: {
    name: '🍽️ Restaurante El Buen Sabor',
    menu: `📋 *Menú - El Buen Sabor*\n\n🍗 Pollo guisado + arroz + habichuelas — RD$250\n🥩 Res guisada + tostones — RD$300\n🐟 Pescado frito + ensalada — RD$350\n🍝 Pasta con pollo — RD$220\n🥗 Ensalada grande — RD$150\n🍮 Postre del día — RD$80\n🥤 Bebidas — desde RD$50\n\n¿Deseas hacer tu pedido?`,
    hours: '⏰ Horario: Todos los días 11am - 10pm',
  },
  salon: {
    name: '💇 Salón Belleza Total',
    menu: `📋 *Servicios - Belleza Total*\n\n✂️ Corte de cabello — RD$300\n💅 Manicure — RD$250\n💅 Pedicure — RD$350\n🎨 Tinte — desde RD$800\n💆 Tratamiento capilar — RD$500\n👰 Peinado especial — desde RD$600\n\n¿Deseas agendar una cita?`,
    hours: '⏰ Horario: Martes a Sábado 9am - 7pm',
  },
};

let currentBusiness = 'colmado';
let awaitingOrder = false;

function selectBusiness(type) {
  currentBusiness = type;
  const biz = businesses[type];

  // Update active button
  document.querySelectorAll('.business-card').forEach(c => c.classList.remove('active'));
  event.currentTarget.classList.add('active');

  // Update demo header
  document.getElementById('demo-business-name').textContent = biz.name;
  document.getElementById('welcome-name').textContent = biz.name.replace(/^.{2}/, '').trim();

  // Reset chat
  const chat = document.getElementById('chat-messages');
  chat.innerHTML = `
    <div class="msg bot">
      <div class="msg-bubble">¡Hola! 👋 Bienvenido a <strong>${biz.name}</strong>. ¿En qué te puedo ayudar?<br><br>
      1️⃣ Ver menú y precios<br>
      2️⃣ Hacer un pedido<br>
      3️⃣ Horarios<br>
      4️⃣ Hablar con el dueño</div>
    </div>`;
  awaitingOrder = false;

  // Scroll to demo
  document.getElementById('demo').scrollIntoView({ behavior: 'smooth' });
}

function sendMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  addMessage(text, 'user');
  setTimeout(() => botReply(text), 600);
}

function quickReply(text) {
  addMessage(text === '1' ? 'Ver menú' : text === '2' ? 'Hacer pedido' : 'Horarios', 'user');
  setTimeout(() => botReply(text), 600);
}

function handleKey(e) {
  if (e.key === 'Enter') sendMessage();
}

function addMessage(text, type) {
  const chat = document.getElementById('chat-messages');
  const div = document.createElement('div');
  div.className = `msg ${type}`;
  div.innerHTML = `<div class="msg-bubble">${text}</div>`;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function botReply(text) {
  const biz = businesses[currentBusiness];
  const lower = text.toLowerCase();
  let reply = '';

  if (text === '1' || lower.includes('menú') || lower.includes('menu') || lower.includes('precio')) {
    reply = biz.menu.replace(/\n/g, '<br>');
  } else if (text === '2' || lower.includes('pedido') || lower.includes('pedir') || lower.includes('quiero')) {
    reply = '📝 ¡Perfecto! Dime qué deseas pedir y la cantidad. Ejemplo: <em>"2 arroz y 1 pollo"</em>';
    awaitingOrder = true;
  } else if (text === '3' || lower.includes('horario') || lower.includes('hora') || lower.includes('abierto')) {
    reply = biz.hours;
  } else if (text === '4' || lower.includes('dueño') || lower.includes('hablar') || lower.includes('persona')) {
    reply = '📞 Te conectaré con el dueño en un momento. También puedes llamar al <strong>809-555-0000</strong>';
  } else if (awaitingOrder) {
    reply = `✅ ¡Pedido recibido! <strong>"${text}"</strong><br><br>📍 ¿Cuál es tu dirección de entrega o pasas a buscar?`;
    awaitingOrder = false;
  } else if (lower.includes('gracias') || lower.includes('ok') || lower.includes('listo')) {
    reply = '😊 ¡Con gusto! Estamos para servirte. ¿Hay algo más en que pueda ayudarte?';
  } else {
    reply = '🤔 No entendí bien. Por favor elige una opción:<br><br>1️⃣ Ver menú y precios<br>2️⃣ Hacer un pedido<br>3️⃣ Horarios<br>4️⃣ Hablar con el dueño';
  }

  addMessage(reply, 'bot');
}
