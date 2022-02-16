import * as dotenv from 'dotenv';
import {Cyborg} from './Cyborg.js';

dotenv.config();

const discord_token = process.env.CYBORG_TOKEN;
if (!discord_token) {
  throw new Error('CYBORG_TOKEN is not provided')
}
const cyborg = new Cyborg();
await cyborg.parseCommands();
await cyborg.activate(discord_token);
const client = cyborg.listen();
client.on('disconnect', () => console.error('disconected'));
