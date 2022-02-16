import fs from 'fs';
import {Client, Collection, Intents} from 'discord.js';
import commonReplics from './common/replics.js';
import type { Message } from 'discord.js';
import type { Command, CommandName, AnyChannel } from './common/types.d.js';

const prefix = '#';
const errorReplics = commonReplics.error;

class Cyborg {
  private client: Client;
  private commands: Collection<CommandName, Command>;

  constructor() {
    this.client = new Client({intents: [
      ...Object.values(Intents.FLAGS)
    ]});
    this.client.on('ready', () => {
      console.log('Cyborg activated...');
    });
    this.commands = new Collection<CommandName, Command>();
  }

  public async parseCommands() {
    const commandfiles =  fs.readdirSync('./build/commands')
      .filter(file =>  file.endsWith('.js'));
    const commands: Collection<CommandName,Command> = new Collection();
    for (const file of commandfiles) {
      const {default: command} = await import(`./commands/${file}`);
      commands.set(command.name, command);
    }
    this.commands = commands;
    return commands;
  }

  public async activate(token: string) {
    return await this.client.login(token);
  }

  public say(channel: AnyChannel, message: string) {
    channel.send(message);
  }

  public listen() {
    this.client.on('messageCreate', (message: Message) => {
      if (!message.content.startsWith(prefix) || message.author.bot) {
        return ;
      }
      this.execute(message);
    });
    return this.client;
  }

  private parseCommand(message: Message): [commandName: string, args: string[]] {
    const args = message.content.slice(prefix.length).split(/ +/);
    const commandName = args.shift()?.toLowerCase();
    if (!commandName) {
      throw new Error(errorReplics.NoCommandFound("unknown command"));
    }
    return [commandName, args];
  }

  private execute(message: Message) {
    try {
      const [commandName, args] = this.parseCommand(message);
      const command = this.commands.get(commandName);
      if (!command) {
        this.say(message.channel, errorReplics.NoCommandFound(commandName));
        return ;
      }
      command.execute(message, args);
    } catch(err: any) {
      this.say(message.channel, err.message);
    }
  }
}

export {Cyborg}