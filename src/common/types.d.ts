import { Message } from 'discord.js';
import { 
  DMChannel,
  NewsChannel,
  PartialDMChannel,
  TextChannel,
  ThreadChannel 
} from "discord.js";

export type AnyChannel = DMChannel | PartialDMChannel | NewsChannel | TextChannel | ThreadChannel;

export type CommandName = string;

export type Command = {
  name: CommandName,
  description: string,
  execute: (message: Message, args: string[]) => void
}
