import http from "http";
import app from "./app.js";
import dotenv from "dotenv";
import { initializeSocket } from "./socket.js";

const port = process.env.PORT || 5001;

const server = http.createServer(app);

initializeSocket(server);

server.on('error', (error) => {
    if (error.code === 'EACCES') {
        console.error(`Port ${port} requires elevated privileges`);
    }
    console.error(error);
});

server.listen(port , ()=>{
    console.log(`Server is running on port ${port}`)
})