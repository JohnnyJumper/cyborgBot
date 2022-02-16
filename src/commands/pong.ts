import type { Message } from 'discord.js';

export default {
  name: 'ping',
  description: 'you say ping, I say pong!',
  execute: (message: Message, args: string[]) => message.channel.send('Pong')
}
