import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";

@Entity()
export class Wallet {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column()
  balance!: number;

  // Define any other properties you need for the wallet entity

  @ManyToOne(() => User, (user) => user.wallets)
  user!: User;
}