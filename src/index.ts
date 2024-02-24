import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV}` })
import server from "./server";

server.listen(process.env.PORT, () => {
    console.log('listening on *: ' +  process.env.PORT);
});