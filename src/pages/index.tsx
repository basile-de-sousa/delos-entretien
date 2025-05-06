import React from 'react';

export default function Home() {
  return (
    <div style={{ padding: 20 }}>
      <h1>Bienvenue sur Sport Chat</h1>
      <p>Choisis un sport pour commencer la conversation :</p>
      <ul>
        <li><a href="/football">Football</a></li>
        <li><a href="/tennis">Tennis</a></li>
        <li><a href="/boxe">Boxe</a></li>
        <li><a href="/surf">Boxe</a></li>
        <li><a href="/basket">Boxe</a></li>
      </ul>
    </div>
  );
}