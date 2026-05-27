// ================= MATCHMAKING =================
function match(){

  const arr = [...queue.entries()];

  // ================= PVP REAL =================
  if(arr.length >= 2){

    const [id1, a] = arr[0];
    const [id2, b] = arr[1];

    queue.delete(id1);
    queue.delete(id2);

    a.ws.inGame = true;
    b.ws.inGame = true;

    createRoom(
      { id:id1, ws:a.ws },
      { id:id2, ws:b.ws },
      false
    );

    console.log("PVP MATCH");

    return;
  }

  // ================= BOT SOLO SI ESPERA =================
  if(arr.length === 1){

    const [id, player] = arr[0];

    // evita timers infinitos
    if(player.waitingBot) return;

    player.waitingBot = true;

    console.log("WAITING PLAYER...");

    setTimeout(()=>{

      // sigue esperando?
      if(!queue.has(id)) return;

      queue.delete(id);

      player.ws.inGame = true;

      console.log("BOT MATCH");

      createRoom(
        { id, ws:player.ws },
        { id:"BOT", ws:null },
        true
      );

    },5000); // 5 segundos esperando jugador real
  }
}